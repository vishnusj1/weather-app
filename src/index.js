const form = document.querySelector('#form');

// Object for global Http Error handling.

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

const loadJson = async (url) => {
  const response = await fetch(url, { mode: 'cors' });
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
};

const getLocation = async (e) => {
  e.preventDefault();
  const input = document.querySelector('#search-bar');
  const location = input.value;
  getWeatherData(location);
  input.value = '';
};

const getWeatherData = async (location) => {
  const data = await loadJson(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=59499ea3663b2b05c9a5b852ee18a988`
  );
  const processedData = processData(data);
  displayData(processedData);
};

// Destructred for easier data handling
const processData = ({
  main: { feels_like, grnd_level, humidity, pressure, sea_level, temp, temp_max, temp_min },
  name,
  sys: { country },
}) => {
  return {
    name,
    country,
    temp,
    temp_max,
    temp_min,
    humidity,
    pressure,
    feel: feels_like,
    ground: grnd_level,
    sea: sea_level,
  };
};

const displayData = (data) => {
  const location = document.querySelector('.region > .location');
  const temp = document.querySelector('.temp > .number');
  const feels = document.querySelector('.feels-like > span');
  const humidity = document.querySelector('.humidity > span');
  // const pressure = document.querySelector('.pressure > span');

  location.textContent = `${data.name}, ${data.country}`;
  temp.textContent = `${convertNumber(data.temp)}`;
  feels.textContent = `${convertNumber(data.feel)}`;
  humidity.textContent = `${data.humidity} %`;
};

function convertNumber(kelvin) {
  let number = kelvin;
  let celcius = Math.round(number - 273.15);
  return celcius;
}

const successfulLookup = async (position) => {
  const { latitude, longitude } = position.coords;
  const data = await loadJson(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=70d3b04467864dcf917523e42e7029d4`
  );
  const location = data.results[0].components.state_district;
  getWeatherData(location);
};

const faliureCallback = async () => {
  getWeatherData(`Mumbai`);
};

const getUserLocation = (() => {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(successfulLookup, faliureCallback);
  }
})();

form.addEventListener('submit', getLocation);
