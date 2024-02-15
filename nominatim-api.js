const axios = require('axios');

/**
 * This function is for goecoding turning coordinates into human readable address using `nominatim` search engine for openstreetmap database
 * @param {{lat: number, lon: number}} coordinates `Latitude` and `Longitude`
 * @returns Returns the address object after the conversion from `lat` and `lon`
 */
const reverseGeocoding = async coordinates => new Promise(async (resolve, reject) => {
    const params = {
        'format': 'json',
        'lat': coordinates['lat'],
        'lon': coordinates['lon'],
    };
    const url = 'https://nominatim.openstreetmap.org/reverse';
    await axios.get(url, { params }).then(address => {
        resolve(address);
    });
});

module.exports = {
    reverseGeocoding
}

