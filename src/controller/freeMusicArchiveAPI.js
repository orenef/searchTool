import makeXHRRequest from './xhrRequest';

export default class FreeMusicArchiveService {
    /**
     * This method use the makeXHRRequest to crate API call to the omdbapi service and return promise.
     * @param query
     */
    searchQuery(query) {
        return new Promise((resolve, reject) => {
            let xhrRequest = makeXHRRequest(
                {
                    method: 'GET',
                    url: `https://freemusicarchive.org/api/trackSearch?q='${query}&limit=10`,
                });

            xhrRequest.then((data) =>
                    resolve(this.parseTracReturnData(data)));

        })
    }

    /**
     * This method extract from fullData the relevant data to present. AKA: title and textInfo.
     * @param fullData
     * @returns {Array}
     */
    parseTracReturnData(fullData) {
        let searchResultFormat = [];
        let dataInJsonFormat = JSON.parse(fullData);
        dataInJsonFormat.aRows.forEach(function (trackDetails) {
            let trackDetailsSplit = trackDetails.split("]");
            searchResultFormat.push({
                title: trackDetailsSplit[0].substring(1),
                textInfo: trackDetailsSplit[1]
            });
        });
        return searchResultFormat;
    }
}
