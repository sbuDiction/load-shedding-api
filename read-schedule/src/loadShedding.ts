import loadSheddingMap from '../../json/loadshedding_map.json';

interface State {
    status: string;
    province: string
}

/**
 * This function takes the data scraped from the spreadsheet and processes it..
 * @param spreadSheet 
 */
export const processSpreadSheet = async (spreadSheet: Excel.Worksheet, ctx: Excel.RequestContext) => {
    try {
        let province: string = 'KwaZulu-Natal';
        let city: string = '';

        // Sheet coordinates...
        const provinceRangeAddress: string = 'A6';
        const cityRangeAddress: string = 'A8';
        const suburbRangeAddress: string = 'A10';
        const loadSheddingScheduleRangeAddress: string = 'B2:AH14';

        let state: State = {
            status: 'Init',
            province: province
        }

        // Check if the spreadsheet is for a province that exists in the loadshedding map..
        if (loadSheddingMap[province]) {
            // Update status for every process..
            state = {
                status: 'Start',
                province: province
            }

            // 
            const loadSheddingData = spreadSheet.getRange(provinceRangeAddress);
            const currentCityVal = spreadSheet.getRange(cityRangeAddress);

            // Load
            loadSheddingData.load('values');
            // Sync
            await ctx.sync();

            // Convert the spreadsheet loadshedding data to json..
            const loadSheddingDataToJson = loadSheddingData.toJSON();

            const currentProvinceCities = loadSheddingMap[province]['cities'];
            // console.log(currentProvinceCities);
            console.log(currentCityVal);
            // currentProvinceCities.forEach(currentCity => {
            //     if (currentCity['city'] === currentCityVal.values.toString()) { 
                    
            //     }
            // });





        }
    } catch (error) {

    }

}