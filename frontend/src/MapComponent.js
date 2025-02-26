import React, { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const TOMTOM_API_KEY = "";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [busMarkers, setBusMarkers] = useState({}); // Store markers

  useEffect(() => {
    // Initialize the map
    const newMap = tt.map({
      key: TOMTOM_API_KEY,
      container: "map",
      center: [77.2090, 28.6139], // Center on Delhi
      zoom: 10,
    });

    setMap(newMap);

    return () => newMap.remove(); // Cleanup
  }, []);

  useEffect(() => {
    if (!map) return;

    const fetchBusLocations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/buses");
        const data = await response.json();

        if (!data) throw new Error("Invalid data format");

        Object.entries(data).forEach(([bus, position]) => {
          const [lat, lng] = position;

          if (busMarkers[bus]) {
            // Remove the old marker before updating position
            busMarkers[bus].remove();
          }

          // Create a new marker at the new position
          const marker = new tt.Marker().setLngLat([lng, lat]).addTo(map);

          // Update the state with the new marker
          setBusMarkers((prevMarkers) => ({
            ...prevMarkers,
            [bus]: marker,
          }));
        });
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchBusLocations();
    const interval = setInterval(fetchBusLocations, 5000); // Update every 5 sec

    return () => clearInterval(interval);
  }, [map]);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default MapComponent;
