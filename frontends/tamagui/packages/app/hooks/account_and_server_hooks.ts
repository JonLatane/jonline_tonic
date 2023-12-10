import { AccountOrServer, AppDispatch, FederatedEntity, HasIdFromServer, accountID, selectAllAccounts, selectAllServers, serverID } from 'app/store';
import { useAppDispatch, useAppSelector } from "./store_hooks";


export const useAccount = () => useAppSelector(state => state.accounts.account);
export const useServer = () => useAppSelector(state => state.servers.server);
export function useAccountOrServer(): AccountOrServer {
  return {
    account: useAccount(),
    server: useServer()
  };
}

export function useCurrentAndPinnedServers(): AccountOrServer[] {
  const accountOrServer = useAccountOrServer();
  const { server } = accountOrServer;
  const pinnedServers = useAppSelector(state =>
    state.accounts.pinnedServers
      .filter(ps => ps.pinned && (!server || ps.serverId !== serverID(server)))
      .map(pinnedServer => ({
        account: selectAllAccounts(state.accounts).find(a => accountID(a) === pinnedServer.accountId),
        server: selectAllServers(state.servers).find(s => serverID(s) === pinnedServer.serverId)
      }))
      .filter(aos => aos.server)
  );
  return [accountOrServer, ...pinnedServers];
}

export function useFederatedAccountOrServer<T extends HasIdFromServer>(entity: FederatedEntity<T> | string | undefined): AccountOrServer {
  const currentAndPinnedServers = useCurrentAndPinnedServers();
  const currentAccountOrServer = useAccountOrServer();
  if (!entity) return currentAccountOrServer;

  const hostname = typeof entity === 'string' ? entity : entity.serverHost;
  return currentAndPinnedServers.find(aos => aos.server?.host === hostname) ?? {};
}

export type CredentialDispatch = {
  dispatch: AppDispatch;
  accountOrServer: AccountOrServer;
};
export function useCredentialDispatch(): CredentialDispatch {
  return {
    dispatch: useAppDispatch(),
    accountOrServer: useAccountOrServer()
  };
}

export function useFederatedDispatch<T extends HasIdFromServer>(entity: FederatedEntity<T> | string | undefined): CredentialDispatch {
  return {
    dispatch: useAppDispatch(),
    accountOrServer: useFederatedAccountOrServer(entity)
  };
}
