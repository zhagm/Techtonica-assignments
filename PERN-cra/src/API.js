export const getAllSightings = () => {
  return fetch("http://localhost:3000/sightings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

export const getAllSpecies = () => {
  return fetch("http://localhost:3000/species", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

// export const apiCallGet = () => {
//   return fetch("http://localhost:3000/api", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json"
//     }
//   })
//     .then(res => res.json())
//     .then(data => {
//       console.log({ data });
//       return data;
//     })
//     .catch(err => console.error(err));
// };

// export const apiCallPost = () => {
//   return fetch("http://localhost:3000/api", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json"
//     },
//     body: JSON.stringify({ data: "SENT DATA RECIEVED" })
//   })
//     .then(res => res.json())
//     .then(data => {
//       console.log({ data });
//       return data;
//     })
//     .catch(err => console.error(err));
// };
export const createNewSighting = newSighting => {
  return fetch("http://localhost:3000/sightings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newSighting)
  })
    .then(res => res.json())
    .then(data => {
      console.log({ data });
      return data;
    })
    .catch(err => console.error(err));
};
