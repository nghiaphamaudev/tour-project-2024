const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibmdoaWFwaGFtMTkwMiIsImEiOiJjbHZycDFnOTcwcTdmMmxxdGFvOGR5djMyIn0.eS9XcPvLiCQryRV9o0GXTQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});
