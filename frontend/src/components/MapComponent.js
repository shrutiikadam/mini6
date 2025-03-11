import React, { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import ttServices from '@tomtom-international/web-sdk-services';
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [busMarker, setBusMarker] = useState(null);
  const [busTrail, setBusTrail] = useState([]);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const newMap = tt.map({
      key: TOMTOM_API_KEY,
      container: "map",
      center: [72.8411, 19.0213], // Dadar, Mumbai
      zoom: 14,
      pitch: 45,
      bearing: 0,
    });

    // Display traffic flow on the map
    newMap.on('load', () => {
      newMap.addLayer({
        id: 'traffic-flow',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_API_KEY}`
          ],
          tileSize: 256
        },
        layout: { visibility: 'visible' }
      });
    });

    setMap(newMap);
    return () => newMap.remove();
  }, []);

  // Fetch route from TomTom Routing API
  useEffect(() => {
    if (!map) return;

    const fetchRoute = async () => {
      try {
        const response = await ttServices.services.calculateRoute({
          key: TOMTOM_API_KEY,
          traffic: true, // Enable traffic-aware routing
          locations: ["72.8411,19.0213", "72.8310,19.0499"], // Start & End Coordinates
        });

        const coordinates = response.toGeoJson().features[0].geometry.coordinates;
        setRoute(coordinates);

        // Draw the route on the map
        if (map.getSource("route")) {
          map.getSource("route").setData({
            type: "Feature",
            geometry: { type: "LineString", coordinates },
          });
        } else {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "LineString", coordinates },
            },
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#0078FF", // Blue route
              "line-width": 4,
            },
          });
        }

        // Add bus marker at the starting position
        if (!busMarker) {
          const marker = new tt.Marker().setLngLat(coordinates[0]).addTo(map);
          setBusMarker(marker);
        }

      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [map]);

  // Move the bus along the route
  useEffect(() => {
    if (!map || !busMarker || route.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index >= route.length) {
        clearInterval(interval);
        return;
      }

      const newPosition = route[index];
      busMarker.setLngLat(newPosition); // Move the marker

      setBusTrail((prevTrail) => [...prevTrail, newPosition]); // Add to trail

      // Draw the trail
      if (map.getSource("trail")) {
        map.getSource("trail").setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: [...busTrail, newPosition] },
        });
      } else {
        map.addSource("trail", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [...busTrail, newPosition] },
          },
        });

        map.addLayer({
          id: "trail",
          type: "line",
          source: "trail",
          paint: {
            "line-color": "#000000", // Black trail
            "line-width": 3,
          },
        });
      }

      index++;
    }, 2000); // Move every 2 seconds

    return () => clearInterval(interval);
  }, [map, busMarker, route]);

  return <div id="map" style={{ width: "50%", height: "500px"  }} />;
};

export default MapComponent;
