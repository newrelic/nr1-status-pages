
const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'

import {AccountStorageQuery} from 'nr1';

export default class AccountNerdletStorage {

    constructor(accountId) {
        this.accountId = accountId;
    }

    async getStatusPageIoHostNames(accountId) {
        const queryProp = {
            accountId: accountId,
            collection: HOST_NAMES_COLLECTION_KEY,
            documentId: HOST_NAMES_DOCUMENT_ID
        }
        try {
            console.log(queryProp);
            return AccountStorageQuery.query(queryProp).then(docQueryRresults => {
                console.log(docQueryRresults);
                if (docQueryRresults.data) {
                    let hostNames = docQueryRresults.data.actor.account.nerdStorage.document;
                    if (!hostNames) {
                        hostNames = [];
                    }
                    return hostNames;
            }});
        } catch(err) {
            console.log(err);
        }
    }

}