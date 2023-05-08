
function sortPages(input) {
    if (input === {}) {
        return [];
    }
    let sorted = Object.entries(input);
    sorted.sort((a,b) => b[1] - a[1]);
    return sorted;
}

function printReport(pages) {
    const sortedPages = sortPages(pages);
    console.log('###########################');
    console.log('          Report');
    console.log('###########################');
    for (let page of sortedPages) {
        const count = page[1];
        const url = page[0];
        console.log(`Found ${count} internal links to ${url}`);
    }
}

module.exports = { 
    sortPages,
    printReport
}
