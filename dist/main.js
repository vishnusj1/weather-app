/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const form = document.querySelector('#form');\nconst loadingOverlay = document.querySelector('.loading-overlay');\n\n// Object for global Http Error handling.\n\nclass HttpError extends Error {\n  constructor(response) {\n    super(`${response.status} for ${response.url}`);\n    this.name = 'HttpError';\n    this.response = response;\n  }\n}\n\nconst loadJson = async (url) => {\n  const response = await fetch(url, { mode: 'cors' });\n  if (response.status == 200) {\n    return response.json();\n  } else if (response.status == 404) {\n    hideLoader();\n    alert(`No results found.`);\n    return;\n  } else {\n    throw new HttpError(response);\n  }\n};\n\nconst getLocation = async (e) => {\n  e.preventDefault();\n  const input = document.querySelector('#search-bar');\n  const location = input.value;\n  showLoader();\n  getWeatherData(location);\n  input.value = '';\n};\n\nconst getWeatherData = async (location) => {\n  const data = await loadJson(\n    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=59499ea3663b2b05c9a5b852ee18a988`\n  );\n  if (data) {\n    const processedData = processData(data);\n    displayData(processedData);\n    hideLoader();\n  } else {\n    return;\n  }\n};\n\n// Destructred for easier data handling\nconst processData = ({\n  main: { feels_like, grnd_level, humidity, pressure, sea_level, temp, temp_max, temp_min },\n  name,\n  sys: { country },\n  timezone,\n  dt,\n}) => {\n  return {\n    name,\n    country,\n    temp,\n    temp_max,\n    temp_min,\n    humidity,\n    pressure,\n    timezone,\n    date: dt,\n    feel: feels_like,\n    ground: grnd_level,\n    sea: sea_level,\n  };\n};\n\nconst displayData = (data) => {\n  const location = document.querySelector('.region > .location');\n  const temp = document.querySelector('.temp > .number');\n  const feels = document.querySelector('.feels-like > span');\n  const humidity = document.querySelector('.humidity > span');\n  const date = document.querySelector('.date');\n  // const pressure = document.querySelector('.pressure > span');\n\n  location.textContent = `${data.name}, ${data.country}`;\n  temp.textContent = `${convertUnit(data.temp)}`;\n  date.textContent = `${getTime(data.timezone)}`;\n  feels.textContent = `${convertUnit(data.feel)}`;\n  humidity.textContent = `${data.humidity} %`;\n};\n\nfunction convertUnit(temperature) {\n  let number = temperature;\n  let celcius = Math.round(number - 273.15);\n  return celcius;\n}\n\nconst successfulLookup = async (position) => {\n  const { latitude, longitude } = position.coords;\n  const data = await loadJson(\n    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=70d3b04467864dcf917523e42e7029d4`\n  );\n  const location = data.results[0].components.state_district;\n  getWeatherData(location);\n};\n\nconst faliureCallback = async () => {\n  getWeatherData(`Mumbai`);\n};\n\nconst getUserLocation = (() => {\n  showLoader();\n  if (window.navigator.geolocation) {\n    window.navigator.geolocation.getCurrentPosition(successfulLookup, faliureCallback);\n  }\n})();\n\n// function toggleLoader() {\n//   if (loadingOverlay.classList.contains('active')) {\n//     loadingOverlay.classList.remove(`active`);\n//   } else {\n//     loadingOverlay.classList.add('active');\n//   }\n// }\nfunction showLoader() {\n  loadingOverlay.classList.add('active');\n}\nfunction hideLoader() {\n  loadingOverlay.classList.remove('active');\n}\n\nconst twoDigits = (val) => {\n  return ('0' + val).slice(-2);\n};\n\nconst getTime = (timezone) => {\n  const d = new Date();\n  const localTime = d.getTime();\n  const localOffset = d.getTimezoneOffset() * 60000;\n  const utc = localTime + localOffset;\n  const curTime = utc + timezone * 1000;\n  const time = new Date(curTime).toUTCString();\n  return time;\n};\nform.addEventListener('submit', getLocation);\n\n\n//# sourceURL=webpack://weather-app/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;