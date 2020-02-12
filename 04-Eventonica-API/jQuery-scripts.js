function updateListDisplay(items, divId) {
  const liItems = items.map(item => $("<li>").html(`${item.name}`));
  let $listParent = $(divId);
  $listParent.html(liItems);
}

function updateLocalStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

$(document).ready(() => {
  let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  let storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
  const eventRecommender = new EventRecommender(storedUsers, storedEvents);
  if (storedUsers) updateListDisplay(eventRecommender.users, "#all-users");
  if (storedEvents) updateListDisplay(eventRecommender.events, "#all-events");

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
    console.log("DELETE");
    let idToDelete = $("#delete-user-id").val();
    eventRecommender.deleteUser(idToDelete);
    updateLocalStorage("users", eventRecommender.users);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#add-event").submit(e => {
    e.preventDefault();
    let id = $("#add-event-id").val();
    let name = $("#add-event-name").val();
    let category = $("#add-event-category").val();
    let date = $("#add-event-date").val();
    eventRecommender.addEvent(name, date, category, id);
    updateLocalStorage("events", eventRecommender.events);
    updateListDisplay(eventRecommender.events, "#all-events");
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
