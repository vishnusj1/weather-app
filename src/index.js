const form = document.querySelector('#form');
const loadingOverlay = document.querySelector('.loading-overlay');

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
  } else if (response.status == 404) {
    hideLoader();
    alert(`No results found.`);
    return;
  } else {
    throw new HttpError(response);
  }
};

const getLocation = async (e) => {
  e.preventDefault();
  const input = document.querySelector('#search-bar');
  const location = input.value;
  showLoader();
  getWeatherData(location);
  input.value = '';
};

const getWeatherData = async (location) => {
  const data = await loadJson(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=59499ea3663b2b05c9a5b852ee18a988`
  );
  if (data) {
    const processedData = processData(data);
    displayData(processedData);
    hideLoader();
  } else {
    return;
  }
};

// Destructred for easier data handling
const processData = ({
  main: { feels_like, grnd_level, humidity, pressure, sea_level, temp, temp_max, temp_min },
  name,
  sys: { country },
  timezone,
  dt,
}) => {
  return {
    name,
    country,
    temp,
    temp_max,
    temp_min,
    humidity,
    pressure,
    timezone,
    date: dt,
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
  const date = document.querySelector('.date');
  // const pressure = document.querySelector('.pressure > span');

  location.textContent = `${data.name}, ${data.country}`;
  temp.textContent = `${convertUnit(data.temp)}`;
  date.textContent = `${getTime(data.timezone)}`;
  feels.textContent = `${convertUnit(data.feel)}`;
  humidity.textContent = `${data.humidity} %`;
};

function convertUnit(temperature) {
  let number = temperature;
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
  showLoader();
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(successfulLookup, faliureCallback);
  }
})();

// function toggleLoader() {
//   if (loadingOverlay.classList.contains('active')) {
//     loadingOverlay.classList.remove(`active`);
//   } else {
//     loadingOverlay.classList.add('active');
//   }
// }
function showLoader() {
  loadingOverlay.classList.add('active');
}
function hideLoader() {
  loadingOverlay.classList.remove('active');
}

const twoDigits = (val) => {
  return ('0' + val).slice(-2);
};

const getTime = (timezone) => {
  const d = new Date();
  const localTime = d.getTime();
  const localOffset = d.getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const curTime = utc + timezone * 1000;
  const time = new Date(curTime).toUTCString();
  return time;
};
form.addEventListener('submit', getLocation);
