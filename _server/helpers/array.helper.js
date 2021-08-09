const customerSeg = 'customer_segment';
const productSeg = 'product_category';
const regionSeg = 'region';
const { getCsvToJsonOnly } = require('./csvReader.helper');

module.exports.arrayFilter = (items = [], key, value) =>
  items.filter(item => item[key] === value);

module.exports.arrayFilterNot = (items = [], key, value) =>
  items.filter(item => item[key] !== value);

module.exports.filterParentsChildren = (
  parents = [],
  children = [],
  type,
  actualChartJson = null,
  forecastedObj = null,
  parentMainKey = 'Main Seg',
  parentKey = 'Impacted Seg',
  childKey = 'dim_id'
) =>
  parents.map(parent => {
    let keyArray = JSON.parse(parent[parentKey]);
    keyArray.unshift(JSON.parse(parent[parentMainKey]));
    const data = children
      .filter(child => keyArray.includes(JSON.parse(child[childKey])))
      .map(item => {
        const actualChart = actualChartJson.reduce(
          (acc, cur) => {
            const val = parseFloat(cur[item[childKey]]).toFixed(2);
            return {
            ...acc,
            [cur.dt]: parseFloat(val)
          };
        },
          {}
        );
        const forecastedChart = Object.keys(actualChart).reduce(
          (acc, cur) => ({ ...acc, [cur]: null }),
          {}
        );
        const aKeys = Object.keys(actualChart);
            const fVal = parseFloat(forecastedObj[`X${item[childKey]}`]).toFixed(2);
        forecastedChart[aKeys[aKeys.length - 1]] =
          parseFloat(fVal);
        return {
          ...item,
          actual_chart: actualChart,
          forecasted_chart: forecastedChart
        };
      });

    return {
      [parentMainKey.toLowerCase().replace(' ', '_')]: JSON.parse(
        parent[parentMainKey]
      ),
      type,
      data
    };
  });

module.exports.changeObjectKeyFormat = (items = []) => {
  return items.map(item => {
    let data = item.data.map(datum => {
      let obj = {};
      let segments = {};
      for (let key of Object.keys(datum))
        obj = { ...obj, [key.toLowerCase().replace(/\s|-/g, '_')]: datum[key] };

      if (obj[customerSeg] !== 'All') segments[customerSeg] = obj[customerSeg];
      delete obj[customerSeg];
      if (obj[productSeg] !== 'All') segments[productSeg] = obj[productSeg];
      delete obj[productSeg];
      if (obj[regionSeg] !== 'All') segments[regionSeg] = obj[regionSeg];
      delete obj[regionSeg];
      delete obj['field1'];

      return { ...obj, segments };
    });
    return { ...item, data };
  });
};
