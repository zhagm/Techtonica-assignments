function createValidPropsObj(obj, validKeysArr) {
  let result = {};
  for (let key of validKeysArr) {
    if (obj[key] != undefined && obj[key] != null) result[key] = obj[key];
  }
  return result;
}

const idGenerator = () => `${Math.floor(Math.random() * 100000)}`;

module.exports = {
  idGenerator,
  createValidPropsObj
};
