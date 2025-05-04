import axios from 'axios';

const BASE_URL = 'https://psgc.gitlab.io/api';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

class Cache {
  constructor() {
    this.data = new Map();
  }

  set(key, value) {
    this.data.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.data.delete(key);
      return null;
    }
    return item.value;
  }
}

const cache = new Cache();

const cleanCityName = (name) => {
  return name
    .replace(/(City of|Municipality of|District of)/i, '')
    .replace(/City$/i, '')
    .replace(/Municipality$/i, '')
    .replace(/District$/i, '')
    .trim();
};

export const addressService = {
  async getCities(searchTerm = '') {
    const cacheKey = 'cities';
    const cachedData = cache.get(cacheKey);
    
    try {
      let cities;
      if (!cachedData) {
        const response = await axios.get(`${BASE_URL}/cities.json`);
        cities = response.data
          .map(city => ({
            label: cleanCityName(city.name),
            value: city.code,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        cache.set(cacheKey, cities);
      } else {
        cities = cachedData;
      }

      if (searchTerm) {
        return cities.filter(city => 
          city.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return cities;
    } catch (error) {
      throw new Error('Failed to fetch cities');
    }
  },

  
  async getBarangays(cityCode) {
    if (!cityCode) {
      throw new Error('City code is required');
    }

    const cacheKey = `barangays_${cityCode}`;
    const cachedData = cache.get(cacheKey);

    try {
      let barangays;
      if (!cachedData) {
        const response = await axios.get(`${BASE_URL}/cities/${cityCode}/barangays.json`);
        barangays = response.data
          .map(barangay => ({
            label: barangay.name,
            value: barangay.code
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        cache.set(cacheKey, barangays);
      } else {
        barangays = cachedData;
      }
      
      return barangays;
    } catch (error) {
      throw new Error('Failed to fetch barangays');
    }
  },

  async searchCities(searchText) {
    try {
      const cities = await this.getCities();
      if (!searchText) return [];
      
      return cities.filter(city => 
        city.label.toLowerCase().includes(searchText.toLowerCase())
      );
    } catch (error) {
      throw new Error('Failed to search cities');
    }
  },

  async handleCityChange(cityId) {
    try {
      const cityList = await this.getCities();
      const selectedCity = cityList.find(city => city.value === cityId);
      const barangayList = await this.getBarangays(cityId);
      
      return {
        cityName: selectedCity?.label || '',
        barangays: barangayList
      };
    } catch (error) {
      throw new Error('Failed to handle city change');
    }
  },

  clearCache() {
    cache.data.clear();
  }
};

export const validateCityCode = (cityCode) => {
  return typeof cityCode === 'string' && cityCode.length === 9;
};
