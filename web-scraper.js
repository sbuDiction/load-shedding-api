const puppeteer = require('puppeteer');
const ScraperUtils = require('./utils/scraper-functions');
/**
 * 
 * @returns Current load shedding status from the eskom website
 */
const getLoadSheddingStatus = async (retries = 0, maxRetries = 3) => {
    return new Promise(async (resolve, reject) => {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            // executablePath: process.env.CHROME_PATH || '',
            args: ['--no-sandbox']
        });
        try {
            const page = await browser.newPage();

            const urls = [
                {
                    url: 'https://loadshedding.eskom.co.za/',
                    elem: '#lsstatus'
                },
                {
                    url: 'https://www.eskom.co.za/',
                    elem: '.eskom-ls-text'
                }
            ];

            let currentUrl = urls[retries];
            console.log(`Scraping: ${currentUrl['url']}`);
            await page.goto(currentUrl['url']);

            // Wait for the span with a specific id to be present in the DOM
            const loadSheddingStatusSelector = `${currentUrl['elem']}`; // Replace 'yourSpanId' with the actual id
            await page.waitForSelector(loadSheddingStatusSelector);

            // Extract text content from the span
            const loadSheddingStage = await page.$eval(loadSheddingStatusSelector, (elem) => elem.textContent);

            await browser.close();

            const status = Number(ScraperUtils.findStage(loadSheddingStage));

            if (Number.isNaN(status)) resolve(0);
            resolve(status);

        } catch (error) {
            // Handle network errors or unknown errors
            console.log(`Error occured retries remaining ${maxRetries}`);

            if (retries < maxRetries - 1) {
                // Attempt retry with a different URL from the list
                retries++;
                resolve(await getLoadSheddingStatus(retries, maxRetries));
            } else {
                reject(error); // All retries exhausted, reject the promise
            }
        } finally {
            await browser.close(); // Ensure browser is always closed
        }
    });
};


module.exports = {
    getLoadSheddingStatus
}