function datesAreSameDay(date1, date2) {
  (date1 = new Date(date1)), (date2 = new Date(date2));
  return (
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function getSetString(propertiesObj) {
  return Object.keys(propertiesObj)
    .reduce((res, key) => {
      return (
        res + `${res.length ? "AND " : ""}"${key}" = '${propertiesObj[key]}' `
      );
    }, "")
    .trim();
}

const idGenerator = () => `${Math.floor(Math.random() * 100000)}`;

module.exports = {
  datesAreSameDay,
  idGenerator,
  getSetString
};
