// This file is the CLI implementation of the load shedding api

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const loadSheddingMap = require('./data/loadshedding-map.json');
const blocks = require('./data/blocks.json');
const { findCity, findSuburb } = require('./searchFunctions');
const { getUpcomingLoadSheddingSchedule } = require('./loadSheddingFunctions');
const { extractCities, extractSuburbs } = require('./spreadSheet');

const rl = readline.createInterface({ input, output });

const getUserProvince = async () => {
    try {
        return new Promise(resolve => {
            rl.question('Which province do you live in?: ', provinceName => {
                resolve('KwaZulu-Natal');
            });
        })
    } catch (error) {
        console.log(`ERROR:`, error);
    }
}

const getUserCity = async () => {
    try {
        return new Promise(resolve => {
            rl.question('Which city do you live in?: ', cityName => {
                resolve('newcastle');
            });
        })
    } catch (error) {
        console.log(`ERROR:`, error);
    }
}

const getUserSuburb = async () => {
    try {
        return new Promise(resolve => {
            rl.question('Which suburb do you live in?: ', suburbName => {
                resolve('Inverness');
            });
        })
    } catch (error) {
        console.log(`ERROR:`, error);
    }
}

const main = async () => {
    const provinceName = await getUserProvince();
    const cityName = await getUserCity();
    const suburbName = await getUserSuburb();
    rl.close();

    const myBlock = 8;

    const cityList = extractCities();
    const city = findCity(cityList, cityName);
    const suburbList = extractSuburbs();
    const suburb = findSuburb(suburbList, suburbName, city).filter(suburb => suburb['BLOCK'] === myBlock);

    const blockSchedule = blocks.find(block => block['blockNumber'] === suburb[suburb.length - 1]['BLOCK'])['schedule'];
    const upcomingLoadShedding = getUpcomingLoadSheddingSchedule(blockSchedule);

    console.log(upcomingLoadShedding[0]['schedule'].filter(dailySchedule => dailySchedule.stage <= 2));
}

main();