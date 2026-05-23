import { useState, useEffect, useRef } from "react";

// Loads Google Maps script manually into the page
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    // If script tag already exists, wait for it
    const existing = document.getElementById("google-maps-script");
    if (existing) {
      existing.addEventListener("load", resolve);
      return;
    }
    // Create and inject the script tag
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export default function LocationPicker({ onLocationReady }) {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const loadMap = async (lat, lng) => {
    // Load Google Maps script first
    await loadGoogleMapsScript(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

    const google = window.google;

    // Create map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // Green marker for user position
    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: "You are here",
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    // Reverse geocode coordinates → readable address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const addr = results[0].formatted_address;
        setAddress(addr);
        onLocationReady({ lat, lng, address: addr });
      }
    });

    // Find nearby restaurants and drop red markers
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      { location: { lat, lng }, radius: 500, type: "restaurant" },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.slice(0, 5).forEach((place) => {
            new google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
              icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            });
          });
        }
      }
    );
  };

  const getLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Your browser doesn't support location.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        await loadMap(lat, lng);
        setLoading(false);
      },
      () => {
        setError("Couldn't get your location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  const resetLocation = () => {
    setCoords(null);
    setAddress("");
    onLocationReady(null);
  };

  return (
    <div className="space-y-2">

      {/* Button */}
      {!coords && (
        <button
          type="button"
          onClick={getLocation}
          disabled={loading}
          className={`w-full py-2 rounded-xl text-sm font-medium border transition
            ${loading
              ? "bg-gray-100 text-gray-400 border-gray-200"
              : "bg-green-50 text-green-600 border-green-300 hover:bg-green-100"}`}
        >
          {loading ? "📍 Getting location..." : "📍 Use My Location"}
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Map + Address */}
      {coords && (
        <div className="space-y-2">
          <div
            ref={mapRef}
            className="w-full h-40 rounded-xl overflow-hidden border border-gray-200"
          />
          {address && (
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <span>📍</span>
              <span>{address}</span>
            </p>
          )}
          <button
            type="button"
            onClick={resetLocation}
            className="text-xs text-gray-400 underline"
          >
            Remove location
          </button>
        </div>
      )}

    </div>
  );
}