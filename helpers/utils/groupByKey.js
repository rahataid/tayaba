const groupBy = (key) => (array) => {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }
  if (!Array.isArray(array)) {
    throw new TypeError('array must be an array');
  }
  return array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
};
module.exports = { groupBy };
