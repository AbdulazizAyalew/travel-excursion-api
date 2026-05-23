const { countries } = require("countries-list");

// Extract all official country names into an array
const validCountries = Object.values(countries).map((c) => c.name);

const isValidCountry = (country) => {
  return validCountries.some((c) => c.toLowerCase() === country.toLowerCase());
};

module.exports = { validCountries, isValidCountry };
