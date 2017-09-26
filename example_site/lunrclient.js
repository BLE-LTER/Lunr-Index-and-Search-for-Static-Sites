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


// https://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  }
  else {
    return uri + separator + key + "=" + value;
  }
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


function makePageLink(currentUrl, currentStart, start, linkText) {
    var uri = updateQueryStringParameter(currentUrl, "start", start);
    var tagStart = '<a href="';
    if (currentStart == start) {
        uri = "#";
        if (!linkText.toString().startsWith("&")) {
            tagStart = '<a class="active" href="';
        }
    }
    var link = tagStart + uri + '">' + linkText + '</a>';
    return link;
}


// Creates links to additional pages of search results.
// Requires a start URI argument indicating start index of search results
// as passed to the server providing the search results.
function makePageLinks(total, limit, showPages, currentStart) {
    if (total <= limit) {
        return "";
    }

    var currentUrl = window.location.href;
    var numPages = Math.ceil(total / limit);
    var currentPage = Math.floor(currentStart / limit) + 1;
    var pagesLeftRight = Math.floor(showPages / 2);
    var startPage = currentPage - pagesLeftRight;
    var endPage = currentPage + pagesLeftRight;

    if (endPage > numPages) {
        endPage = numPages;
        startPage = endPage - showPages + 1;
    }
    if (startPage <= 0) {
        startPage = 1;
        endPage = showPages;
        if (endPage > numPages) {
            endPage = numPages;
        }
    }

    var link_list = [];
    link_list.push(makePageLink(currentUrl, currentStart, 0, "&laquo;"));
    for (var i = startPage; i <= endPage; i++) {
        var startIndex = (i - 1) * limit;
        link_list.push(makePageLink(currentUrl, currentStart, startIndex, i));
    }
    var lastIndex = (numPages - 1) * limit;
    link_list.push(
        makePageLink(currentUrl, currentStart, lastIndex, "&raquo;"));

    return link_list.join("");
}


function showResultCount(total, limitPerPage, currentStartIndex) {
    if (total == 0) {
        return;
    }

    var s = "";
    if (total > 1) {
        s = "s";
    }
    if (total <= limitPerPage) {
        var html = "<p>Found " + total + " result" + s + "</p>";
    }
    else {
        var fromCount = currentStartIndex + 1;
        var toCount = currentStartIndex + limitPerPage;
        if (toCount > total) {
            toCount = total;
        }
        var html = ("<p>Showing results " + fromCount + " to " + toCount + 
                    " out of " + total + "</p>");
    }
    var element = document.getElementById(LUNR_CONFIG["countElementId"]);
    element.innerHTML = html;
}


function searchLunr(query, start=0) {
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
    var pageLinkHtml = makePageLinks(count, limit, showPages, currentStart);
    var pageElementId = LUNR_CONFIG["pagesElementId"];
    document.getElementById(pageElementId).innerHTML = pageLinkHtml;
    
    showResultCount(count, limit, currentStart);
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