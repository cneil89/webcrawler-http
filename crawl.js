const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {
    const currentURLObj = new URL(currentURL);
    const baseURLObj = new URL(baseURL);
    if (currentURLObj.hostname !== baseURLObj.hostname) {
        return pages;
    }
    const normalizedURL = normalizeURL(currentURL);
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }    

    pages[normalizedURL] = 1;
    console.log(`Crawling page: ${currentURL}`);
    let htmlBody = '';
    try {
        const resp = await fetch(currentURL);
        if (resp.status > 399) {
            console.log(`Received invlaid HTTP response code: ${resp.status}`);
            return pages;
        } 
        const contentType = resp.headers.get('content-type');
        if (!contentType.includes('text/html')) {
            console.log(`invalid content-type: ${contentType}`);
            return pages;
        }
        htmlBody = await resp.text();
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }

    const aElementList = getURLsFromHTML(htmlBody, baseURL)
    for (let aElement of aElementList) {
        pages = await crawlPage(baseURL, aElement, pages);
    }
    return pages; 
}


function normalizeURL(url) {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.hostname}${urlObj.pathname.toLowerCase()}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const urlList = [];
    const items = dom.window.document.querySelectorAll('a');
    for (let item of items) {
        // If href begins with '/' it is relative, therefore need to pass
        // baseURL to the URL constructor
        if (item.href.slice(0,1) === '/') {
            try {
                urlList.push(new URL(item.href, baseURL).href);
            } catch (err) {
                console.log(`${err}: ${item.href}`);
            }
        } else {
            try {
                urlList.push(new URL(item.href).href);
            } catch (err) {
                console.log(`${err}: ${item.href}`);
            }
        }
    }

    return urlList;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
