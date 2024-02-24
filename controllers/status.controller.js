const LoadSheddingStatusMonitor = require("../LoadSheddingStatusMonitor");

class StatusController {
    static checkCurrentStatus = async (req, res) => {
        LoadSheddingStatusMonitor.checkCurrentStatus().then(status => {
            res.status(200)
                .json({
                    stage: status,
                    source: 'https://loadshedding.eskom.co.za/'
                })
        });
    }
}

module.exports = StatusController;