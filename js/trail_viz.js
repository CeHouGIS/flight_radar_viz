map.on('load',function(){
    d3.json("data/flights_detail.json", function(flight_detail){
        // console.log(flight_detail);

        var trail_json = {};
        trail_json.type = 'FeatureCollection';
        trail_json.features = [];
        var trail_coords = [];
        for (var i=0; i < flight_detail.length; i++){
            if ((flight_detail[i].airport.origin == null) || (flight_detail[i].airport.destination == null)) {
                var origin = 'unknown';
                var destination = 'unknown';
                continue;
            } else {
                var origin = flight_detail[i].airport.origin.position.country.name;
                var destination = flight_detail[i].airport.destination.position.country.name;
            }
            for (var j=0; j<flight_detail[i].trail.length; j++){
                trail_coords.push([flight_detail[i].trail[j].lng,flight_detail[i].trail[j].lat])

            }
            var new_feature = {
                "type": "flight",
                "geometry":{
                    "type":"LineString",
                    "coordinates":trail_coords
                },
                "properties": {
                    "flight_id": flight_detail[i].identification.callsign,
                    "origin": origin,
                    "destination":destination,
                    "status":flight_detail[i].status.generic.status.type,
                }
            }
            trail_json.features.push(new_feature);
        }
        console.log('trail');
        console.log(trail_json)

        map.addSource('trails', {
            type: "geojson",
            data: trail_json,
            lineMetrics: true,
            generateId: true // This ensures that all features have unique IDs
        });

        // add point layer
        map.addLayer({
            id: 'trails-viz',
            type: 'line',
            source: 'trails',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#fff', //blue
                'line-width': 1,
                'line-opacity':0,
                'line-gradient': [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                    0,
                    '#33C9EB',
                    0.4,
                    'white',
                    0.7,
                    'red'
                    ],
                'line-opacity-transition': {  //Opacity transition adds a delay when changing the opacity for a smooth layer change effect
                    duration: 1000,
                    delay: 0
                } 
            }                        
        });

    });
})