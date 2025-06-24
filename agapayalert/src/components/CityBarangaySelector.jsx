import React, { useEffect, useState } from "react";
import { addressService } from "@/services/addressService";

export default function CityBarangaySelector({ onChange }) {
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  // Fetch cities on mount
  useEffect(() => {
    addressService.getCities()
      .then(data => {
        setCities(data);
      })
      .catch(err => {
        setCities([]);
        console.error("Failed to fetch cities:", err);
      });
  }, []);

  // Fetch barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      addressService.getBarangays(selectedCity)
        .then(data => setBarangays(data))
        .catch(err => {
          setBarangays([]);
          console.error("Failed to fetch barangays:", err);
        });
    } else {
      setBarangays([]);
    }
    setSelectedBarangay("");
  }, [selectedCity]);

  // Notify parent on change
  useEffect(() => {
    if (onChange) {
      onChange({ city: selectedCity, barangay: selectedBarangay });
    }
  }, [selectedCity, selectedBarangay, onChange]);

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
      </label>
      <br />
      <label>
        Barangay:
        <select
          value={selectedBarangay}
          onChange={e => setSelectedBarangay(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">Select Barangay</option>
          {barangays.map(brgy => (
            <option key={brgy.value} value={brgy.value}>{brgy.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}