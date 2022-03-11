map.on('load',function(){
    d3.json("data/flights_detail.json", function(flight_detail){
        console.log('flight_detail');
        console.log(flight_detail);

        var flight_detail_json = {};
        flight_detail_json.type = 'FeatureCollection';
        flight_detail_json.features = [];

        for (var i=0; i < flight_detail.length; i++){
            if ((flight_detail[i].airport.origin == null) || (flight_detail[i].airport.destination == null)) {
                // var origin = 'unknown';
                // var destination = 'unknown';
                // var origin_coord = 'unknown';
                // var destination_coord = 'unknown';
                continue;
            } else {
                var origin = flight_detail[i].airport.origin.position.country.name;
                var destination = flight_detail[i].airport.destination.position.country.name;

                var origin_coord = [flight_detail[i].airport.origin.position.longitude,
                    flight_detail[i].airport.origin.position.latitude];
                var destination_coord = [flight_detail[i].airport.destination.position.longitude,
                    flight_detail[i].airport.destination.position.latitude]
            }
            var new_feature = {
                "type": "flight",
                "geometry":{
                    "type":"LineString",
                    "coordinates":[origin_coord,destination_coord]
                },
                "properties": {
                    "flight_id": flight_detail[i].identification.callsign,
                    "origin": origin,
                    "destination":destination,
                    "status":flight_detail[i].status.generic.status.type
                }
            }
            flight_detail_json.features.push(new_feature);
        }
    
        // console.log("flight_detail",flight_detail_json)

        map.addSource('flights', {
            type: "geojson",
            data: flight_detail_json,
            generateId: true // This ensures that all features have unique IDs
        });

        // add point layer
        map.addLayer({
            id: 'trail-viz',
            type: 'line',
            source: 'flights',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#0066cc', //blue
                'line-width': 1,
                'line-opacity':0.2,
                'line-opacity-transition': {  //Opacity transition adds a delay when changing the opacity for a smooth layer change effect
                    duration: 1000,
                    delay: 0
                } 
            }                        
        });

    });
})