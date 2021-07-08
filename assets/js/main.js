let markersAll = []; //
let infoWindow = null;

// Initialize and add the map
function initMap() {
  // The location of Uluru
  const maimo = { lat: -34.610490, lng: -58.440860 }; //esto es maimo!
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: maimo,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControlOptions: {
      mapTypeIds: []
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    styles: [
      { elementType: "geometry", stylers: [{ color: "#57372B" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#499154" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#499154" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#5C4942" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#5C4942" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#D1BE70" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#55818F" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
  // The marker, positioned at Uluru
  // const marker = new google.maps.Marker({
  //   position: maimo,
  //   map: map,
  // });

  //Aca voy a hacer el fetch de markers
  fetchMarkers(map);

  const filter = document.querySelectorAll('.handleFilter');
  const filterReset = document.querySelector('.handleFilterReset')
  filterReset.addEventListener('click', () => {
    markersAll.forEach((marker) => {
      marker.setMap(null)
    })
    markersAll.forEach((marker) => {
      marker.setMap(map)
    })
  })
  filter.forEach((filter) => {
    filter.addEventListener('click', (e) => {
      let filterQuery = filter.innerHTML;
      if (filterQuery == "Museos deportivos") {
        filterQuery = "museosdeportivos"
      } else if (filterQuery == "Museos históricos y etnográficos") {
        filterQuery = "museoshistóricosyetnográficos"
      } else if (filterQuery == "Museos de arte") {
        filterQuery = "museosdearte"
      } else if (filterQuery == "Otros museos") {
        filterQuery = "otrosmuseos"
      } else if (filterQuery == "Museos de las fuerzas armadas") {
        filterQuery = "museosdelasfuerzasarmadas"
      } else if (filterQuery == "Centros culturales") {
        filterQuery = "centrosculturales"
      } else if (filterQuery == "Museos de ciencia") {
        filterQuery = "museosdeciencia"
      }
      console.log(filterQuery)
      addMarkersFiltered(filterQuery, map);
    })
  })

}


const addMarkersFiltered = (filterQuery, map) => {
  markersAll.forEach((marker) => {
    marker.setMap(null);
  });

  const markersFiltered = markersAll.filter((marker) => marker.customInfo === filterQuery);

  markersFiltered.forEach((marker) => {
    marker.setMap(map);
  })
}

const fetchMarkers = async map => {
  try {
    const response = await fetch('https://tp-2-backend-taupe.vercel.app/markers');
    const json = await response.json();
    console.log(json)
    json.forEach(marker => addMarker(map, marker));
  } catch (error) {

  }
}

const addMarker = (map, marker) => {
  const { nombre, descripcion, lat, lng, type } = marker
  let categ;
  if (type == "museosdeportivos") {
    categ = "Museos deportivos"
  } else if (type == "museoshistóricosyetnográficos") {
    categ = "Museos históricos y etnográficos"
  } else if (type == "museosdearte") {
    categ = "Museos de arte"
  } else if (type == "otrosmuseos") {
    categ = "Otros museos"
  } else if (type == "museosdelasfuerzasarmadas") {
    categ = "Museos de las fuerzas armadas"
  } else if (type == "centrosculturales") {
    categ = "Centros culturales"
  } else if (type == "museosdeciencia") {
    categ = "Museos de ciencia"
  }

  //MARKER
  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "yellow",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(7.5, 15),
  };
  const markerItem = new google.maps.Marker(
    {
      position: { lat: parseFloat(lat), lng: parseFloat(lng) },
      map: map,
      icon: svgMarker,
      customInfo: type
    }
  );
  markerItem.setMap(map);
  markersAll.push(markerItem); //lo agrego tambien al array de todos los markers
  //INFOWINDOW
  const contentString = `
  <div class="info_wrapper">
      <h2>${nombre}</h2>
      <h3>${categ}</h3>
      <p>${descripcion}</p>
  </div>
  `
  const infoWindow = new google.maps.InfoWindow({
    content: contentString
  })
  markerItem.addListener('click', () => {
    if (infoWindow) {
      infoWindow.close();
    }
    infoWindow.open(map, markerItem)
  })
}
