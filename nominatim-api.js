const axios = require('axios');

/**
 * This function is for goecoding turning coordinates into human readable address using `nominatim` search engine for openstreetmap database
 * @param {{lat: number, lon: number}} coordinates `Latitude` and `Longitude`
 * @returns 
 */
const reverseGeocoding = async (coordinates) => new Promise((resolve, reject) => {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const params = {
        'format': 'json',
        'lat': coordinates.lat,
        'lon': coordinates.lon,
    };
    axios.get(url, { params }).then(address => {
        resolve(address);
    });
});

module.exports = {
    reverseGeocoding
}

