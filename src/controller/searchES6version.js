import makeXHRRequest from './xhrRequest';
// todo: add import for CSS here, to make this file a standalone module

export default class MySearch {

    parseReturnData(type, dataObject) {
        let searchResultForamt = [];

        if (type === 'freemusicarchive') {

            dataObject.aRows.forEach(function (trackDetails) {
                let trackDetailsSplit = trackDetails.split("]");
                searchResultForamt.push({
                    title: trackDetailsSplit[0].substring(1),
                    textinfo: trackDetailsSplit[1]
                });
            });
        }
        else if (type === 'omdbapi') {

            if (dataObject.hasOwnProperty('Search')) {
                dataObject.Search.forEach(function (movieEntity) {

                    searchResultForamt.push({
                        title: `${movieEntity.Title} (${movieEntity.Year})`,
                        link: movieEntity.Poster
                    });
                });
            }
        }

        return searchResultForamt;
    }

    addResultToPage(data, location) {
// todo: remove all those spaces!

        var ulElement = document.getElementById(location);

        // todo: create a method that receives the data, and returns an array of elements that should be appended to the ulElement
        data.forEach(function (searchResultEntity) {

            // method 1
            let liElement = document.createElement("LI");
            liElement.className = "search-result-li";
            let titleElement = document.createElement("span");
            let titleText = document.createTextNode(searchResultEntity.title);
            titleElement.appendChild(titleText);
            titleElement.className = "search-result-li-title";

            liElement.appendChild(titleElement);

            if (searchResultEntity.textinfo) {
                // method 2
                let pElement = document.createElement("p");
                let pText = document.createTextNode(searchResultEntity.textinfo);
                pElement.appendChild(pText);

                liElement.appendChild(pElement);
            }

            let linkName = '';
            if (searchResultEntity.link) {
                // method 3
                if (searchResultEntity.link.length > 10) {
                    linkName = searchResultEntity.link.substring(0, 30) + '...';
                } else {
                    linkName = searchResultEntity.link;
                }
                let pElement = document.createElement("p");
                // todo: use lower case A (a) please
                let linkElement = document.createElement("A");
                let linkText = document.createTextNode(linkName);
                linkElement.setAttribute("href", searchResultEntity.link);
                linkElement.setAttribute("target", "_blank"); // use this to open in a new tab
                linkElement.appendChild(linkText);
                pElement.appendChild(linkElement);
                liElement.appendChild(pElement);
            }


            ulElement.appendChild(liElement);


        });

    }

    /**
     * This method receive query and search that query on the freemusicarchive.
     * The query result will display on the screen using the addResultToPage helping method.
     * @param query - string to look for.
     */
    trackSearch(query) {
        let request = makeXHRRequest(
            {
                method: 'GET',
                url: `https://freemusicarchive.org/api/trackSearch?q='${query}&limit=10`,
            });

        request.then(function (data) {
            //todo: make 'search-result-right-ul' into a const
            this.addResultToPage(this.parseReturnData('freemusicarchive', JSON.parse(data)), 'search-result-right-ul');
        }.bind(this));
        request.catch(function (err) {
            console.error('ERROR, failed to retrieve track details!', err.statusText);
        });
    }

    /**
     * This method receive query and search that query on the omdbapi.
     * The query result will display on the screen using the addResultToPage helping method.
     * @param query - string to look for.
     */
    movieSearch(query) {
        let request = makeXHRRequest(
            {
                method: 'GET',
                url: `http://www.omdbapi.com/?s='${query}&y=&plot=short&r=json`,
            });

        request.then(function (data) {
            // todo: move 'search-result-left-ul' to const
            this.addResultToPage(this.parseReturnData('omdbapi', JSON.parse(data)), 'search-result-left-ul');
        }.bind(this));

        request.catch(function (err) {
            console.error('ERROR, failed to retrieve movies details from omdbapi!', err.statusText);
        });
    }

    //add functionality to the Go! button.
    constructor() {

        document.getElementById('search-button').onclick = function () {
            let query = document.getElementById('query').value;

            // clears the current view - todo: separate into another method + use one-liners
            let searchElement = document.getElementById("search-result-left-ul");
            searchElement.innerHTML = "";
            // while (searchElement.firstChild) {
            //     searchElement.removeChild(searchElement.firstChild);
            // }

            searchElement = document.getElementById('search-result-right-ul');
            searchElement.innerHTML = "";
            // while (searchElement.firstChild) {
            //     searchElement.removeChild(searchElement.firstChild);
            // }
            // end of clear current view

            this.trackSearch(query);
            this.movieSearch(query);
        }.bind(this);
    }
};