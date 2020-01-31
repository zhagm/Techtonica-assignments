class Event {
  constructor(name, description, date) {
    this.name = name;
    this.description = description;
    this.availableTickets = [];
    this.eventDate = new Date(date);
  }
  addAvailableTickets(name, price) {
    this.availableTickets.push(new TicketType(name, price));
  }
  allTickets() {
    return this.availableTickets.reduce((str, ticket, index) => {
      return str + ` ${index + 1}. ${ticket.name} ($${ticket.price})`;
    }, "All tickets: ");
  }
  searchTickets(min, max) {
    let i = 1;
    let result = this.availableTickets.reduce((str, ticket) => {
      if (ticket.price >= min && ticket.price <= max)
        str += ` ${i++}. ${ticket.name} ($${ticket.price})`;
      return str;
    }, "Eligible tickets: ");
    if (i === 1) return "No tickets available.";
    return result;
  }
}

class TicketType {
  constructor(name, price) {
    this.name = name;
    this.price = price || 0;
  }
}

const eventObj1 = new Event(
  "KLOS Golden Gala",
  "An evening with hollywood vampires",
  "2020-02-05"
);
const eventObj2 = new Event(
  "Skillet & Sevendust",
  "Victorious war tour",
  "2020-03-10"
);
const eventObj3 = new Event(
  "Jenny Lewis",
  "On the line tour 2019",
  "2020-10-10"
);

const eventArray = new Array();

eventArray.push(eventObj1, eventObj2, eventObj3);
console.log("eventArray: ", eventArray);

$(document).ready(() => {
  let html = "";
  let min = 0;
  let max = 100;
  $.each(eventArray, (index, event) => {
    let { name, description, availableTickets } = event;
    console.log(event);
    html += `<li>${name} - ${description} - ${event.searchTickets(
      min,
      max
    )}</li>`;
  });
  $("#event").html(html);
});

eventObj1.addAvailableTickets("human", 299);
eventObj1.addAvailableTickets("vampire", 99);

eventObj2.addAvailableTickets("General Admission", 25);
eventObj2.addAvailableTickets("Floor Seating", 80);

eventObj3.addAvailableTickets("Orchestra", 300);
eventObj3.addAvailableTickets("Mezzanine", 200);
eventObj3.addAvailableTickets("Balcony", 100);
