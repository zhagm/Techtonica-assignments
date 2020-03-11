import React, { useState } from "react";

function SightingForm() {
  let [id, setId] = useState("");
  let [sightingTimestamp, setSightingTimestamp] = useState("");
  let [sightingLocation, setSightingLocation] = useState("");
  let [individualId, setIndividualId] = useState("");
  let [isHealthy, setIsHealthy] = useState("");
  let [sighterEmail, setSighterEmail] = useState("");
  let newSighting = {
    id: 999,
    sighting_timestamp: "2020-03-12",
    sighting_location: "San Francisco, CA",
    individual_id: "22",
    is_healthy: "true",
    sighter_email: "zhag@zhag.co"
  };
  return <h1>FORM</h1>;
}

export default SightingForm;
