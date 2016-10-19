import makeXHRRequest from './xhrRequest';


/**
 * This method use the makeXHRRequest to crate API call to the omdbapi service and return promise.
 * @param query
 */
export function trackSearch(query) {
    return makeXHRRequest(
        {
            method: 'GET',
            url: `https://freemusicarchive.org/api/trackSearch?q='${query}&limit=10`,
        });
}

export function parseTracReturnData(fullData) {
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