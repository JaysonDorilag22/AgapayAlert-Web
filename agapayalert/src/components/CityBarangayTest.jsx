import React, { useEffect, useState } from "react";
import { addressService } from "@/services/addressService";

export default function CityBarangayTest() {
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Load cities on mount
  useEffect(() => {
    setLoadingCities(true);
    addressService.getCities()
      .then(data => {
        setCities(data);
      })
      .catch(err => {
        setCities([]);
        alert("Failed to load cities: " + err.message);
      })
      .finally(() => setLoadingCities(false));
  }, []);

  // Load barangays when city changes
  useEffect(() => {
    if (!selectedCity) {
      setBarangays([]);
      return;
    }
    setLoadingBarangays(true);
    addressService.getBarangays(selectedCity)
      .then(data => setBarangays(data))
      .catch(err => {
        setBarangays([]);
        alert("Failed to load barangays: " + err.message);
      })
      .finally(() => setLoadingBarangays(false));
  }, [selectedCity]);

  return (
    <div>
      <label>
        City:
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.value} value={city.value}>{city.label}</option>
          ))}
        </select>
        {loadingCities && <span>Loading cities...</span>}
      </label>
      <br />
      <label>
        Barangay:
        <select disabled={!selectedCity}>
          <option value="">Select Barangay</option>
          {barangays.map(brgy => (
            <option key={brgy.value} value={brgy.value}>{brgy.label}</option>
          ))}
        </select>
        {loadingBarangays && <span>Loading barangays...</span>}
      </label>
    </div>
  );
}