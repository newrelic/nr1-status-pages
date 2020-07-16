import {
  AccountStorageMutation,
  AccountStorageQuery,
  EntityStorageMutation,
  EntityStorageQuery
} from 'nr1';

const HOST_NAMES_COLLECTION_KEY = 'host_names_v1';
const HOST_NAMES_DOCUMENT_ID = 'host_names';

const _getHostNameFromQueryResults = queryResults => {
  if (queryResults.data) {
    let hostNames = queryResults.data;
    if (!hostNames) {
      hostNames = [];
    }
    return hostNames;
  }
  return [];
};

const getHostNameFromAccountStorage = async (accountId, queryProp) => {
  queryProp.accountId = accountId;
  try {
    return _getHostNameFromQueryResults(
      await AccountStorageQuery.query(queryProp)
    );
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
  }
};

const getHostNameFromEntityStorage = async (entityGuid, queryProp) => {
  queryProp.entityGuid = entityGuid;
  try {
    return _getHostNameFromQueryResults(
      await EntityStorageQuery.query(queryProp)
    );
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
  }
};

const saveHostNamesToAccountStorage = async (accountId, mutationProp) => {
  mutationProp.accountId = accountId;
  mutationProp.actionType = AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT;
  return AccountStorageMutation.mutate(mutationProp);
};

const saveHostNamesToEntityStorage = async (entityGuid, mutationProp) => {
  mutationProp.entityGuid = entityGuid;
  mutationProp.actionType = EntityStorageMutation.ACTION_TYPE.WRITE_DOCUMENT;
  return EntityStorageMutation.mutate(mutationProp);
};

export const getHostNamesFromNerdStorage = async keyObject => {
  const queryProp = {
    collection: HOST_NAMES_COLLECTION_KEY,
    documentId: HOST_NAMES_DOCUMENT_ID
  };

  let result;

  if (keyObject.type === 'account') {
    result = await getHostNameFromAccountStorage(keyObject.key, queryProp);
  } else if (keyObject.type === 'entity') {
    result = await getHostNameFromEntityStorage(keyObject.key, queryProp);
  } else {
    throw new Error('Invalid keyObject');
  }

  return result.hostNames || [];
};

export const saveHostNamesToNerdStorage = async (keyObject, document) => {
  const mutationProp = {
    collection: HOST_NAMES_COLLECTION_KEY,
    document: { hostNames: document },
    documentId: HOST_NAMES_DOCUMENT_ID
  };

  if (keyObject.type === 'account') {
    saveHostNamesToAccountStorage(keyObject.key, mutationProp);
  } else if (keyObject.type === 'entity') {
    saveHostNamesToEntityStorage(keyObject.key, mutationProp);
  } else {
    throw new Error('Invalid keyObject');
  }
};
