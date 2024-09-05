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

eval("(function () {\n  // Obtener los valores iniciales de los campos latitud, longitud y dirección.\n  var lat = document.querySelector('#lat').value || 20.67444163271174;\n  var lng = document.querySelector('#lng').value || -103.38739216304566;\n  var direccion = document.querySelector('#direccion').value || '';\n\n  // Crear el mapa centrado en la latitud y longitud obtenidas con un nivel de zoom de 16.\n  var mapa = L.map('mapa').setView([lat, lng], 16);\n\n  // Servicio de geocodificación de ESRI para realizar geocodificación inversa (obtener dirección a partir de coordenadas).\n  var geocodeService = L.esri.Geocoding.geocodeService();\n\n  // Crear un marcador (pin) en el mapa con las coordenadas iniciales. El marcador es arrastrable y se desplaza automáticamente.\n  var marker = L.marker([lat, lng], {\n    draggable: true,\n    autoPan: true\n  }).addTo(mapa) // Agregar el marcador al mapa.\n  .bindPopup(direccion) // Vincular la dirección al popup del marcador.\n  .openPopup(); // Abrir el popup inicialmente.\n\n  // Evento que se dispara cuando el marcador se deja de arrastrar (moveend).\n  marker.on('moveend', function (_ref) {\n    var target = _ref.target;\n    var posicion = target.getLatLng(); // Obtener la nueva posición del marcador.\n    mapa.panTo(posicion); // Centrar el mapa en la nueva posición del marcador.\n\n    // Geocodificación inversa para obtener la dirección de las nuevas coordenadas.\n    geocodeService.reverse().latlng(posicion, 15).run(function (error, result) {\n      llenarInputs(result); // Llenar los campos del formulario con los datos obtenidos.\n      marker.bindPopup(result.address.LongLabel); // Actualizar el popup del marcador con la nueva dirección.\n    });\n  });\n\n  // Agregar capa de mosaico de OpenStreetMap al mapa.\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n  }).addTo(mapa);\n\n  // Función que llena los campos del formulario con la información obtenida del servicio de geocodificación.\n  function llenarInputs(result) {\n    var _result$address = result.address,\n      Address = _result$address.Address,\n      City = _result$address.City,\n      Region = _result$address.Region,\n      CountryCode = _result$address.CountryCode;\n    var _result$latlng = result.latlng,\n      lat = _result$latlng.lat,\n      lng = _result$latlng.lng;\n    document.querySelector('#direccion').value = Address || ''; // Rellenar el campo de dirección.\n    document.querySelector('#ciudad').value = City || ''; // Rellenar el campo de ciudad.\n    document.querySelector('#estado').value = Region || ''; // Rellenar el campo de estado/región.\n    document.querySelector('#pais').value = CountryCode || ''; // Rellenar el campo de país.\n    document.querySelector('#lat').value = lat || ''; // Rellenar el campo de latitud.\n    document.querySelector('#lng').value = lng || ''; // Rellenar el campo de longitud.\n  }\n})();\n\n//# sourceURL=webpack://meti/./public/js/app.js?");

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