
class GenerateAreaName {
    static generate = (areaName = '') => {
        let word = areaName.split('').map(extension => {
            extension = extension.replace(/^\d+(?:,)*$/, '');
            extension = extension.replace(/,/g, ' ');
            extension = extension.replace(/^\W+$/, ' ');
            return extension;
        })
        const extName = word.join('').trimEnd();
        return extName;
    }
}

module.exports = GenerateAreaName;