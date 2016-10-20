import "../css/search.css";
import FreeMusicArchiveService from './freeMusicArchiveAPI';
import OmdbMovieSearchService from './omdbAPI';

export default class MySearch {

    constructor() {
        //The key location - place in the  screen to display the API response
        let searchApisList = [
            new FreeMusicArchiveService(),
            new FreeMusicArchiveService(),
            new OmdbMovieSearchService(),
            new OmdbMovieSearchService()
        ];


        //add functionality to the Go! button.
        const divResultID = 'search-result';
        let resultElement = document.getElementById(divResultID);
        document.getElementById('search-button').onclick = function () {
            let query = document.getElementById('query').value;
            // clear previous results
            this.clearResultsLists(divResultID);
            searchApisList.forEach((searchAPIItem) => {
                // go to relevant api provider and render results to screen
                searchAPIItem.searchQuery(query)
                    .then(data => resultElement.appendChild(this.createResultList(data)))
                    .catch(err => console.error('Augh, there was an error!', err.statusText));
            })
        }.bind(this);
    }

    //Helping method that creates the title of the result-search entity element
    createTitleOfSearchResultEntity(searchResultEntity) {
        let searchEntityTitle = document.createElement("span");
        let titleText = document.createTextNode(searchResultEntity.title);
        searchEntityTitle.appendChild(titleText);
        searchEntityTitle.className = "search-result-li-title";
        return searchEntityTitle;
    }

    //Helping method that creates the infoText (if exist) of the result-search entity element
    createInfoTextOfSearchResultEntity(searchResultEntity) {
        if (searchResultEntity.textInfo) {
            let searchEntityTextInfo = document.createElement("p");
            let pText = document.createTextNode(searchResultEntity.textInfo);
            searchEntityTextInfo.appendChild(pText);
            return searchEntityTextInfo;
        }
    }

    //Helping method that creates the link (if exist) of the result-search entity element
    createLinkOfSearchResultEntity(searchResultEntity) {
        if (searchResultEntity.link) {
            let linkName = searchResultEntity.link;
            let searchEntityLink = document.createElement("p");
            let linkElement = document.createElement("a");
            let linkText = document.createTextNode(linkName);
            linkElement.setAttribute("href", searchResultEntity.link);
            linkElement.setAttribute("target", "_blank"); // use this to open in a new tab
            linkElement.appendChild(linkText);
            searchEntityLink.appendChild(linkElement);
            return searchEntityLink;
        }
        return null;
    }

    //Helping method used to add single result search entity to the screen
    createSingleSearchResult(searchResultEntity) {
        let singleSearchResultElement = document.createElement("li");
        singleSearchResultElement.className = "search-result-li";
        let title = this.createTitleOfSearchResultEntity(searchResultEntity);
        singleSearchResultElement.appendChild(title);
        let infoText = this.createInfoTextOfSearchResultEntity(searchResultEntity);
        if (infoText) {
            singleSearchResultElement.appendChild(infoText);
        }

        let letLinkPart = this.createLinkOfSearchResultEntity(searchResultEntity);
        if (letLinkPart) {
            singleSearchResultElement.appendChild(letLinkPart)
        }

        return singleSearchResultElement;
    }

    createResultList(data) {
        let ulParentElement = document.createElement("ul");
        ulParentElement.className = 'search-result-ul';
        let innerLIlist = document.createDocumentFragment();
        // for each search result entity crate element and add to relevant list - define by the location parameter
        data.forEach(searchResultEntity => {
            let searchResultItem = this.createSingleSearchResult(searchResultEntity);
            innerLIlist.appendChild(searchResultItem);
        });
        ulParentElement.appendChild(innerLIlist);
        return ulParentElement;
    }

    // clears the current search results view
    clearResultsLists(idSelector) {
        document.getElementById(idSelector).innerHTML = "";
    }


}