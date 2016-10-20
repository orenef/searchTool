import makeXHRRequest from './xhrRequest';

export default class OmdbMovieSearchService {
    /**
     * This method use the makeXHRRequest to create API calls to the freemusicarchive service and return a promise with the response from server
     * @param query - the text to search
     */
    searchQuery(query) {
        return new Promise((resolve, reject) => {
            makeXHRRequest(
                {
                    method: 'GET',
                    url: `http://www.omdbapi.com/?s='${query}&y=&plot=short&r=json`,
                })
                .then((data) =>
                    resolve(this.parseMovieReturnData(data)));
        });
    }

    /**
     * This method extract from fullData the relevant data to present. AKA: title and link.
     * @param fullData
     * @returns {Array}
     */
    parseMovieReturnData(fullData) {
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
}