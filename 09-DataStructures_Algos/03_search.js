/*
There are two string arrays; capitals and countries.

'capitals' is a sorted array with names of capital cities.
'countries' is an unodered array with names of countries corresponding to the capitals.

Write a function which takes two array of strings - capitals and countries  
 -and a city-name string as parameters. 
 The city-name is present in the capitals array.
 Find the country name corresponding to the city-name.
 
 The search should be efficient and with complexity < O(n)
 Hints - binary search
*/

function findCountry(capitals, countries, city) {
  // find the index of capital
  // the index of the country is same as that of the capital, which we found
  let capitalIndex = findCapital(capitals, 0, capitals.length, city);

  // Using the index, find the country
  let country = countries[capitalIndex];

  // return the country name
  return country;
}

function findCapital(capitals, start, end, city) {
  for (let i = start; i < end; i++) {
    if (capitals[i] === city) return i;
  }
  return -1;
}
const capitals = [
  "Aden",
  "Algiers",
  "Baghdad",
  "Baku",
  "Berlin",
  "Rabat",
  "Tehran",
  "Tripoli",
  "Tunis"
];
const countries = [
  "Yemen",
  "Algeria",
  "Iraq",
  "Azerbaijan",
  "Germany",
  "Morocco",
  "Iran",
  "Libya",
  "Tunisia"
];

console.log("Should be Morocco: ", findCountry(capitals, countries, "Rabat"));
console.log("Should be Tunisia: ", findCountry(capitals, countries, "Tunis"));
console.log("Should be Iraq: ", findCountry(capitals, countries, "Baghdad"));
