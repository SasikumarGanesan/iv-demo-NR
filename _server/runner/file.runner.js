const fs = require('fs');
const {
  getCsvToJson,
  getCsvToJsonExcept,
  getCsvToJsonOnly
} = require('../helpers/csvReader.helper');
const {
  arrayFilterNot,
  filterParentsChildren,
  changeObjectKeyFormat
} = require('../helpers/array.helper');

module.exports.file_analyze_runner = async (
  positiveFile,
  negativeFile,
  referenceFile,
  actualChartFile,
  forecastChartFile
) => {
  if (
    fs.existsSync(positiveFile) &&
    fs.existsSync(negativeFile) &&
    fs.existsSync(referenceFile)
  ) {
    const [
      referenceJson,
      positiveJson,
      negativeJson,
      actualChartJson,
      forecastedChartJson
    ] = await Promise.all([
      getCsvToJsonOnly(
        referenceFile,
        /(dim_id|Customer Segment|Product Category|Region|Sales_prev_week|last 3 month median|actual_metric_corrected|previous_week_metric_corrected|previous_week_metric_corrected|forecasted_metric_corrected|Change from forecast)/
      ),
      getCsvToJsonExcept(positiveFile, /(ref metric)/),
      getCsvToJsonExcept(negativeFile, /(ref metric)/),
      getCsvToJson(actualChartFile),
      getCsvToJson(forecastChartFile)
    ]);
    const filteredPositive = positiveJson
      ? arrayFilterNot(positiveJson, 'lvl', '1')
      : [];
    const filteredNegative = negativeJson
      ? arrayFilterNot(negativeJson, 'lvl', '1')
      : [];
    const forecastedChart = forecastedChartJson[forecastedChartJson.length - 1];
    const positive = filterParentsChildren(
      filteredPositive,
      referenceJson,
      'spike',
      actualChartJson,
      forecastedChart
    );
    const negative = filterParentsChildren(
      filteredNegative,
      referenceJson,
      'dip',
      actualChartJson,
      forecastedChart
    );
    const data = changeObjectKeyFormat([...positive, ...negative]);
    return { message: 'File saved successfully.', data, status: true };
  } else {
    return { message: 'Csv file\'s not found', data: [], status: false };
  }
};
