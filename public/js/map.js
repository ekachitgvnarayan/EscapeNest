
mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 10, // initial zoom level, 0 is the world view, higher values zoom in
        center: coordinates.coordinates // center the map on this longitude and latitude
        
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    
    const marker1 = new mapboxgl.Marker({ color: '#fe2001'})
        .setLngLat(coordinates.coordinates)
        .addTo(map);
// console.log(coordinates.coordinates)