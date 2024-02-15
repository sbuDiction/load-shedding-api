const fs = require('fs');

class ExcelFileManager {
    XLSX
    constructor(XLSX) {
        this.XLSX = XLSX;
    }
    getWorkbook = workbookName => {
        const workbook = this.XLSX.readFile(`./files/${workbookName}_LS.xlsx`, { cellFormula: true, sheetStubs: true });
        return workbook;
    }

    getExcelFiles = () => {
        fs.readdir('./files/', { encoding: 'utf8' }, (err, files) => {
            if (err) console.error(err);
            else {
                console.log(files);

            }
        })
    }
}

module.exports = ExcelFileManager;