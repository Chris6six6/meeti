(function() {
  // Cache DOM elements
  const latInput = document.querySelector('#lat');
  const lngInput = document.querySelector('#lng');
  const direccionInput = document.querySelector('#direccion');
  const ciudadInput = document.querySelector('#ciudad');
  const estadoInput = document.querySelector('#estado');
  const paisInput = document.querySelector('#pais');
  const formBuscador = document.querySelector('#formbuscador');

  // Obtener los valores iniciales de los campos latitud, longitud y dirección.
  const lat = parseFloat(latInput.value) || 20.67444163271174;
  const lng = parseFloat(lngInput.value) || -103.38739216304566;
  const direccion = direccionInput.value || '';

  // Crear el mapa centrado en la latitud y longitud obtenidas con un nivel de zoom de 16.
  const mapa = L.map('mapa').setView([lat, lng], 16);

  // Servicio de geocodificación de ESRI para realizar geocodificación inversa (obtener dirección a partir de coordenadas).
  const geocodeService = L.esri.Geocoding.geocodeService();

  // Declarar la variable marker en el ámbito correcto
  let marker;

  // Función que llena los campos del formulario con la información obtenida del servicio de geocodificación.
  function llenarInputs(result) {
    if (!result || !result.address) {
      console.error('Resultado de geocodificación inválido:', result);
      return;
    }

    const { address, latlng } = result;
    direccionInput.value = address.Address || '';
    ciudadInput.value = address.City || '';
    estadoInput.value = address.Region || '';
    paisInput.value = address.CountryCode || '';
    latInput.value = latlng ? latlng.lat : '';
    lngInput.value = latlng ? latlng.lng : '';
  }

  // Función para actualizar el marcador y realizar geocodificación inversa
  function actualizarMarcador(latlng) {
    mapa.panTo(latlng);

    if (!marker) {
      marker = L.marker(latlng, { draggable: true, autoPan: true }).addTo(mapa);
      marker.on('moveend', (e) => actualizarMarcador(e.target.getLatLng()));
    } else {
      marker.setLatLng(latlng);
    }

    geocodeService.reverse().latlng(latlng, 15).run((error, result) => {
      if (error) {
        console.error('Error en geocodificación inversa:', error);
        return;
      }
      if (result && result.address) {
        llenarInputs(result);
        marker.bindPopup(result.address.LongLabel || 'Dirección no disponible').openPopup();
      } else {
        console.error('Resultado de geocodificación inversa inválido:', result);
      }
    });
  }

  // Inicializar el marcador con las coordenadas iniciales
  actualizarMarcador([lat, lng]);

  // Evento que se dispara cuando el usuario hace clic en el mapa
  mapa.on('click', (e) => actualizarMarcador(e.latlng));

  // Agregar capa de mosaico de OpenStreetMap al mapa.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  // Función para buscar dirección y colocar un nuevo marcador
  const buscarDireccion = debounce((query) => {
    if (query.length <= 8) return;

    L.esri.Geocoding.geocode().text(query).run((error, results) => {
      if (error) {
        console.error('Error en la búsqueda de dirección:', error);
        return;
      }

      if (results.results.length > 0) {
        actualizarMarcador(results.results[0].latlng);
      }
    });
  }, 500);

  // Event Listeners para el input del buscador
  formBuscador.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 8) {
      buscarDireccion(query);
    }
  });

  // Función de debounce para optimizar las llamadas a la API
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
})();