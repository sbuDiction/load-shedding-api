// const { saveJSONFile } = require('./json-file-mananger');
const { timeConversion, daysUntilMonthEnd } = require("./utils/helpers");
const { MONTHS, WEEKDAYS } = require("./constants/dateConstants");
const { extractEskomDrirectSchedule } = require("./SheetManager");
const XLSX = require("xlsx");
const fs = require("fs");

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
const getScheduleForDay = (
  day,
  loadSheddingScheduleData,
  loadSheddingStage
) => {
  // console.log(new Date());
  day += 1; // Adjusting for the zero based indexing
  const schedule = [];
  for (let i = 0; i < loadSheddingScheduleData.length; i++) {
    const scheduleTime = timeConversion({
      start: loadSheddingScheduleData[i][0],
      end: loadSheddingScheduleData[i][1],
    });
    schedule.push({
      scheduleTime,
      stage: loadSheddingScheduleData[i][day],
    });
  }
  return schedule;
};

/**
 *
 * @param {[]} loadSheddingScheduleData
 */
const getUpcomingLoadSheddingSchedule = (loadSheddingScheduleData) => {
  const upcomingSchedule = [];
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
      date: `${year}-${month > 10 ? month : `0${month}-${dayCounter}`}`,
      stages: schedule,
    });
    weekDayCounter === 6 ? (weekDayCounter = 0) : weekDayCounter++;
    dayCounter++;

    if (i >= 32) {
      break;
    }
  }
  return upcomingSchedule;
};

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
  const suburbList = cities.find((city) => city["city"] === cityName);
  try {
    return { suburbs: suburbList["suburbs"] };
  } catch (error) {
    return { suburbs: suburbList["suburbs"], error };
  }
};

/**
 * This function is for getting a specific suburb
 * @param {[]} suburbList
 * @param {string} suburbName
 * @returns suburb{}
 */
const getSuburb = (suburbList, suburbName) => {
  const suburb = suburbList.find((suburb) => suburb["suburb"] === suburbName);
  try {
    return suburb;
  } catch (error) {
    return { error, suburb };
  }
};

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
const getCurrentLoadShedding = (
  schedule,
  suburb,
  loadSheddingStage,
  adjustTime
) =>
  new Promise((resolve) => {
    // This function is made to work with stage 1 to 8
    let daysMap = {};
    let timeStamp = {
      start: schedule[0][0],
      end: schedule[0][1],
    };
    schedule.forEach((row) => {
      // Loop for maping the days of the month
      let day = 1;
      for (let i = 3; i < row.length; i++) {
        daysMap[day] = { index: i };
        day++;
      }

      const stage = row[2];
      if (stage === 1) {
        timeStamp["start"] = row[0];
        timeStamp["end"] = row[1];
      } else {
        row[0] = timeStamp["start"];
        row[1] = timeStamp["end"];
      }
    });

    let scheduleMap = {
      stage: loadSheddingStage,
      suburb: {
        name: suburb["name"],
        region: suburb["region"],
      },
      schedule: {
        days: [],
      },
      source: "https://loadshedding.eskom.co.za/",
    };

    const date = new Date();
    const week = 8; // Adjusting for zero based index
    let day = date.getDate();
    let dayIndex = 0;
    for (let i = 1; i < week; i++) {
      date.setDate(day);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const currentDay = daysMap[date.getDate()];
      scheduleMap["schedule"]["days"].push({
        date: `${year}-${month > 10 ? month : `0${month}`}-${date.getDate()}`,
        name: WEEKDAYS[date.getDay()],
        stages: [],
      });

      schedule.forEach((row) => {
        const stage = row[2];
        if (row[currentDay["index"]] === suburb["block"]) {
          if (stage <= loadSheddingStage) {
            // console.log('Before:', timeStamp);
            timeStamp["start"] = row[0];
            timeStamp["end"] = row[1];
            // console.log('After:', timeStamp);
            const time = timeConversion(timeStamp, adjustTime);
            time["stage"] = stage;
            scheduleMap["schedule"]["days"][dayIndex]["stages"].push(time);
          }
        }
      });
      dayIndex++;
      day++;
    }
    resolve(scheduleMap);
  });

const getBlockLoadSheddingSchedule = async (lsTime, lsStage, block) => {
  const schedule = await extractEskomDrirectSchedule();

  const daysOfTheMonth = ["start_time", "end_time", "stage"];
  const rawSchedule = [];
  const eskomData = [];

  //   create days of the month
  for (let i = 1; i < 32; i++) {
    daysOfTheMonth.push(`${i}`);
  }
  // eskomData.push(daysOfTheMonth);

  let daysMap = {};

  let timeStamp = {
    start: schedule[0][0],
    end: schedule[0][1],
  };

  schedule.forEach((row) => {
    // Loop for maping the days of the month
    let day = 1;
    for (let i = 3; i < row.length; i++) {
      daysMap[day] = { index: i };
      day++;
    }

    const stage = row[2];
    if (stage === 1) {
      timeStamp["start"] = row[0];
      timeStamp["end"] = row[1];
    } else {
      row[0] = timeStamp["start"];
      row[1] = timeStamp["end"];
    }
    rawSchedule.push(row);
  });

  //   format time columns
  rawSchedule.forEach((row) => {
    const time = timeConversion({ start: row[0], end: row[1] });
    row[0] = time.start;
    row[1] = time.end;
    eskomData.push(row);
  });

  // Find the index of the time where load shedding was declared
  let lsStartTimeIndex;
  for (let i = 0; i < eskomData.length; i++) {
    const row = eskomData[i];
    if (row[0] === lsTime) {
      lsStartTimeIndex = i;
      break;
    }
  }

  const loadSheddedHours = eskomData.slice(lsStartTimeIndex);

  let daysIntexMapper = {};
  let dayIndex = 2;
  for (let i = 1; i < 32; i++) {
    if (daysIntexMapper[i] === undefined) {
      daysIntexMapper[i] = dayIndex;
    }
    dayIndex++;
  }
  // console.log(daysIntexMapper);

  for (const key in daysIntexMapper) {
    if (Object.hasOwnProperty.call(daysIntexMapper, key)) {
      const index = daysIntexMapper[key];
      loadSheddedHours.forEach((row) => {
        const stage = row[2];
        row.forEach((subRow) => {
          if (subRow === block)
            if (lsStage >= stage) {
              // console.log(stage);
            }
        });
      });
      
    }
  }

  console.table(loadSheddedHours);

  // const ws = XLSX.utils.aoa_to_sheet(eskomData);
  // const wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // const workbook = XLSX.readFile(`Eskom Load Shedding Schedule.xlsx`, {
  //   cellFormula: true,
  //   sheetStubs: true,
  // });
  // const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets["Sheet1"]);

  // //   XLSX.(csvData, "load shedding schedules 1 to 8.csv");
  // fs.writeFile("eskom schedule 1 to 8.csv", csvData, (err) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("CSV file created successfully!");
  //   }
  // });
};

module.exports = {
  getUpcomingLoadSheddingSchedule,
  getCurrentLoadShedding,
};

getBlockLoadSheddingSchedule("21:00", 2, 5);
