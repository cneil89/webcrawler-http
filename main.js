const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');

async function main() {
    const arguements = process.argv.slice(2);
    if (arguements.length !== 1) {
        console.log("Usage:  node main.js BASE_URL")
        process.exit(1);
    }

    const baseURL = arguements[0]; 
    console.log(`Starting crawler for URL: ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages);
}

main()
