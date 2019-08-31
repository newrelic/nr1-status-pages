
const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'

import { AccountStorageMutation, AccountStorageQuery, EntityStorageMutation, EntityStorageQuery } from 'nr1';

const _getHostNameFromQueryResults = (queryResults, type) => {
    if (queryResults.data) {
        let hostNames = queryResults.data.actor[type].nerdStorage.document;
        if (!hostNames) {
            hostNames = [];
        }
        return hostNames;
    };
    return [];
}

const getHostNameFromAccountStorage = async (accountId, queryProp) => {
    queryProp.accountId = accountId;
    try {
       return _getHostNameFromQueryResults(await AccountStorageQuery.query(queryProp), 'account');
    } catch(err) {
        console.log(err);
    }
}

const getHostNameFromEntityStorage = async (entityGuid, queryProp) => {
    queryProp.entityGuid = entityGuid;
    try {
        return _getHostNameFromQueryResults(await EntityStorageQuery.query(queryProp), 'entity');
    } catch(err) {
        console.log(err);
    }
}

const saveHostNamesToAccountStorage = async(accountId, mutationProp) => {
    mutationProp.accountId = accountId;
    mutationProp.actionType = AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT;
    return AccountStorageMutation.mutate(mutationProp);
}

const saveHostNamesToEntityStorage = async(entityGuid, mutationProp) => {
    mutationProp.entityGuid = entityGuid;
    mutationProp.actionType = EntityStorageMutation.ACTION_TYPE.WRITE_DOCUMENT;
    return EntityStorageMutation.mutate(mutationProp);
}


export const getHostNamesFromNerdStorage = async (keyObject) => {
    const queryProp = {
        collection: HOST_NAMES_COLLECTION_KEY,
        documentId: HOST_NAMES_DOCUMENT_ID
    }
    if (keyObject.type === 'account') {
        return getHostNameFromAccountStorage(keyObject.key, queryProp);
    } else if (keyObject.type === 'entity'){
        return getHostNameFromEntityStorage(keyObject.key, queryProp);
    }
}

export const saveHostNamesToNerdStorage = async (keyObject, document) => {
    const mutationProp = {
        collection: HOST_NAMES_COLLECTION_KEY,
        document: document,
        documentId: HOST_NAMES_DOCUMENT_ID
    }
    if (keyObject.type === 'account') {
        return saveHostNamesToAccountStorage(keyObject.key, mutationProp);
    } else if (keyObject.type === 'entity'){
        return saveHostNamesToEntityStorage(keyObject.key, mutationProp);
    }
}

