"use strict";

var LUNR_CONFIG = {
    "limit": 10,  // Max number of results to retrieve per page
    "resultsElementId": "searchResults",  // Element to contain results
    "countElementId": "resultCount",  // Element showing number of results
    "pagesElementId": "pagination",  // Element to display result page links
    "showPages": 5  // MUST BE ODD NUMBER! Max number of page links to show
};


// Get URL arguments
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// Parse search results into HTML
function parseLunrResults(results) {
    var html = [];
    for (var i = 0; i < results.length; i++) {
        var id = results[i]["ref"];
        var item = PREVIEW_LOOKUP[id]
        var title = item["t"];
        var preview = item["p"];
        var link = item["l"];
        var result = ('<p><span class="result-title"><a href="' + link + '">'
                    + title + '</a></span><br><span class="result-preview">'
                    + preview + '</span></p>');
        html.push(result);
    }
    if (html.length) {
        return html.join("");
    }
    else {
        return "<p>Your search returned no results.</p>";
    }
}


function searchLunr(query, start) {
    var idx = lunr.Index.load(LUNR_DATA);
    // Write results to page
    var results = idx.search(query);
    var resultHtml = parseLunrResults(results);
    var elementId = LUNR_CONFIG["resultsElementId"];
    document.getElementById(elementId).innerHTML = resultHtml;

    // Add links to additional search result pages if necessary
    var currentStart = getParameterByName("start");
    if (!currentStart) {
        currentStart = 0;
    }
    else {
        currentStart = parseInt(currentStart);
    }
    var count = results.length;
    var limit = parseInt(LUNR_CONFIG["limit"]);
    var showPages = parseInt(LUNR_CONFIG["showPages"]);
    var pageElementId = LUNR_CONFIG["pagesElementId"];
    showPageLinks(count, limit, showPages, currentStart, pageElementId);
    var query = getParameterByName("q");
    showResultCount(query, count, limit, currentStart, LUNR_CONFIG["countElementId"]);
}


// When the window loads, read query parameters and perform search
window.onload = function() {
    var query = getParameterByName("q");
    var start = getParameterByName("start");
    if (query != "" && query != null) {
        document.forms.lunrSearchForm.q.value = query;
        if (!start) {
            start = 0;
        }
        searchLunr(query, start);
    }
};