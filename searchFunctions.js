const loadsheddingMap = require('./data/loadshedding-map.json');

/**
 * This binary search is used to search for a city in a sorted list of cities.
 * @param {[]} cityList Containing all the cities in a province.
 * @param {string} cityName The name of the city to look for in the list.
 * @returns index number of the found city
 */
const findCity = (cityList, cityName) => {
    const lowerCaseTarget = cityName.toLowerCase();

    let low = 0;
    let high = cityList.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midValue = cityList[mid].toLowerCase();

        if (midValue === lowerCaseTarget) {
            return cityList[mid];
            // return mid; // String found, return its index
        } else if (midValue.localeCompare(lowerCaseTarget) < 0) {
            low = mid + 1; // Search in the right half
        } else {
            high = mid - 1; // Search in the left half
        }
    }
    return []; // String not found in the array
}


/**
 * This binary search is used to search for a suburb in a sorted list of suburbs.
 * @param {[]} suburbList 
 * @param {string} suburbName 
 * @returns index number of the found suburb
 */
const findSuburb = (suburbList, suburbName, cityName) => {
    const lowerCaseTarget = suburbName.toLowerCase();

    return suburbList.filter(suburb => suburb['SP_NAME'].toLowerCase().replace(/\(\d+\)/g, '').trim().includes(lowerCaseTarget) && suburb['MP_NAME'].toLowerCase() === cityName.toLowerCase());
    // return results; // Element not found in the array

    // const lowerCaseTarget = suburbName.toLowerCase();

    // let low = 0;
    // let high = suburbList.length - 1;

    // while (low <= high) {
    //     const mid = Math.floor((low + high) / 2);
    //     const midValue = suburbList[mid]['suburb'].toLowerCase().replace(/\(\d+\)/g, '').trim();

    //     if (midValue === lowerCaseTarget) {
    //         return suburbList[mid];
    //         // return mid; // String found, return its index
    //     } else if (midValue.localeCompare(lowerCaseTarget) < 0) {
    //         low = mid + 1; // Search in the right half
    //     } else {
    //         high = mid - 1; // Search in the left half
    //     }
    // }
    // return []; // String not found in the array
}

module.exports = {
    findCity,
    findSuburb
}