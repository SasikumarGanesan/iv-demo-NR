const csvToJson = require('csvtojson');

module.exports.getCsvToJson= async (file) => {
    try {
        return await csvToJson().fromFile(file);
    } catch (error) {
        return error;
    }
};

module.exports.getCsvToJsonOnly = async (file, includeColumns) => {
    try {
        return await csvToJson({ includeColumns }).fromFile(file);
    } catch (error) {
        return error;
    }
};
module.exports.getCsvToJsonExcept = async (file, ignoreColumns) => {
    try {
        return await csvToJson({ ignoreColumns }).fromFile(file);
    } catch (error) {
        return error;
    }
};