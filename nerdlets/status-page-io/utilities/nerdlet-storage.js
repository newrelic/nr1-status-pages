
const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'

import {AccountStorageQuery} from 'nr1';

export default class AccountNerdletStorage {

    constructor(accountId, refreshRateInSeconds) {
        this.accountId = accountId;
        this.refreshRateInSeconds = refreshRateInSeconds;
    }

    async _fetchAndPopulateData(dataGetFunction, callbackSetterFunction) {
        const returnedData = await dataGetFunction(callbackSetterFunction);
        callbackSetterFunction(returnedData);
    }

    _pollData(dataGetFunction, callbackSetterFunction) {
        setTimeout(async () => {
            try {
                this._fetchAndPopulateData(dataGetFunction, callbackSetterFunction);
            } catch(err) {
                console.error(err);
            } finally {
                this._pollData(dataGetFunction, callbackSetterFunction)
            }
        }, this.refreshRateInSeconds * 1000);
    }

    async pollStatusPageIoHostNames(callbackSetterFunction) {
        // Populate initial data before we start polling
        this._pollData(this.getStatusPageIoHostNames.bind(this), callbackSetterFunction)
    }

    async getStatusPageIoHostNames() {
        const queryProp = {
            accountId: this.accountId,
            collection: HOST_NAMES_COLLECTION_KEY,
            documentId: HOST_NAMES_DOCUMENT_ID
        }
        try {
            const docQueryRresults = await AccountStorageQuery.query(queryProp);
            if (docQueryRresults.data) {
                let hostNames = docQueryRresults.data.actor.account.nerdStorage.document;
                if (!hostNames) {
                    hostNames = [];
                }
                return hostNames;
            }
        } catch(err) {
            console.log(err);
        }
    }

}