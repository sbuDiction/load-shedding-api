const fs = require('fs');

/**
 * These are file path global variables for each data.
 */
const LOAD_SHEDDING_MAP_FILE_PATH = './json/loadshedding_map.json';

/** 
 * Home made function for saving json data to a json file
*/
const saveJSONFile = (jsonData, filePath /** Specify the file path */) => {
    // Convert JSON object to string
    const jsonString = JSON.stringify(jsonData, null, 2);
    let isSaved = false;

    // Write the JSON string to a file
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            isSaved = true;
            console.log(`JSON file saved successfully at ${filePath}`);
        }
    });
    return isSaved;
}


/**
 * Home made function for reading json files...
 */
const fromFileToJSON = filePath => {
    let isFound = false;
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return { isFound, error: `Error reading the file: ${err}` };
        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);
            isFound = true;
            // Access the data as needed
            return { isFound, jsonData };
        } catch (parseError) {
            return { isFound, error: `Error parsing JSON: ${parseError}` }
        }
    });
}

module.exports = {
    saveJSONFile,
    fromFileToJSON,
    LOAD_SHEDDING_MAP_FILE_PATH
};