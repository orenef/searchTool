import "../css/search.css";
import {trackSearch, parseTracReturnData} from './freeMusicArchiveAPI';
import {movieSearch, parseMovieReturnData}  from './omdbAPI';

export default class MySearch {

    constructor() {
        this.movieList = 'search-result-movie-ul';
        this.musicList = 'search-result-music-ul';
        this.searchAPIConfigruation = {
            'freemusicarchive': {
                type: 'freemusicarchive',
                searchFunction: trackSearch,
                'parsingFunction': parseTracReturnData,
                location: this.musicList
            },
            'omdbapi': {
                type: 'omdbapi',
                searchFunction: movieSearch,
                parsingFunction: parseMovieReturnData,
                location: this.movieList
            }
        };

        //add functionality to the Go! button.
        var searchMoviesList = document.getElementById(this.movieList);
        var searchMusicsList = document.getElementById(this.musicList);
        document.getElementById('search-button').onclick = function () {
            let query = document.getElementById('query').value;
            this.clearResultsLists(searchMoviesList, searchMusicsList);

            for (let searchAPIItem in this.searchAPIConfigruation) {
                if (!this.searchAPIConfigruation.hasOwnProperty(searchAPIItem)) continue; // skip loop if the property is from prototype
                let singleSearchItem = this.searchAPIConfigruation[searchAPIItem];
                let searchResponse = singleSearchItem.searchFunction(query);
                searchResponse.then(data => this.addResultToPage(singleSearchItem.parsingFunction(data), singleSearchItem.location));
                searchResponse.catch(err => console.error('Augh, there was an error!', err.statusText));
            }
        }.bind(this);
    }

    crateTitleOfSearchResultEntity(searchResultEntity) {
        let searchEntityTitle = document.createElement("span");
        let titleText = document.createTextNode(searchResultEntity.title);
        searchEntityTitle.appendChild(titleText);
        searchEntityTitle.className = "search-result-li-title";
        return searchEntityTitle;
    }

    crateInfoTextOfSearchResultEntity(searchResultEntity) {
        if (searchResultEntity.textInfo) {
            let searchEntityTextInfo = document.createElement("p");
            let pText = document.createTextNode(searchResultEntity.textInfo);
            searchEntityTextInfo.appendChild(pText);
            return searchEntityTextInfo;
        }
    }

    crateLinkOfSearchResultEntity(searchResultEntity) {
        let linkName = '';
        if (searchResultEntity.link) {
            // method 3
            if (searchResultEntity.link.length > 10) {
                linkName = searchResultEntity.link.substring(0, 45) + '...';
            } else {
                linkName = searchResultEntity.link;
            }
            let searchEntityLink = document.createElement("p");
            let linkElement = document.createElement("a");
            let linkText = document.createTextNode(linkName);
            linkElement.setAttribute("href", searchResultEntity.link);
            linkElement.setAttribute("target", "_blank"); // use this to open in a new tab
            linkElement.appendChild(linkText);
            searchEntityLink.appendChild(linkElement);
            return searchEntityLink;
        }
    }

    addSingleSearchResult(searchResultEntity) {
        let singleSearchResultElement = document.createElement("LI");
        singleSearchResultElement.className = "search-result-li";
        let title = this.crateTitleOfSearchResultEntity(searchResultEntity);
        singleSearchResultElement.appendChild(title);
        let infoText = this.crateInfoTextOfSearchResultEntity(searchResultEntity);
        if (infoText) {
            singleSearchResultElement.appendChild(infoText);
        }
        let letLinkPart = this.crateLinkOfSearchResultEntity(searchResultEntity);
        if (letLinkPart) {
            singleSearchResultElement.appendChild(letLinkPart)
        }
        return singleSearchResultElement;
    }

    addResultToPage(data, location) {
        let ulElement = document.getElementById(location);
        // for each search result entity crate element and add to relevant list - define by the location parameter
        data.forEach(searchResultEntity => ulElement.appendChild(this.addSingleSearchResult(searchResultEntity)));
    }

    // clears the current search results view
    clearResultsLists(searchMoviesList, searchMusicsList) {
        searchMoviesList.innerHTML = "";
        searchMusicsList.innerHTML = "";
    }
}