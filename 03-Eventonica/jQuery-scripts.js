function updateListDisplay(items, divId) {
  const $ul = $("<ul>").append(
    items.map(item => $("<li>").html(`${item.name}`))
  );
  let $listParentDiv = $(divId);
  $listParentDiv.html($ul);
}

$(document).ready(() => {
  const eventRecommender = new EventRecommender();

  $("#add-user").submit(event => {
    event.preventDefault();
    let id = $("#add-user-id").val();
    let name = $("#add-user-name").val();
    eventRecommender.addUser(name, id);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#delete-user").submit(event => {
    event.preventDefault();
    let idToDelete = $("#delete-user-id").val();
    eventRecommender.deleteUser(idToDelete);
    updateListDisplay(eventRecommender.users, "#all-users");
  });

  $("#add-event").submit(event => {
    event.preventDefault();
    let id = $("#add-event-id").val();
    let name = $("#add-event-name").val();
    let category = $("#add-event-category").val();
    let date = $("#add-event-date").val();
    eventRecommender.addEvent(name, date, category, id);
    console.log(eventRecommender.events);
    updateListDisplay(eventRecommender.events, "#all-events");
  });

  $("#delete-event").submit(event => {
    event.preventDefault();
    let idToDelete = $("#delete-event-id").val();
    eventRecommender.deleteEvent(idToDelete);
    updateListDisplay(eventRecommender.events, "#all-events");
  });
});
