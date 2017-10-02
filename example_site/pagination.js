"use strict";


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


function makePageLink(currentUrl, currentStart, start, linkText) {
    var uri = updateQueryStringParameter(currentUrl, "start", start);
    var tagStart = '<a href="';
    if (currentStart == start) {
        uri = "#";
        if (!linkText.toString().startsWith("&")) {  // Don't modify arrows
            tagStart = '<a class="active" href="';
        }
    }
    var link = tagStart + uri + '">' + linkText + '</a>';
    return link;
}


// Creates links to additional pages of search results.
// Requires a start URI argument indicating start index of search results
// as passed to the server providing the search results.
function showPageLinks(total, limit, showPages, currentStart, domElementId) {
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

    var html = link_list.join("");
    document.getElementById(domElementId).innerHTML = html;
}


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


function showResultCount(query, total, limitPerPage, currentStartIndex, domElementId) {
    if (total == 0) {
        return;
    }

    var s = "";
    if (total > 1) {
        s = "s";
    }
    var found = "<p>Found " + total + " result" + s;
    if (query != "" && query != null) {
        query = escapeHtml(query);
        var forQuery = ' for <span class="result-query">' + query + '</span>';
    }
    else {
        var forQuery = "";
    }
    if (total <= limitPerPage) {
        var showing = "</p>";
    }
    else {
        var fromCount = currentStartIndex + 1;
        var toCount = currentStartIndex + limitPerPage;
        if (toCount > total) {
            toCount = total;
        }
        var showing = (". Showing results " + fromCount + " to " + toCount + ".</p>");
    }
    var element = document.getElementById(domElementId);
    element.innerHTML = found + forQuery + showing;
}
