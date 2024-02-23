const crypto = require('crypto');

/**
 * This function converts fractions of a day into time format (hours, minutes and seconds)
 * @param {{start: number, end: number}} time Fractions of a day with start time and end time
 * @returns TimeStamp{}
 */
const timeConversion = (time, adjustTimeZone = false) => {
    const referenceTime = new Date(0); // Epoch time
    // Given values with 1 hour subtracted
    // const adjustTimeZone = process.env.TIME_ZONE | false;
    let startTime = time['start'] - 1 / 24
    let endTime = time['end'] - 1 / 24
    // console.log('Before start:', startTime);
    // console.log('Before end', endTime);

    // console.log('After start:', startTime);
    // console.log('After end', endTime);
    // Convert fractions of a day to milliseconds
    const milliseconds1 = Math.round(startTime * 24 * 60 * 60 * 1000)
    const milliseconds2 = Math.round(endTime * 24 * 60 * 60 * 1000)


    // Calculate new times
    const start = new Date(referenceTime.getTime() + milliseconds1)
    const end = new Date(referenceTime.getTime() + milliseconds2)

    if (adjustTimeZone) {
        start.setHours(start.getHours() - 1);
        end.setHours(end.getHours() - 1);
    }


    // Format times as strings
    const formattedTime1 = start.toLocaleTimeString();
    const formattedTime2 = end.toLocaleTimeString();
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