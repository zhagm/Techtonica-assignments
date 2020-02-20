$(document).ready(() => {
  let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  let storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
  const eventRecommender = new EventRecommender(storedUsers, storedEvents);
  if (storedUsers) updateListDisplay(eventRecommender.users, "#all-users");
  if (storedEvents) updateListDisplay(eventRecommender.events, "#all-events");

  function addEvent(name, date, category, id) {
    eventRecommender.addEvent(name, date, category, id);
    updateLocalStorage("events", eventRecommender.events);
    updateListDisplay(eventRecommender.events, "#all-events");
  }

  function updateListDisplay(items, divId) {
    const liItems = items.map(item => $("<li>").html(`${item.name}`));
    let $listParent = $(divId);
    $listParent.html(liItems);
  }

  function updateTableDisplay(items, tableBodyId) {
    const tableItems = items.map(item => {
      console.log(item);
      let tr = $("<tr>");
      let nameTd = $("<td>").html(`${item.name}`);
      let addButton = $("<button>").html("Add to collection");
      addButton.click(() => {
        // addEvent(item.id, item.name, item.dates.start.dateTime);
        addEvent(item.name, undefined, undefined, item.id);
      });
      let buttonTd = $("<td>").html(addButton);
      tr.append(nameTd);
      tr.append(buttonTd);
      return tr;
    });
    $(tableBodyId).html(tableItems);
  }

  function updateLocalStorage(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  $("#search-ticketmaster").submit(e => {
    e.preventDefault();
    let keyword = $("#keyword-input").val();
    if (!keyword) updateTableDisplay([], "#ticketmaster-events");
    else {
      fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&apikey=${keys.ticketmaster}`
      )
        .then(res => res.json())
        // .then(data => console.log("data: ", data))
        .then(data => {
          if (data.page.totalElements === 0) return [];
          return data._embedded.events;
        })
        .then(events => {
          updateTableDisplay(events, "#ticketmaster-events");
        })
        .catch(console.error);
    }
  });

  $("#add-user").submit(e => {
    e.preventDefault();
    let id = $("#add-user-id").val();
    let name = $("#add-user-name").val();
    eventRecommender.addUser(name, id);
    updateLocalStorage("users", eventRecommender.users);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#delete-user").submit(e => {
    e.preventDefault();
    let idToDelete = $("#delete-user-id").val();
    eventRecommender.deleteUser(idToDelete);
    updateLocalStorage("users", eventRecommender.users);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#add-event").submit(e => {
    e.preventDefault();
    let name = $("#add-event-name").val();
    let date = $("#add-event-date").val();
    let category = $("#add-event-category").val();
    let id = $("#add-event-id").val();
    addEvent(name, date, category, id);
  });

  $("#delete-event").submit(e => {
    e.preventDefault();
    let idToDelete = $("#delete-event-id").val();
    eventRecommender.deleteEvent(idToDelete);
    updateLocalStorage("events", eventRecommender.events);
    updateListDisplay(eventRecommender.events, "#all-events");
  });

  $("#date-search").submit(e => {
    e.preventDefault();
    let date = new Date($("#date-search-id").val());
    let dateFiltered;
    if (isNaN(date)) {
      dateFiltered = [];
    } else {
      dateFiltered = eventRecommender.findEventsByDate(date);
    }
    let resultHeader = "No events found on that day.";
    if (dateFiltered.length)
      resultHeader = `Events on ${date.toUTCString().slice(0, -12)}`;
    $("#date-search-results").html(resultHeader);
    updateListDisplay(dateFiltered, "#date-search-list");
  });

  $("#category-search").submit(e => {
    e.preventDefault();
    let category = $("#category-search-id").val();
    let categoryFiltered = eventRecommender.findEventsByCategory(category);
    let resultHeader = "No events found in that category.";
    if (categoryFiltered.length)
      resultHeader = `Events in the '${category}' category`;
    $("#category-search-results").html(resultHeader);
    updateListDisplay(categoryFiltered, "#category-search-list");
  });

  $("#save-user-event").submit(e => {
    e.preventDefault();
    let userId = $("#save-user-id").val();
    let eventId = $("#save-event-id").val();
    let user = eventRecommender.getUserById(userId);
    let event = eventRecommender.getEventById(eventId);
    if (!user || !event) return;
    eventRecommender.saveUserEvent(user, event);
    updateLocalStorage("users", eventRecommender.users);
    console.log(`Successfully added ${event.name} to ${user.name}!`);
  });
});
