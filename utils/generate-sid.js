class GenerateSuburbId {
    static generateSid = (suburbName = '') => {
        suburbName = suburbName.split('').map(word => {
            // word = word.;
            word = word.replace(' ', '');
            return word;
        })
        let suburbId = suburbName.join('').toLowerCase();
        return suburbId.replace(/\([0-9]+\)/, '');
    }
}

module.exports = GenerateSuburbId