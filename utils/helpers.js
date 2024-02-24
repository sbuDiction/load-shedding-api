const crypto = require('crypto');
const moment = require('moment-timezone');
/**
 * This function converts fractions of a day into time format (hours, minutes and seconds)
 * @param {{start: number, end: number}} time Fractions of a day with start time and end time
 * @returns TimeStamp{}
 */
// Set the default time zone
const timeZone = 'Africa/Johannesburg'; // Replace 'Your_Time_Zone_Here' with the appropriate time zone
moment.tz.setDefault(timeZone);

const timeConversion = (time, adjustTimeZone = false) => {
    const referenceTime = moment(0).tz(timeZone); // Create moment object with epoch time and set time zone

    let startTime = time['start'] - 1 / 24;
    let endTime = time['end'] - 1 / 24;

    // Convert fractions of a day to milliseconds
    const milliseconds1 = Math.round(startTime * 24 * 60 * 60 * 1000);
    const milliseconds2 = Math.round(endTime * 24 * 60 * 60 * 1000);

    // Calculate new times
    let start = referenceTime.clone().add(milliseconds1, 'milliseconds');
    let end = referenceTime.clone().add(milliseconds2, 'milliseconds');

    if (adjustTimeZone) {
        start = moment(0).tz(timeZone).add(milliseconds1, 'milliseconds').subtract(1, 'hours');
        end = moment(0).tz(timeZone).add(milliseconds2, 'milliseconds').subtract(1, 'hours');
    }
    // Format times as strings
    const formattedTime1 = start.format('HH:mm:ss A');
    const formattedTime2 = end.format('HH:mm:ss A');

    return { start: formattedTime1, end: formattedTime2 };
}

/**
 * This function is for returning how many days left in a month
 * @param {Date} date 
 * @returns The number of days left in a month
 */
const daysUntilMonthEnd = date => {
    // Get the current date
    var currentDate = date || new Date();

    // Get the last day of the month
    var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Calculate the difference in days
    var daysLeft = Math.ceil((lastDayOfMonth - currentDate) / (1000 * 60 * 60 * 24));

    return daysLeft;
}
/**
 * 
 * @param {{lat: }} coordinates 
 * @returns 
 */
const generateIdFromCoordinates = (coordinates) => {
    // Concatenate the values
    const combinedValues = coordinates['lat'].toString() + coordinates['lon'].toString();

    // Create a SHA-256 hash
    const hash = crypto.createHash('sha256').update(combinedValues).digest('hex');

    return hash;
}



module.exports = {
    timeConversion,
    daysUntilMonthEnd,
    generateIdFromCoordinates
}