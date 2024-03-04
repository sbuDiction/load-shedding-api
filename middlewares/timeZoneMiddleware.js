const TimeZones = require("../constants/timeZones");
const prismaClient = require("../prismaClient");

class TimeZoneMiddleware {
    static checkTimeZone = async (req, res, next) => {
        const { id } = req.query;
        await prismaClient.suburbs.findFirst({
            where: {
                sid: id
            }
        }).then(suburb => {
            const suburbRegion = suburb.region.split(',')[2]
            const isTimeZone = TimeZones["SAET+1"].findIndex(zone => zone.includes(suburbRegion.trim()))
            if (isTimeZone === -1) {
                req.isAdjust = true;
                next();
            } else {
                req.isAdjust = false;
                next();
            }
        })
    }
}

module.exports = TimeZoneMiddleware;