var mapboxgl = require('mapbox-gl');

//Personal access token for mapbox
mapboxgl.accessToken =
    "pk.eyJ1IjoicmVuc2IiLCJhIjoiY2o3bm52anZoMnlxNTJycXBuNmF5eXBjeSJ9.w24bQq3Zm3deNY68pPPBwg";

//Create new map object
var map = new mapboxgl.Map({
    container: "container",
    style: "mapbox://styles/mapbox/light-v10",
    zoom: 12,
    center: [5.478914, 51.4438373]

});

//Stores currently loaded markers
var markers = [];

//TODO: remove hardcoded path and load paths from server
const viernulzeven = [
[5.478914, 51.4438373],
[5.4789998, 51.4436082],
[5.4792841, 51.4436701],
[5.479091, 51.4442218],
[5.4770445, 51.443874],
[5.4767361, 51.4446531],
[5.4767951, 51.4459938],
[5.4770258, 51.4463381],
[5.4778652, 51.4510687],
[5.4779377, 51.4515636],
[5.4779765, 51.4519714],
[5.4779672, 51.452396],
[5.477884, 51.4528974],
[5.4776883, 51.4542546],
[5.4771277, 51.4571761],
[5.4753198, 51.4659327],
[5.4749577, 51.4661834],
[5.4745473, 51.4671693],
[5.4705589, 51.4671192],
[5.4697515, 51.467323],
[5.4689683, 51.4673431],
[5.4682951, 51.4674801],
[5.467819, 51.4676422],
[5.4675468, 51.4677808],
[5.4625585, 51.472641],
[5.4578431, 51.4772561],
[5.4562225, 51.4789544],
[5.4489829, 51.4763886],
[5.4423824, 51.4739427],
[5.4385816, 51.4725276],
[5.4378346, 51.472221],
[5.4370394, 51.4718142],
[5.4309024, 51.4680281],
[5.4301407, 51.4676004],
[5.4292743, 51.4672545],
[5.428463, 51.4670531],
[5.4276624, 51.4669186],
[5.4256373, 51.466683],
[5.4248715, 51.4665351],
[5.4240843, 51.4663204],
[5.4232367, 51.4660096],
[5.4211016, 51.4650304],
[5.4181083, 51.4639743],
[5.4072833, 51.4672747],
[5.4064034, 51.467608],
[5.4040965, 51.4681283],
[5.4017306, 51.4647813],
[5.3999577, 51.4621753],
[5.3997526, 51.4619051],
[5.3994724, 51.4616348],
[5.3973802, 51.460445],
[5.3967418, 51.4601291],
[5.3950198, 51.4596194],
[5.3936251, 51.4592158],
[5.3934212, 51.4591197],
[5.3928097, 51.4585891],
[5.3927775, 51.4584876],
[5.3929009, 51.4580785],
[5.3929767, 51.4576958],
[5.3931767, 51.4571071],
[5.3931782, 51.4570533],
[5.3929222, 51.4570144],
[5.3926823, 51.4569154],
[5.3926025, 51.4566998],
[5.3927373, 51.4565745],
[5.3928016, 51.4565845]]

//Map loaded
map.on("load", function () {

});

//Add line and markers to map
function AddLine(){
    AddBusLine(viernulzeven, '#5b85aa', 8)
    AddStopMarkers(viernulzeven, "custom-marker")
}

//Remove line and markers from map
function RemoveLine(){
    map.removeLayer("route");
    map.removeSource("route");
    markers.forEach(marker => {
        marker.remove();
    })

    markers = [];
}

//Move to the location of the clicked marker
function MarkerClicked(point) {
    map.flyTo({center: point, zoom: 15})
}

//Create a marker for every position in points
function AddStopMarkers(points) {
    points.forEach(point => {
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.cursor = 'pointer';
        el.addEventListener("click", function(){MarkerClicked(point)}); 

        var mark = new mapboxgl.Marker(el, {
            offset: [0, -19]
        })
            .setLngLat(point)
            .addTo(map);

        markers.push(mark);
    });
}

//Add line to map following the positions in points
function AddBusLine(points, color, width) {
    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": points
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": color,
            "line-width": width
        }
    });

    //Get the bounds of the line
    var bounds = points.reduce(function(bounds,coord){
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(points[0], points[0]));

    //Move the camera so the line fits on screen
    map.fitBounds(bounds , {padding: 80})
}