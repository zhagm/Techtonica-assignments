import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import ItemsTable from "./ItemsTable";
import SightingForm from "./SightingForm";

import { getAllSpecies, getAllSightings, createNewSighting } from "./API.js";

function App() {
  const [species, setSpecies] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [sightings, setSightings] = useState([]);

  const updateSightings = () => {
    getAllSightings()
      .then(({ data }) => {
        console.log("getAllSightings data: ", data);
        setSightings(data.sightings);
      })
      .catch(console.error);
  };

  useEffect(() => {
    updateSightings();
  }, []);

  return (
    <div className="App">
      <Grid container>
        <Grid item xs={12}>
          <h1>Animal Sightings Tracker</h1>
        </Grid>
        <Grid item xs={12}>
          <h2>SIGHTINGS</h2>
          <ItemsTable
            headers={[
              "id",
              "individual_id",
              "sighting_location",
              "sighting_timestamp",
              "sighter_email"
            ]}
            items={sightings}
          />
        </Grid>
        <Grid item xs={12}>
          <h2>Submit new Sighting</h2>
          <SightingForm setSightings={setSightings} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
