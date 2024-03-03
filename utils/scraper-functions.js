class ScraperUtils {
    static findStage = (text = '') => {
        text = text.split(' ');
        text.forEach(word => {
            if (word.match(/[0-9]/)) {
                text = text = word;
                return text;
            }
        });
        return text;
    };
}

module.exports = ScraperUtils