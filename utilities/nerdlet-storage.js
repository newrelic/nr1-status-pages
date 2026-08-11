import {
  AccountStorageMutation,
  AccountStorageQuery,
  EntityStorageMutation,
  EntityStorageQuery,
  UserStorageMutation,
  UserStorageQuery,
} from 'nr1';

const HOST_NAMES_COLLECTION_KEY = 'host_names_v1';
const HOST_NAMES_DOCUMENT_ID = 'host_names';

// The account/entity storage SDKs are structurally identical (query, mutate,
// action type, key field) — dispatch on keyObject.type through one table
// instead of maintaining four near-duplicate wrapper functions.
const STORAGE_BY_TYPE = {
  account: {
    query: (queryProp) => AccountStorageQuery.query(queryProp),
    mutate: (mutationProp) => AccountStorageMutation.mutate(mutationProp),
    mutationActionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    keyField: 'accountId',
  },
  entity: {
    query: (queryProp) => EntityStorageQuery.query(queryProp),
    mutate: (mutationProp) => EntityStorageMutation.mutate(mutationProp),
    mutationActionType: EntityStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    keyField: 'entityGuid',
  },
};

const getStorageConfig = (type) => {
  const config = STORAGE_BY_TYPE[type];
  if (!config) throw new Error('Invalid keyObject');
  return config;
};

const _getHostNameFromQueryResults = (queryResults) => queryResults.data || [];

export const getHostNamesFromNerdStorage = async (keyObject) => {
  const { query, keyField } = getStorageConfig(keyObject.type);

  let result;
  try {
    result = _getHostNameFromQueryResults(
      await query({
        collection: HOST_NAMES_COLLECTION_KEY,
        documentId: HOST_NAMES_DOCUMENT_ID,
        [keyField]: keyObject.key,
      })
    );
  } catch (err) {
    console.error(err);
    result = [];
  }

  return result?.hostNames || [];
};

const USER_ACCOUNT_COLLECTION = 'user_account_collection_v1';
const USER_SELECTED_ACCOUNT_ID = 'user_account_id';

export const getLastChosenAccountId = async () => {
  const queryResults = await UserStorageQuery.query({
    collection: USER_ACCOUNT_COLLECTION,
    documentId: USER_SELECTED_ACCOUNT_ID,
  });
  return queryResults.data;
};

export const saveLastChosenAccountId = async (accountId) => {
  return UserStorageMutation.mutate({
    actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    collection: USER_ACCOUNT_COLLECTION,
    document: { account: accountId },
    documentId: USER_SELECTED_ACCOUNT_ID,
  });
};

const TILE_ORDER_COLLECTION = 'tile_order_v1';
const TILE_ORDER_DOCUMENT_ID = 'tile_order';

export const getUserTileOrder = async () => {
  const result = await UserStorageQuery.query({
    collection: TILE_ORDER_COLLECTION,
    documentId: TILE_ORDER_DOCUMENT_ID,
  });
  return result.data?.order || null;
};

export const saveUserTileOrder = async (order) => {
  return UserStorageMutation.mutate({
    actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    collection: TILE_ORDER_COLLECTION,
    document: { order },
    documentId: TILE_ORDER_DOCUMENT_ID,
  });
};

export const saveHostNamesToNerdStorage = async (keyObject, document) => {
  const { mutate, mutationActionType, keyField } = getStorageConfig(
    keyObject.type
  );

  return mutate({
    collection: HOST_NAMES_COLLECTION_KEY,
    documentId: HOST_NAMES_DOCUMENT_ID,
    document: { hostNames: document },
    actionType: mutationActionType,
    [keyField]: keyObject.key,
  });
};
