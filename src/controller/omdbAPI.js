import makeXHRRequest from './xhrRequest';

/**
 * This method use the makeXHRRequest to crate API call to the freemusicarchive service and return promise.
 * @param query
 */
export function movieSearch(query) {
    return makeXHRRequest(
        {
            method: 'GET',
            url: `http://www.omdbapi.com/?s='${query}&y=&plot=short&r=json`,
        });
}

export function parseMovieReturnData(fullData) {
    let searchResultFormat = [];
    let dataInJsonFormat = JSON.parse(fullData);
    if (dataInJsonFormat.hasOwnProperty('Search')) {
        dataInJsonFormat.Search.forEach(function (movieEntity) {
            searchResultFormat.push({
                title: `${movieEntity.Title} (${movieEntity.Year})`,
                link: movieEntity.Poster
            });
        });
    }
    return searchResultFormat;
}