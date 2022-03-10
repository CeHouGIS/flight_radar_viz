map.on('load',function(){
    // load json data
    var my_geojson = {};
    my_geojson.type = 'FeatureCollection';
    my_geojson.features = [];

    d3.json("data/airports_info.json", function(airport_data) {
        // console.log(airport_data[0]);

        for (var i=0; i < airport_data.length ; i++){
            var new_feature = {
                "type": "airports",
                "geometry": {
                    "type": "Point",
                    "coordinates": [airport_data[i].lon, airport_data[i].lat]
                    },
                "properties": {
                    "name": airport_data[i].name,
                    "country": airport_data[i].country
                    }
            }
            my_geojson.features.push(new_feature);
        };

        map.addSource('airports', {
            type: 'geojson',
            data: my_geojson,
            generateId: true // This ensures that all features have unique IDs
        });
        
        // add point layer
        map.addLayer({
            id: 'airports-viz',
            type: 'circle',
            source: 'airports',
            paint: {
                'circle-radius':3,
                'circle-color': '#fff',
                'circle-opacity': 0.95,
                'circle-opacity-transition': {  //Opacity transition adds a delay when changing the opacity for a smooth layer change effect
                    duration: 1000,
                    delay: 0
                }                        
            },

        });

        // add heatmap layer
        map.addLayer({
            id: 'airports-heat',
            type: 'heatmap',
            source: 'airports',
            maxzoom: 15,
            paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
                property: 'dbh',
                type: 'exponential',
                stops: [[1, 0],[300, 1]]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
                stops: [
                [11, 1],
                [15, 3]
                ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color':[
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,'rgba(0,0,255,0)',
                0.1,'royalblue',
                0.3,'cyan',
                0.5,'lime',
                0.7,'yellow',
                1,'red'
            ],
            // increase radius as zoom increases
            'heatmap-radius':{
                stops: [
                [4, 20],
                [15, 5]
                ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': 0,
            // 'heatmap-opacity': 0.95,
            'heatmap-opacity-transition': {  //Opacity transition adds a delay when changing the opacity for a smooth layer change effect
                duration: 1000,
                delay: 0
            }
            }
        },
        'waterway-label'
        );
    });
    
    console.log(my_geojson);

})