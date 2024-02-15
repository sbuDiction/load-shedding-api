// const loadsheddingMap = require('./data/loadshedding-map.json');
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
 * This search function is used to search for a suburb in a sorted list of suburbs.
 * @param {[]} suburbList 
 * @param {string} suburbName 
 * @param {string} cityName
 * @returns Returns a list of all the found areas
 */
const findAreaByName = (suburbList, suburbName, /*cityName*/) => {
    const lowerCaseTarget = suburbName.split(' ');
    // const city = cityName.split(' ');
    const filteredAreas = suburbList.filter(suburb => suburb['SP_NAME'].toLowerCase().replace(/\(\d+\)/g, '').trim().includes(lowerCaseTarget[0].toLowerCase()));
    const areasMap = new Map();
    const searchResults = [];

    filteredAreas.forEach(suburb => {
        areasMap.set(suburb['FULL_NAME'], suburb);
    });


    const mapToJson = JSON.stringify(Object.fromEntries(areasMap));
    const results = JSON.parse(mapToJson);
    let regionMap = {};

    for (const key in results) {
        if (Object.hasOwnProperty.call(results, key)) {
            const suburb = results[key];
            searchResults.push({
                id: suburb['FULL_NAME'],
                name: suburb['SP_NAME'],
                block: suburb['BLOCK'],
                region: suburb['MP_NAME']
            });
            regionMap[suburb['MP_NAME']] = [];
        }
    }
    return { searchResults, regionMap };
}
/**
 * 
 * @param {[*]} suburbList 
 * @param {string} id 
 * @returns {} Returns an object from the list if a match is found or empty object
 */
const findAreaById = (suburbList, id) => {
    let results = {};
    suburbList.forEach(suburb => {
        if (suburb['FULL_NAME'] === id) results = {
            id: suburb['FULL_NAME'],
            name: suburb['SP_NAME'],
            region: suburb['MP_NAME'],
            block: suburb['BLOCK'],
        };
        return results;
    });
    return results;
}


module.exports = {
    findCity,
    findAreaByName,
    findAreaById
}