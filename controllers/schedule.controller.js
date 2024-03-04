const SheetManager = require("../SheetManager");
const { getCurrentLoadShedding } = require("../load-shedding-functions");
const prismaClient = require("../prismaClient");

const regions = {
    'Eskom Direct': 'extractEskomDrirectSchedule',
    'City Power': 'extractCityPowerSchedule'
}
class ScheduleController {
    static getUpcomingScheduleById = async (req, res) => {
        const { id } = req.query;
        const adjustTime = req.isAdjust | false;
        await prismaClient.suburbs.findUnique({
            where: {
                sid: id
            }
        }).then(suburb => {
            const region = suburb.region.split(',')[0];
            SheetManager[regions[region]]()
                .then(async scheduleData => {
                    await prismaClient.loadSheddingStatus.findUnique({
                        where: {
                            id: 1
                        }
                    }).then(status => {
                        getCurrentLoadShedding(scheduleData, suburb, status.status, adjustTime)
                            .then(schedule => {
                                res.status(200)
                                    .json(schedule);
                            });
                    })
                })

        });
    }
}

module.exports = ScheduleController;