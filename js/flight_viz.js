map.on('load', () => {
    d3.json("data/flights_detail.json", function(flight_detail){
    //   console.log('flight_detail');
    //   console.log(flight_detail);

      var flight_detail_json = [];


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

    function select_country (name) {
        const selected = [];
        for (line of flight_detail_json) {
            if (line.from.origin == name) {
                selected.push(line)
            }
        }
        return selected
    }
    
    // a = select_country("China")
    // console.log('select country', a)

    const AirportArcLayer = new deck.MapboxLayer({
        id: 'arcs',
        type: deck.ArcLayer,
        data: flight_detail_json,
        dataTransform: false,
        // Styles
        getSourcePosition: f => f.from.coordinates, 
        getTargetPosition: f => f.to.coordinates,
        getSourceColor: [0, 128, 200],
        getTargetColor: [200, 0, 80],
        getWidth: 1,
        opacity: 0.5,
        visible: true,
    });
    
    map.addLayer(AirportArcLayer);

    const popup_show_info = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    
    map.on('click', function(e) {       // This is the main event listner which is triggered when the mouse moves
        var map_country = map.queryRenderedFeatures(e.point, {   // This queries whether the mouse is over an object in the LocalAuthorities layer
            layers: ['worldmap_show']
        });


        if (map_country.length == []) {   // This if statement is run when the mouse is over a local authority
            console.log('No features');
            // AirportArcLayer.setProps({dataTransform:false});
            AirportArcLayer.setProps({data:flight_detail_json});
            document.getElementById('select-status').textContent = 'all'
            document.getElementById('num-flights').textContent = flight_detail_json.length


            map.setFilter('trail-viz', ['!=','origin','no']);
        } else {
            map.setFilter('worldmap_hover', ['==','SOVEREIGNT',map_country[0].properties.SOVEREIGNT]);
              // Filter the highlight layer to show the local authority outline
            console.log(map_country[0].properties.SOVEREIGNT);

            if (map_country[0].properties.SOVEREIGNT == 'United States of America') {
                map.setFilter('trail-viz', ['==','origin','United States']);
                selected_country = 'United States'

                AirportArcLayer.setProps({data:select_country('United States')});   

                document.getElementById('select-status').textContent = 'United States'
                document.getElementById('num-flights').textContent = select_country('United States').length            

            } else {
                map.setFilter('trail-viz', ['==','origin',map_country[0].properties.SOVEREIGNT]);

                AirportArcLayer.setProps({data:select_country(map_country[0].properties.SOVEREIGNT)});  

                document.getElementById('select-status').textContent = map_country[0].properties.SOVEREIGNT
                document.getElementById('num-flights').textContent = select_country(map_country[0].properties.SOVEREIGNT).length    
            }
        }
    });

    document.getElementById("layer_flight").addEventListener("click", function(){
    if (trigger_flight == 0){
        AirportArcLayer.setProps({visible:true})
        document.getElementById("layer_flight").innerHTML = '&#9745; flights';
        map.setPaintProperty('trail-viz','line-opacity',0.2);
        trigger_flight = 1;
    } else {
        AirportArcLayer.setProps({visible:false});
        document.getElementById("layer_flight").innerHTML = '&#9744; flights';
        map.setPaintProperty('trail-viz','line-opacity',0);
        trigger_flight = 0;
    }    
    });

    });
  })