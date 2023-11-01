import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
  PayloadAction
} from "@reduxjs/toolkit";
import { deleteClient, getServerClient, resetCredentialedData, store } from "..";
import { Platform } from 'react-native';
import { JonlineServer } from "../types";
import { GetServiceVersionResponse } from "@jonline/api";

export function serverID(server: JonlineServer): string {
  return `http${server.secure ? "s" : ""}:${server.host}`;
}

export function serverUrl(server: JonlineServer): string {
  return `http${server.secure ? "s" : ""}://${server.host}`;
}

export function frontendServerUrl(server: JonlineServer): string {
  const host = server.serverConfiguration?.externalCdnConfig?.frontendHost ?? server.host;
  return `http${server.secure ? "s" : ""}://${host}`;
}

export function backendServerUrl(server: JonlineServer): string {
  const host = server.serverConfiguration?.externalCdnConfig?.backendHost ?? server.host;
  return `http${server.secure ? "s" : ""}://${host}`;
}

// Used for External CDN support.
//
// Provides the implicit backend host for this app. Note that it may not be the server
// the user is currently using. But, it's assumed to be the *default* backend server
// for the frontend a user sees in the browser. 
export const getBackendHost = () => _backendHost;
// Provides the implicit frontend host for this app, i.e. the host that the backend
// thinks the frontend is running on. Provides aliasing of servers
export const getFrontendHost = () => _frontendHost;

export interface ServersState {
  status: "unloaded" | "loading" | "loaded" | "errored";
  error?: Error;
  successMessage?: string;
  errorMessage?: string;
  // Current server the app is pointing to.
  server?: JonlineServer;
  ids: EntityId[];
  entities: Dictionary<JonlineServer>;
}

export const serversAdapter = createEntityAdapter<JonlineServer>({
  selectId: serverID,
});

export const upsertServer = createAsyncThunk<JonlineServer, JonlineServer>(
  "servers/create",
  async (server, state) => {
    // getServerClient will update/upsert the server as a side effect.
    let client = await getServerClient(server);
    // let serviceVersion: GetServiceVersionResponse = await Promise.race([client.getServiceVersion({}), timeout(5000, "service version")]);
    // let serverConfiguration = await Promise.race([client.getServerConfiguration({}), timeout(5000, "server configuration")]);
    return server;
  }
);

// Initialize the app with a server asynchronously, after the store has already
// been initialized. This lets us detect CDN changes.
let _backendHost: string | undefined = undefined;
let _frontendHost: string | undefined = undefined;

setTimeout(async () => {
  if (Platform.OS != 'web') {
    const initialServer = {
      host: 'jonline.io',
      secure: true,
    };
    initializeWithServer(initialServer);
    return;
  }

  while (!globalThis.window) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!store.getState().servers.server) {
    let initialServer: JonlineServer;
    if (Platform.OS == 'web' && globalThis.window?.location) {
      const domain = //backendHost && backendHost != ''
        //? backendHost
        //: 
        window.location.hostname;
      initialServer = {
        host: domain,
        secure: window.location.protocol === 'https:',
      }
    } else {
      initialServer = {
        host: 'jonline.io',
        secure: true,
      };
    }
    initializeWithServer(initialServer);
  }
}, 1);

function initializeWithServer(initialServer: JonlineServer) {
  getServerClient(initialServer).then(() => {
    const serversState = store.getState().servers;
    if (serversState.server = undefined) {
      const server = serversState.entities[serverID(initialServer)];
      store.dispatch(selectServer(server));
    }
  });
}

const initialState: ServersState = {
  status: "unloaded",
  error: undefined,
  server: undefined,
  ...serversAdapter.getInitialState(),
};

export const serversSlice = createSlice({
  name: "servers",
  initialState: initialState,
  reducers: {
    upsertServer: serversAdapter.upsertOne,
    removeServer: (state, action: PayloadAction<JonlineServer>) => {
      if (state.server && serverID(state.server) == serverID(action.payload)) {
        state.server = serversAdapter.getSelectors().selectAll(state)
          .filter(s => serverID(s) != serverID(action.payload))[0];
        //[serverID(action.payload)];//serversAdapter(state, serverID(action.payload));
      }
      deleteClient(action.payload);
      serversAdapter.removeOne(state, serverID(action.payload));
    },
    resetServers: () => initialState,
    clearServerAlerts: (state) => {
      state.errorMessage = undefined;
      state.successMessage = undefined;
      state.error = undefined;
    },
    selectServer: (state, action: PayloadAction<JonlineServer | undefined>) => {
      let currentUrl = state.server ? serverID(state.server) : undefined;
      if (currentUrl != serverID(action.payload!)) {
        resetCredentialedData();
      }
      state.server = action.payload;
    },
    moveServerUp: (state, action: PayloadAction<string>) => {
      const index = state.ids.indexOf(action.payload);
      if (index > 0) {
        const element = state.ids.splice(index, 1)[0]!;
        state.ids.splice(index - 1, 0, element);
      }
    },
    moveServerDown: (state, action: PayloadAction<string>) => {
      const index = state.ids.indexOf(action.payload);
      if (index < state.ids.length - 1) {
        const element = state.ids.splice(index, 1)[0]!;
        state.ids.splice(index + 1, 0, element);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(upsertServer.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(upsertServer.fulfilled, (state, action) => {
      state.status = "loaded";
      let server = action.payload;
      serversAdapter.upsertOne(state, action.payload);
      if (!state.server || serverID(server) == serverID(state.server!)) {
        state.server = server;
      }
      console.log(`Server ${action.payload.host} running Jonline v${action.payload.serviceVersion?.version} added.`);
      state.successMessage = `Server added.`;
    });
    builder.addCase(upsertServer.rejected, (state, action) => {
      state.status = "errored";
      console.error(`Error connecting to ${action.meta.arg.host}.`, action.error);
      state.errorMessage = `Error connecting to ${action.meta.arg.host}.`;
      state.error = action.error as Error;
    });
  },
});

export const { selectServer, removeServer, clearServerAlerts, resetServers, moveServerUp, moveServerDown } = serversSlice.actions;

export const { selectAll: selectAllServers, selectById: selectServerById, selectTotal: selectServerTotal } = serversAdapter.getSelectors();

export const serversReducer = serversSlice.reducer;
export default serversReducer;
