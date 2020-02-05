function updateListDisplay(items, divId) {
  const liItems = items.map(item => $("<li>").html(`${item.name}`));
  let $listParent = $(divId);
  $listParent.html(liItems);
}

$(document).ready(() => {
  const eventRecommender = new EventRecommender();

  $("#add-user").submit(e => {
    e.preventDefault();
    let id = $("#add-user-id").val();
    let name = $("#add-user-name").val();
    eventRecommender.addUser(name, id);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#delete-user").submit(e => {
    e.preventDefault();
    let idToDelete = $("#delete-user-id").val();
    eventRecommender.deleteUser(idToDelete);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#add-event").submit(e => {
    e.preventDefault();
    let id = $("#add-event-id").val();
    let name = $("#add-event-name").val();
    let category = $("#add-event-category").val();
    let date = $("#add-event-date").val();
    eventRecommender.addEvent(name, date, category, id);
    updateListDisplay(eventRecommender.events, "#all-events");
  });

  $("#delete-event").submit(e => {
    e.preventDefault();
    let idToDelete = $("#delete-event-id").val();
    eventRecommender.deleteEvent(idToDelete);
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
    updateListDisplay(dateFiltered, "#date-search-list");
  });

  $("#category-search").submit(e => {
    e.preventDefault();
    let category = $("#category-search-id").val();
    let categoryFiltered = eventRecommender.findEventsByCategory(category);
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
    console.log(`Successfully added ${event.name} to ${user.name}!`);
  });
});
