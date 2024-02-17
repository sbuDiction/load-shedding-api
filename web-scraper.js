const puppeteer = require('puppeteer');
/**
 * 
 * @returns Current load shedding status from the eskom website
 */
const getLoadSheddingStatus = async () => new Promise(async resolve => {
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://loadshedding.eskom.co.za/');

        // Wait for the span with a specific id to be present in the DOM
        const loadSheddingStatusSelector = '#lsstatus'; // Replace 'yourSpanId' with the actual id
        await page.waitForSelector(loadSheddingStatusSelector);

        // Extract text content from the span
        const loadSheddingStage = await page.$eval(loadSheddingStatusSelector, (span) => span.textContent);
        const splitText = loadSheddingStage.split(' ');

        await browser.close();
        const status = Number(splitText[splitText.length - 1]);
        // const status = 5;
        resolve(status);

    } catch (error) {
        // Handle network errors or unkown errors
        console.log(error);
    }
})

module.exports = {
    getLoadSheddingStatus
}