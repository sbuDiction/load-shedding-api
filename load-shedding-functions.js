const jsonData = require('./json/loadshedding-data-example.json');
const blocks = require('./data/blocks.json');
const { saveJSONFile } = require('./json-file-mananger');
const { timeConversion, daysUntilMonthEnd } = require('./utils/helpers');
const { MONTHS, WEEKDAYS } = require('./constants/dateConstants');

/**
 * List of all the provinces in South Africa
 */
// const Provinces = ['Eastern Cape', 'Free State', 'Gauteng (N/A)', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];


/**
 * This function is for getting schedule for a specific day in the calender
 * @param {number} day Day in a month from the 1st to 31st
 * @param {[]} loadSheddingScheduleData Tabular data with all the yearly load shedding data
 * @returns schedule[{}]
 */
const getScheduleForDay = (day, loadSheddingScheduleData, loadSheddingStage) => {
    // console.log(new Date());
    day += 1; // Adjusting for the zero based indexing
    const schedule = [];
    for (let i = 0; i < loadSheddingScheduleData.length; i++) {
        const scheduleTime = timeConversion({ start: loadSheddingScheduleData[i][0], end: loadSheddingScheduleData[i][1] });
        schedule.push({
            scheduleTime,
            stage: loadSheddingScheduleData[i][day]
        });
    }
    return schedule;
}


/**
 * 
 * @param {[]} loadSheddingScheduleData 
 */
const getUpcomingLoadSheddingSchedule = (loadSheddingScheduleData) => {
    const upcomingSchedule = []
    const date = new Date();

    let dayCounter = date.getDate(); // Keeps count of the days in a month
    let weekDayCounter = date.getDay(); // Keeps count of the days in a week
    let dayOfMonth = date.getDate();
    let daysLeft = daysUntilMonthEnd(date);

    dayOfMonth += 1; // Adjusting for the zero based indexing
    daysLeft += 2; // Adjusting for the zero based indexing

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    for (let i = dayOfMonth; i > daysLeft; i++) {
        const schedule = getScheduleForDay(i - 1, loadSheddingScheduleData);

        upcomingSchedule.push({
            name: WEEKDAYS[weekDayCounter],
            date: `${dayCounter}-${(month > 10 ? month : `0${month}`)}-${year}`,
            stages: schedule
        })
        weekDayCounter === 6 ? weekDayCounter = 0 : weekDayCounter++;
        dayCounter++;

        if (i >= 32) {
            break;
        }

    }
    return upcomingSchedule;
}

// /**
//  * 
//  * This function gets all the cities from a specific province.
//  * @param {string} provinceName Province name.
//  * @returns cities[{}]
//  */
// const getCitiesByProvince = (provinceName) => {
//     try {
//         return { province: provinceName, cities: loadsheddingMap[provinceName]['cities'] };
//     } catch (error) {
//         return { error: `{${provinceName}}: Was Not Found` };
//     }
// }

/**
 * This function gets all the suburbs from a specific city.
 * @param {[]} cities List of all the cities from a specific city
 * @param {string} cityName City name 
 * @returns suburbs[{}]
 */
const getSuburbsByCity = (cities, cityName) => {
    const suburbList = cities.find(city => city['city'] === cityName);
    try {
        return { suburbs: suburbList['suburbs'] };
    } catch (error) {
        return { suburbs: suburbList['suburbs'], error }
    }
}

/**
 * This function is for getting a specific suburb
 * @param {[]} suburbList 
 * @param {string} suburbName 
 * @returns suburb{}
 */
const getSuburb = (suburbList, suburbName) => {
    const suburb = suburbList.find(suburb => suburb['suburb'] === suburbName);
    try {
        return suburb;
    } catch (error) {
        return { error, suburb }
    }
}

// /**
//  * This function is for compiling all the excel spreadsheet data to a readable load shedding schedule and assign the schedule to each suburb according to the block number.
//  */
// const createScheduleForEachPlace = () => {
//     Provinces.forEach(province => {
//         const cities = loadsheddingMap[province]['cities'];
//         if (cities.length != 0) {
//             cities.forEach(city => {
//                 const suburbs = city['suburbs'];
//                 suburbs.forEach(suburb => {
//                     const currentBlock = blocks.find(block => block['blockNumber'] === suburb['block']);
//                     suburb['schedule'] = currentBlock['schedule'];
//                 });
//             });
//         } {
//             console.log('No cities available');
//         }
//     });
//     // saveJSONFile(loadsheddingMap, './data/loadshedding-map.json');
// }
/**
 * 
 * @param {[*]} schedule This is the data extracted from the sheet
 * @param {number} block Block number for a suburb
 * @param {number} loadSheddingStage Eskom current load shedding stage
 */
const getCurrentLoadShedding = (schedule, block, loadSheddingStage) => {
    // This function is made to work with stage 1 to 8
    let daysMap = {};
    const currentStage = loadSheddingStage;
    const date = new Date();
    let timeStamp = { start: schedule[0][0], end: schedule[0][1] };
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let scheduleObj = {
        stage: currentStage,
        name: WEEKDAYS[date.getDay()],
        date: `${date.getDate()}-${(month > 10 ? month : `0${month}`)}-${year}`,
        schedule: []
    }
    schedule.forEach((row) => {
        // Loop for maping the days of the month
        let day = 1;
        for (let i = 3; i < row.length; i++) {
            daysMap[day] = { index: i };
            day++;
        }
        const stage = row[2];
        if (stage === 1) {
            timeStamp['start'] = row[0];
            timeStamp['end'] = row[1];
        } else {
            row[0] = timeStamp['start'];
            row[1] = timeStamp['end'];
        }
    });
    const currentDay = daysMap[date.getDate()];
    schedule.forEach(row => {
        const stage = row[2];
        if (row[currentDay['index']] === block) {
            if (stage <= currentStage) {
                timeStamp['start'] = row[0];
                timeStamp['end'] = row[1];
                console.log(timeStamp);
                const time = timeConversion(timeStamp);
                scheduleObj.schedule.push(time);
            }
        }
    });
    return scheduleObj;
}

module.exports = {
    getUpcomingLoadSheddingSchedule,
    getCurrentLoadShedding
}