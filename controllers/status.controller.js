// const LoadSheddingStatusMonitor = require("../LoadSheddingStatusMonitor");
const prismaClient = require("../prismaClient");

class StatusController {
    static checkCurrentStatus = async (req, res) => {
        await prismaClient.loadSheddingStatus
            .findFirst(
                {
                    where: {
                        id: 1
                    }
                }).then(status => {

                    res.status(200)
                        .json({
                            stage: status.status,
                            source: 'https://loadshedding.eskom.co.za/'
                        })
                })
        // LoadSheddingStatusMonitor.checkCurrentStatus().then(status => {
        //     res.status(200)
        //         .json({
        //             stage: status,
        //             source: 'https://loadshedding.eskom.co.za/'
        //         })
        // });
    }
}

module.exports = StatusController;