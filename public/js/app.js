(function() {
  // Obtener los valores iniciales de los campos latitud, longitud y dirección.
  const lat = document.querySelector('#lat').value || 20.67444163271174;
  const lng = document.querySelector('#lng').value || -103.38739216304566;
  const direccion = document.querySelector('#direccion').value || '';
  
  // Crear el mapa centrado en la latitud y longitud obtenidas con un nivel de zoom de 16.
  const mapa = L.map('mapa').setView([lat, lng], 16);
  
  // Servicio de geocodificación de ESRI para realizar geocodificación inversa (obtener dirección a partir de coordenadas).
  const geocodeService = L.esri.Geocoding.geocodeService();

  // Crear un marcador (pin) en el mapa con las coordenadas iniciales. El marcador es arrastrable y se desplaza automáticamente.
  let marker = L.marker([lat, lng], { draggable: true, autoPan: true })
    .addTo(mapa)  // Agregar el marcador al mapa.
    .bindPopup(direccion)  // Vincular la dirección al popup del marcador.
    .openPopup();  // Abrir el popup inicialmente.

  // Evento que se dispara cuando el marcador se deja de arrastrar (moveend).
  marker.on('moveend', ({ target }) => {
    const posicion = target.getLatLng();  // Obtener la nueva posición del marcador.
    mapa.panTo(posicion);  // Centrar el mapa en la nueva posición del marcador.

    // Geocodificación inversa para obtener la dirección de las nuevas coordenadas.
    geocodeService.reverse().latlng(posicion, 15).run((error, result) => {
      llenarInputs(result);  // Llenar los campos del formulario con los datos obtenidos.
      marker.bindPopup(result.address.LongLabel);  // Actualizar el popup del marcador con la nueva dirección.
    });
  });

  // Agregar capa de mosaico de OpenStreetMap al mapa.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  // Función que llena los campos del formulario con la información obtenida del servicio de geocodificación.
  function llenarInputs(result) {
    const { Address, City, Region, CountryCode } = result.address;
    const { lat, lng } = result.latlng;
    document.querySelector('#direccion').value = Address || '';  // Rellenar el campo de dirección.
    document.querySelector('#ciudad').value = City || '';  // Rellenar el campo de ciudad.
    document.querySelector('#estado').value = Region || '';  // Rellenar el campo de estado/región.
    document.querySelector('#pais').value = CountryCode || '';  // Rellenar el campo de país.
    document.querySelector('#lat').value = lat || '';  // Rellenar el campo de latitud.
    document.querySelector('#lng').value = lng || '';  // Rellenar el campo de longitud.
  }
})();
