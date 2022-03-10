map.on('load', () => {
    d3.json("data/flights_detail.json", function(flight_detail){
      console.log('flight_detail');
      console.log(flight_detail);

      var flight_detail_json = [];
      // flight_detail_json.type = 'FeatureCollection';
      // flight_detail_json.features = [];

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
              "from":{
                  "origin": origin,
                  "coordinates":origin_coord
              },
              "to": {
                "destination":destination,
                "coordinates":destination_coord,
              },
              "properties": {
                  "flight_id": flight_detail[i].identification.callsign,
                  "status":flight_detail[i].status.generic.status.type
              }
          }
          flight_detail_json.push(new_feature);
      }
    
    const AirportArcLayer = new deck.MapboxLayer({
        id: 'arcs',
        type: deck.ArcLayer,
        data: flight_detail_json,
        // dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
        // Styles
        getSourcePosition: f => f.from.coordinates, // London
        getTargetPosition: f => f.to.coordinates,
        getSourceColor: [0, 128, 200],
        getTargetColor: [200, 0, 80],
        getWidth: 1,
        opacity: 0.5,
        visible: true
    });
    
    map.addLayer(AirportArcLayer);

    document.getElementById("layer_flight").addEventListener("click", function(){
    if (trigger_flight == 0){
        AirportArcLayer.setProps({visible:true})
        document.getElementById("layer_flight").innerHTML = '&#9745; flights';
        trigger_flight = 1;
    } else {
        AirportArcLayer.setProps({visible:false});
        document.getElementById("layer_flight").innerHTML = '&#9744; flights';
        trigger_flight = 0;
    }    
    });


    });
  })