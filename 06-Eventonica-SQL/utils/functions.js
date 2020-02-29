function datesAreSameDay(date1, date2) {
  (date1 = new Date(date1)), (date2 = new Date(date2));
  return (
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function createValidPropsObj(obj, validKeysArr) {
  let result = {};
  for (let key of validKeysArr) {
    if (obj[key] != undefined && obj[key] != null) result[key] = obj[key];
  }
  return result;
}

const idGenerator = () => `${Math.floor(Math.random() * 100000)}`;

module.exports = {
  datesAreSameDay,
  idGenerator,
  createValidPropsObj
};
