# Lunr-Index-and-Search-for-Static-Sites

This project demonstrates how to build and use a [Lunr](https://lunrjs.com/) search index for a static website.

[Live demo](https://ble-lter.github.io/Lunr-Index-and-Search-for-Static-Sites/example_site/search.html)

## Prerequisites

1. Install Node.js (https://nodejs.org/en/download/).
2. Create a working directory, separate from the directory with your HTML files.
3. Open a command window or shell prompt in your working directory.
4. Install lunr: `npm install lunr`
5. Install cheerio, an HTML parser: `npm install cheerio`
6. Copy **build_index.js** into your working directory.
7. If you want to try this on the example site, copy the **example_site** folder into your working directory.

## Building the Index

1. Edit **build_index.js**.
2. Change the **HTML_FOLDER** constant to point to the folder with your website's HTML files. Or leave it as is to see how it works for the example site.
3. You can build the search index on the HTML document title, meta description, meta keywords, and body tags. Specify which of these tags to include using the **SEARCH_FIELDS** constant.
4. Save and close **build_index.js**.
5. In the command window or shell prompt, enter: `node build_index.js`

To build the index, the script reads HTML tags from each HTML file and initializes a Lunr index based on tag content.  While the Lunr index can be serialized as JSON, the script adds a variable declaration (`var LUNR_DATA = ...`) so we can easily load it as a script file in our search page.  

Lunr search results just provide the identifier of each matching item. To provide title, preview, and hyperlink, the script also includes a dictionary (`var PREVIEW_LOOKUP = ...`) mapping each identifier to its title, etc.

## Using the Index

To see the search index in action:

1. Build a search index named `lunr_index.js` for the example site using the instructions above.
2. Copy lunr_index.js to the **example_site** folder.
3. Open search.html in your browser and enter a search term like `cat` or `mango`.
