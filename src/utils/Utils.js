class Utils {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static removeLastCharacter(string) {
        return string.substring(0, string.length - 1);
    }
}

module.exports = Utils;