function datesAreSameDay(date1, date2) {
  (date1 = new Date(date1)), (date2 = new Date(date2));
  return (
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function categoryFilterEvents(category, events) {
  if (category)
    events = events.filter(event => {
      if (event.category && category)
        return event.category.toLowerCase() === category.toLowerCase();
      return false;
    });
  return events;
}

function dateFilterEvents(date, events) {
  if (date) events = events.filter(event => datesAreSameDay(event.date, date));
  return events;
}

function idGenerator() {
  return `${Math.floor(Math.random() * 100000)}`;
}

module.exports = {
  categoryFilterEvents,
  dateFilterEvents,
  datesAreSameDay,
  idGenerator
};
