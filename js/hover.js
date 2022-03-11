map.on('load', function() {

    map.addLayer({                  //Add the fill layer. It is not visible (opacity 0) and is used only as the basis of the hover selection
            id: 'worldmap_show',
            type: 'fill',
            source: {
              type: 'vector',
              url: 'mapbox://houce315.5brna1i8' // Your Mapbox tileset Map ID
            },
            'source-layer': 'world-bv865v', // name of tilesets
            'layout': {
                'visibility': 'visible'
            },
            paint: {
                'fill-color': '#fff',
                'fill-opacity': 0
                }
          });

    map.addLayer({                  // Add the line highlight layer. This layer has a filter, which initially is empty.
            id: 'worldmap_hover',
            type: 'line',
            source: {
              type: 'vector',
              url: 'mapbox://houce315.5brna1i8' // Your Mapbox tileset Map ID
            },
            'source-layer': 'world-bv865v', // name of tilesets
            'layout': {
                'visibility': 'visible'
            },
            paint: {
                'line-color': '#0066cc',
                'line-width': 2
                },
          });

    // map.on('mousemove', function(e) {       // This is the main event listner which is triggered when the mouse moves
    //     var map_country = map.queryRenderedFeatures(e.point, {   // This queries whether the mouse is over an object in the LocalAuthorities layer
    //         layers: ['worldmap_show']
    //     });

    //     if (map_country.length == []) {   // This if statement is run when the mouse is over a local authority
    //         // console.log('No features');

    //     } else {
    //         map.setFilter('worldmap_hover', ['==','SOVEREIGNT',map_country[0].properties.SOVEREIGNT]);  // Filter the highlight layer to show the local authority outline
    //         // console.log(map_country[0].properties.SOVEREIGNT);
    //         const target_country = map_country[0].properties.SOVEREIGNT;
    //         return target_country
    //     }
        
    // });

    // console.log(a.)

});