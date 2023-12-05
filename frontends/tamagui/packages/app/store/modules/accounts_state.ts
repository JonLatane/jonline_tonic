import { User } from "@jonline/api";
import { formatError } from "@jonline/ui";
import {
  Dictionary,
  EntityId,
  PayloadAction,
  createEntityAdapter,
  createSlice
} from "@reduxjs/toolkit";
import 'react-native-get-random-values';
import { getCredentialClient, resetAccessTokens, resetCredentialedData, store } from "..";
import { PinnedServer } from '../federation';
import { JonlineAccount, JonlineServer } from "../types";
import { createAccount, login } from "./account_actions";
import { serverID, upsertServer } from './servers_state';

export interface AccountsState {
  status: "unloaded" | "loading" | "loaded" | "errored";
  error?: Error;
  successMessage?: string;
  errorMessage?: string;
  account?: JonlineAccount;
  // Allows a user to be primarily signed into the above account,
  // but view data from other servers (and accounts on those servers).
  pinnedServers: PinnedServer[];
  ids: EntityId[];
  entities: Dictionary<JonlineAccount>;
}

export function accountID(account: JonlineAccount | undefined): string | undefined {
  if (!account) return undefined;

  return `${serverID(account.server)}-${account.user.id}`;
}
const accountsAdapter = createEntityAdapter<JonlineAccount>({
  selectId: (account) => accountID(account)!,
});

const initialState: AccountsState = {
  status: "unloaded",
  error: undefined,
  pinnedServers: [],
  ...accountsAdapter.getInitialState(),
};

export const accountsSlice = createSlice({
  name: "accounts",
  initialState: initialState,//{ ...initialState, ...JSON.parse(localStorage.getItem("accounts")) },
  reducers: {
    upsertAccount: (state, action: PayloadAction<JonlineAccount>) => {
      accountsAdapter.upsertOne(state, action.payload);
      if (accountID(state.account) === accountID(action.payload)) {
        state.account = action.payload;
      }
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      if (accountID(state.account) === action.payload) {
        state.account = undefined;
      }
      accountsAdapter.removeOne(state, action);
    },
    resetAccounts: () => initialState,
    selectAccount: (state, action: PayloadAction<JonlineAccount | undefined>) => {
      if (accountID(state.account) != accountID(action.payload)) {
        resetCredentialedData();
      }
      resetAccessTokens();
      state.account = action.payload;

      // Verify that the account is still valid by loading the user data
      const account = action.payload;
      if (account) {
        console.log("Verifying account is still valid");
        setTimeout(async () => {
          const client = await getCredentialClient({ account, server: account.server })
          console.log("Loaded client");
          client.getCurrentUser({}, client.credential).then(user => {
            console.log("Account is still valid");
            store.dispatch(accountsSlice.actions.upsertAccount({ ...account, user }));
          }).catch(() => {
            console.warn("Failed to load account user data, account may have been deleted.");
            store.dispatch(accountsSlice.actions.upsertAccount({ ...account, lastSyncFailed: true, needsReauthentication: true }));
            store.dispatch(accountsSlice.actions.selectAccount(undefined));
          });
        }, 1);
      }
    },
    clearAccountAlerts: (state) => {
      state.errorMessage = undefined;
      state.successMessage = undefined;
      state.error = undefined;
    },
    upsertUserData(state, action: PayloadAction<{ user: User, server: JonlineServer }>) {
      for (const accountId in state.entities) {
        const account = state.entities[accountId]!;
        const { user: accountUser, server: accountServer } = account;
        const { user: payloadUser, server: payloadServer } = action.payload;
        if (serverID(accountServer) === serverID(payloadServer) && accountUser.id == payloadUser.id) {
          account.user = action.payload.user;
        }
        //TODO does this work as expected?
      }
    },
    notifyUserDeleted: (state, action: PayloadAction<{ user: User, server: JonlineServer }>) => {
      for (const id in state.entities) {
        const account = state.entities[id]!;
        const { user: accountUser, server: accountServer } = account;
        const { user: payloadUser, server: payloadServer } = action.payload;
        if (serverID(accountServer) === serverID(payloadServer) && accountUser.id == payloadUser.id) {
          account.needsReauthentication = true;
          account.lastSyncFailed = true;
          if (state.account && accountID(state.account) === accountID(account)) {
            state.account = undefined;
          }
        }
      }
    },
    moveAccountUp: (state, action: PayloadAction<string>) => {
      const index = state.ids.indexOf(action.payload);
      if (index > 0) {
        const element = state.ids.splice(index, 1)[0]!;
        state.ids.splice(index - 1, 0, element);
      }
    },
    moveAccountDown: (state, action: PayloadAction<string>) => {
      const index = state.ids.indexOf(action.payload);
      if (index < state.ids.length - 1) {
        const element = state.ids.splice(index, 1)[0]!;
        state.ids.splice(index + 1, 0, element);
      }
    },
    pinServer: (state, action: PayloadAction<PinnedServer>) => {
      const existing = state.pinnedServers.find(s => s.serverId === action.payload.serverId);
      if (existing) {
        existing.accountId = action.payload.accountId ?? existing.accountId;
        existing.pinned = action.payload.pinned;
      } else {
        state.pinnedServers.push(action.payload);
      }
    },
    pinAccount: (state, action: PayloadAction<JonlineAccount>) => {
      const existing = state.pinnedServers.find(s => s.serverId === serverID(action.payload.server));
      if (existing) {
        existing.accountId = accountID(action.payload);
        // existing.pinned = ;
      } else {
        state.pinnedServers.push({
          serverId: serverID(action.payload.server),
          accountId: accountID(action.payload),
          pinned: false
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAccount.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(createAccount.fulfilled, (state, action) => {
      state.status = "loaded";
      state.account = action.payload;
      accountsAdapter.upsertOne(state, action.payload);
      state.successMessage = `Created account ${action.payload.user.username}`;
      resetCredentialedData();
    });
    builder.addCase(createAccount.rejected, (state, action) => {
      state.status = "errored";
      state.error = action.error as Error;
      state.errorMessage = formatError(action.error as Error);
      state.error = action.error as Error;
    });
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "loaded";
      state.account = action.payload;
      accountsAdapter.upsertOne(state, { ...action.payload, lastSyncFailed: false, needsReauthentication: false });
      state.successMessage = `Logged in as ${action.payload.user.username}`;
      resetCredentialedData();
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "errored";
      state.error = action.error as Error;
      state.errorMessage = formatError(action.error as Error);
      state.error = action.error as Error;
    });
    builder.addCase(upsertServer.fulfilled, (state, action) => {
      for (const accountId in state.entities) {
        const account = state.entities[accountId]!;
        if (serverID(account.server) === serverID(action.payload)) {
          account.server = action.payload;
        }
      }
    });
  },
});

export const { selectAccount, removeAccount, clearAccountAlerts,
  resetAccounts, upsertUserData, notifyUserDeleted,
  moveAccountUp, moveAccountDown,
  pinServer, pinAccount } = accountsSlice.actions;

export const { selectAll: selectAllAccounts, selectTotal: selectAccountTotal } = accountsAdapter.getSelectors();
export const accountsReducer = accountsSlice.reducer;
export default accountsReducer;
