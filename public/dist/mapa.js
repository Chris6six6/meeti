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

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("(function() {\r\n  // Cache DOM elements\r\n  const latInput = document.querySelector('#lat');\r\n  const lngInput = document.querySelector('#lng');\r\n  const direccionInput = document.querySelector('#direccion');\r\n  const ciudadInput = document.querySelector('#ciudad');\r\n  const estadoInput = document.querySelector('#estado');\r\n  const paisInput = document.querySelector('#pais');\r\n  const formBuscador = document.querySelector('#formbuscador');\r\n\r\n  // Obtener los valores iniciales de los campos latitud, longitud y dirección.\r\n  const lat = parseFloat(latInput.value) || 20.67444163271174;\r\n  const lng = parseFloat(lngInput.value) || -103.38739216304566;\r\n  const direccion = direccionInput.value || '';\r\n\r\n  // Crear el mapa centrado en la latitud y longitud obtenidas con un nivel de zoom de 16.\r\n  const mapa = L.map('mapa').setView([lat, lng], 16);\r\n\r\n  // Servicio de geocodificación de ESRI para realizar geocodificación inversa (obtener dirección a partir de coordenadas).\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n  // Declarar la variable marker en el ámbito correcto\r\n  let marker;\r\n\r\n  // Función que llena los campos del formulario con la información obtenida del servicio de geocodificación.\r\n  function llenarInputs(result) {\r\n    if (!result || !result.address) {\r\n      console.error('Resultado de geocodificación inválido:', result);\r\n      return;\r\n    }\r\n\r\n    const { address, latlng } = result;\r\n    direccionInput.value = address.Address || '';\r\n    ciudadInput.value = address.City || '';\r\n    estadoInput.value = address.Region || '';\r\n    paisInput.value = address.CountryCode || '';\r\n    latInput.value = latlng ? latlng.lat : '';\r\n    lngInput.value = latlng ? latlng.lng : '';\r\n  }\r\n\r\n  // Función para actualizar el marcador y realizar geocodificación inversa\r\n  function actualizarMarcador(latlng) {\r\n    mapa.panTo(latlng);\r\n\r\n    if (!marker) {\r\n      marker = L.marker(latlng, { draggable: true, autoPan: true }).addTo(mapa);\r\n      marker.on('moveend', (e) => actualizarMarcador(e.target.getLatLng()));\r\n    } else {\r\n      marker.setLatLng(latlng);\r\n    }\r\n\r\n    geocodeService.reverse().latlng(latlng, 15).run((error, result) => {\r\n      if (error) {\r\n        console.error('Error en geocodificación inversa:', error);\r\n        return;\r\n      }\r\n      if (result && result.address) {\r\n        llenarInputs(result);\r\n        marker.bindPopup(result.address.LongLabel || 'Dirección no disponible').openPopup();\r\n      } else {\r\n        console.error('Resultado de geocodificación inversa inválido:', result);\r\n      }\r\n    });\r\n  }\r\n\r\n  // Inicializar el marcador con las coordenadas iniciales\r\n  actualizarMarcador([lat, lng]);\r\n\r\n  // Evento que se dispara cuando el usuario hace clic en el mapa\r\n  mapa.on('click', (e) => actualizarMarcador(e.latlng));\r\n\r\n  // Agregar capa de mosaico de OpenStreetMap al mapa.\r\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n  }).addTo(mapa);\r\n\r\n  // Función para buscar dirección y colocar un nuevo marcador\r\n  const buscarDireccion = debounce((query) => {\r\n    if (query.length <= 8) return;\r\n\r\n    L.esri.Geocoding.geocode().text(query).run((error, results) => {\r\n      if (error) {\r\n        console.error('Error en la búsqueda de dirección:', error);\r\n        return;\r\n      }\r\n\r\n      if (results.results.length > 0) {\r\n        actualizarMarcador(results.results[0].latlng);\r\n      }\r\n    });\r\n  }, 500);\r\n\r\n  // Event Listeners para el input del buscador\r\n  formBuscador.addEventListener('input', (e) => {\r\n    const query = e.target.value.trim();\r\n    if (query.length > 8) {\r\n      buscarDireccion(query);\r\n    }\r\n  });\r\n\r\n  // Función de debounce para optimizar las llamadas a la API\r\n  function debounce(func, delay) {\r\n    let timeoutId;\r\n    return function (...args) {\r\n      clearTimeout(timeoutId);\r\n      timeoutId = setTimeout(() => func.apply(this, args), delay);\r\n    };\r\n  }\r\n})();\n\n//# sourceURL=webpack://meti/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;