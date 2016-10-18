mysearch = function (query) {

    //add functionality to the Go! button.
    document.getElementById('searchButton').onclick = function () {
        var query = document.getElementById('query').value;
        var searchElment = document.getElementById("search-result-left-ul");
        while (searchElment.firstChild) {
            searchElment.removeChild(searchElment.firstChild);
        }

        searchElment = document.getElementById("search-result-right-ul");
        while (searchElment.firstChild) {
            searchElment.removeChild(searchElment.firstChild);
        }
        trackSearch(query);
        movieSearch(query);
    };


    /**
     * This method get http opts - json that might include method,url,headers,params,
     * and return the server answer to the given http request.
     * @param opts
     * @returns {Promise}
     */
    function makeXHRRequest(opts) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(opts.method, opts.url);

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };

            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (opts.headers) {
                Object.keys(opts.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, opts.headers[key]);
                });
            }
            var params = opts.params;
            if (params && typeof params === 'object') {
                params = Object.keys(params).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                }).join('&');
            }
            xhr.send(params);
        });
    }

    /**
     * This method receive query and search that query on the freemusicarchive.
     * The query result will display on the screen using the addResultToPage helping method.
     * @param query - string to look for.
     */
    function trackSearch(query) {
        var request = makeXHRRequest(
            {
                method: 'GET',
                url: 'https://freemusicarchive.org/api/trackSearch?q=' + query + '&limit=10',
            });

        request.then(function (data) {

            addResultToPage(parseReturnData('freemusicarchive', JSON.parse(data)), 'search-result-right-ul');

        });
        request.catch(function (err) {
            console.error('Augh, there was an error!', err.statusText);
        });

    }

    /**
     * This method receive query and search that query on the omdbapi.
     * The query result will display on the screen using the addResultToPage helping method.
     * @param query - string to look for.
     */
    function movieSearch(query) {
        var request = makeXHRRequest(
            {
                method: 'GET',
                url: 'http://www.omdbapi.com/?s=' + query + '&y=&plot=short&r=json',
            });

        request.then(function (data) {

            addResultToPage(parseReturnData('omdbapi', JSON.parse(data)), 'search-result-left-ul');

        });
        request.catch(function (err) {
            console.error('Augh, there was an error!', err.statusText);
        });

    }

    function parseReturnData(type, dataObject) {
        var searchResultForamt = [];

        if (type === 'freemusicarchive') {

            dataObject.aRows.forEach(function (trackDetails) {
                var trackDetailsSplit = trackDetails.split("]");
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
                        title: movieEntity.Title + ' (' + movieEntity.Year + ')',
                        link: movieEntity.Poster
                    });


                });
            }


        }

        return searchResultForamt;

    }

    function addResultToPage(data, location) {

        var ulElement = document.getElementById(location);


        data.forEach(function (searchResultEntity) {

            var liElement = document.createElement("LI");
            liElement.className = "search-result-li";
            var titleElement = document.createElement("span");
            var titleText = document.createTextNode(searchResultEntity.title);
            titleElement.appendChild(titleText);
            titleElement.className = "search-result-li-title";

            liElement.appendChild(titleElement);

            if (searchResultEntity.textinfo) {
                var pElement = document.createElement("p");
                var pText = document.createTextNode(searchResultEntity.textinfo);
                pElement.appendChild(pText);

                liElement.appendChild(pElement);
            }

            var linkName = '';
            if (searchResultEntity.link) {
                if (searchResultEntity.link.length > 10) {
                    linkName = searchResultEntity.link.substring(0, 30) + '...';
                } else {
                    linkName = searchResultEntity.link;
                }
                var prElement = document.createElement("p");
                var linkElement = document.createElement("A");
                var linkText = document.createTextNode(linkName);
                linkElement.setAttribute("href", searchResultEntity.link);
                linkElement.setAttribute("target", "_blank");
                linkElement.appendChild(linkText);
                prElement.appendChild(linkElement);
                liElement.appendChild(prElement);
            }


            ulElement.appendChild(liElement);


        });

    }



};
