import { ReactNativeTransport } from "@improbable-eng/grpc-web-react-native-transport";
import { GrpcWebImpl, Jonline, JonlineClientImpl } from "@jonline/api";
import { Platform } from "react-native";
import { serverID, upsertServer } from "./modules";
import { store } from "./store";
import { JonlineServer } from "./types";

const clients = new Map<string, JonlineClientImpl>();
export async function getServerClient(server: JonlineServer): Promise<Jonline> {
  // Resolve the actual backend server from its backend_host endpoint
  const backendHost = await window.fetch(
    `${server.secure ? 'https' : 'http'}://${server.host}/backend_host`
  ).then(async (r) => {
    const domain = await r.text();
    if (domain == '') return undefined;
    return domain;
  }).catch((e) => {
    console.error(e);
    return undefined;
  }) ?? server.host;

  // Get the gRPC client
  const host = `${serverID({...server, host: backendHost}).replace(":", "://")}:27707`;
  if (!clients.has(host)) {
    const client = new JonlineClientImpl(
      new GrpcWebImpl(host, {
        transport: Platform.OS == 'web' ? undefined : ReactNativeTransport({})
      })
    );
    clients.set(host, client);
    try {
      const serviceVersion = await Promise.race([client.getServiceVersion({}), timeout(5000, "service version")]);
      const serverConfiguration = await Promise.race([client.getServerConfiguration({}), timeout(5000, "server configuration")]);
      store.dispatch(upsertServer({ ...server, serviceVersion, serverConfiguration }));
    } catch (e) {
      clients.delete(host);
    }
    return client;
  }
  return clients.get(host)!;
}
const timeout = async (time: number, label: string) => {
  await new Promise((res) => setTimeout(res, time));
  throw `Timed out getting ${label}.`;
}
