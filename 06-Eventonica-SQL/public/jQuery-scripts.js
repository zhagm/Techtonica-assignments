function fetchAndUpdateListDisplay(url, divId, key) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) items = data;
      else items = data[key] || [];
      updateListDisplay(items, divId);
    });
}

function updateListDisplay(items, divId) {
  const liItems = items.map(item => $("<li>").html(`${item.name}`));
  let $listParent = $(divId);
  $listParent.html(liItems);
}

function updateTableDisplay(items, tableBodyId) {
  const tableItems = items.map(item => {
    let tr = $("<tr>");
    let nameTd = $("<td>").html(`${item.name}`);
    let addButton = $("<button>").html("Add to collection");
    addButton.click(() => {
      addEvent(
        item.name,
        item.dates.start.dateTime,
        item.classifications[0].segment.name,
        item.id,
        item.images[0].url,
        item.info,
        item.url,
        item._links.venues[0].href
      );
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

async function getEventLocation(path) {
  return await fetch(
    `https://app.ticketmaster.com${path}&apikey=${keys.ticketmaster}`
  )
    .then(res => res.json())
    .then(data => {
      return {
        city: `${data.city.name}, ${
          data.state ? data.state.stateCode : data.country.countryCode
        }`,
        venue: data.address.line1
      };
    })
    .catch(console.error);
}

async function addEvent(
  name,
  date,
  category,
  id,
  image,
  description,
  url,
  locationURL
) {
  let city, venue;
  if (locationURL) {
    let location = await getEventLocation(locationURL);
    city = location.city;
    venue = location.venue;
  }
  fetch("/api/events", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      date,
      category,
      id,
      image,
      description,
      url,
      city,
      venue
      // dateAdded: Date.now()
    })
  })
    .then(() => {
      fetchAndUpdateListDisplay("/api/events", "#all-events", "events");
    })
    .catch(err => console.error(err));
}

function addUser(name, id) {
  fetch("/api/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, id })
  })
    .then(res => {
      if (res.status === 201)
        fetchAndUpdateListDisplay("/api/users", "#all-users", "users");
    })
    .catch(err => console.error(err));
}

$(document).ready(() => {
  fetchAndUpdateListDisplay("/api/events", "#all-events", "events");
  fetchAndUpdateListDisplay("/api/users", "#all-users", "users");

  function formSubmitHandler(e) {
    let inputsArr = $(e.target).find("input[name]");
    let result = {};
    for (let input of inputsArr) {
      let name = $(input).attr("name");
      let val = $(input).val();
      if (val) result[name] = val;
    }
    return result;
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
    addUser(name, id);
  });

  $("#delete-user").submit(e => {
    e.preventDefault();
    let idToDelete = $("#delete-user-id").val();
    fetch(`/api/users/${idToDelete}`, {
      method: "DELETE"
    })
      .then(() => {
        fetchAndUpdateListDisplay("/api/users", "#all-users", "users");
      })
      .catch(err => console.error(err));
  });

  $("#add-event").submit(e => {
    e.preventDefault();
    formSubmitHandler(e);
    let name = $("#add-event-name").val();
    let date = $("#add-event-date").val();
    let category = $("#add-event-category").val();
    let id = $("#add-event-id").val();
    addEvent(name, date, category, id);
  });

  $("#delete-event").submit(e => {
    e.preventDefault();
    let idToDelete = $("#delete-event-id").val();
    fetch(`/api/events/${idToDelete}`, {
      method: "DELETE"
    })
      .then(() => {
        fetchAndUpdateListDisplay("/api/events", "#all-events", "events");
      })
      .catch(err => console.error(err));
  });

  $("#date-search").submit(e => {
    e.preventDefault();
    let date = $("#date-search-id").val();
    let dateFilteredEvents;
    let resultHeader = "No events found on that day.";
    if (isNaN(new Date(date))) {
      dateFilteredEvents = [];
      $("#date-search-results").html(resultHeader);
      updateListDisplay(dateFilteredEvents, "#date-search-list");
    } else {
      fetch(`/api/events?date=${date}`)
        .then(res => res.json())
        .then(({ events: dateFilteredEvents }) => {
          if (dateFilteredEvents.length)
            resultHeader = `Events on ${new Date(date)
              .toUTCString()
              .slice(0, -12)}`;
          $("#date-search-results").html(resultHeader);
          updateListDisplay(dateFilteredEvents, "#date-search-list", "events");
        });
    }
  });

  $("#category-search").submit(e => {
    e.preventDefault();
    let category = $("#category-search-id").val();
    let resultHeader = "No events found in that category.";
    if (!category) {
      updateListDisplay([], "#category-search-list");
      $("#category-search-results").html(resultHeader);
    } else {
      fetch(`/api/events?category=${encodeURIComponent(category)}`)
        .then(res => res.json())
        .then(({ events: categoryFilteredEvents }) => {
          if (categoryFilteredEvents.length)
            resultHeader = `Events in the '${category}' category`;
          $("#category-search-results").html(resultHeader);
          updateListDisplay(categoryFilteredEvents, "#category-search-list");
        });
    }
  });

  $("#save-user-event").submit(e => {
    e.preventDefault();
    let userId = $("#save-user-id").val();
    let eventId = $("#save-event-id").val();
    let userPromise = fetch(`/api/users/${userId}`).then(res => res.json());
    let eventPromise = fetch(`/api/events/${eventId}`).then(res => res.json());
    let resultHeader;
    Promise.all([userPromise, eventPromise])
      .then(([{ user }, { event }]) => {
        if (user && event) {
          resultHeader = `${event.name} was added to ${user.name}'s saved events`;
          return fetch(`/api/users/${user.id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ eventId })
          });
        }
      })
      .then(res => {
        if (res.status === 400)
          resultHeader = "ERROR: Did not save event to user's events.";
        $("#save-user-event-results").html(resultHeader);
      })
      .catch(err => {
        console.error(err);
        $("#save-user-event-results").html(
          "ERROR: Did not save event to user's events."
        );
      });
  });
});
