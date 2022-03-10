
const AIR_PORTS =
'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';
map.on('load', () => {
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
                "origin":{
                    "type":"point",
                    "coordinates":origin_coord
                },
                "destination":{
                    "type":"point",
                    "coordinates":destination_coord
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
        const AirportArcLayer = new deck.MapboxLayer({
            id: 'arcs',
            type: deck.ArcLayer,
            data: flight_detail_json,
            // dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
            // Styles
            getSourcePosition: d => d.origin.coordinates,
            getTargetPosition: d => d.destination.coordinates,
            getSourceColor: [0, 128, 200],
            getTargetColor: [200, 0, 80],
            getWidth: 1
        });
        // map.addLayer(AirportPointLayer);
        map.addLayer(AirportArcLayer);
    });
});