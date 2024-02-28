class GenerateSuburbId {
    static generateSid = (suburbName = '') => {
        suburbName = suburbName.split('').map(word => {
            word = word.replace(/^\W+$/, '-');
            return word;
        })
        let suburbId = suburbName.join('').toLowerCase();
        return suburbId.trim();
    }
}

module.exports = GenerateSuburbId