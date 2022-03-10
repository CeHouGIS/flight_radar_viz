var trail_json = {};
d3.json("data/flights_detail.json", function(flight_detail){

    trail_json.type = 'FeatureCollection';
    trail_json.features = [];
    
    for (var i=0; i < flight_detail.length; i++){
        if (flight_detail[i].airport.origin == null || flight_detail[i].airport.destination == null) {
            var origin = 'unknown';
            var destination = 'unknown';
            continue;
        } else {
            var origin = flight_detail[i].airport.origin.position.country.name;
            var destination = flight_detail[i].airport.destination.position.country.name;
        }
        var trail_coords = [];
        var timerange= [];
        for (var j=0; j<flight_detail[i].trail.length; j++){
            trail_coords.push([flight_detail[i].trail[j].lng,flight_detail[i].trail[j].lat])
            var date = new Date(flight_detail[i].trail[j].ts*1000); // convert to ms
            // console.log(date);
            // console.log(date.getTime());
            timerange.push(date)

            var new_feature = {
            "type": "Feature",
            "geometry":{
                "type":"point",
                "coordinates":[flight_detail[i].trail[j].lng,flight_detail[i].trail[j].lat]
            },
            "properties": {
                "flight_id": flight_detail[i].identification.callsign,
                "origin": origin,
                "destination":destination,
                "status":flight_detail[i].status.generic.status.type,
                "time":date
            },
            
        }
        trail_json.features.push(new_feature);
        // var new_feature = {
        //     "type": "Feature",
        //     "geometry":{
        //         "type":"LineString",
        //         "coordinates":trail_coords
        //     },
        //     "properties": {
        //         "flight_id": flight_detail[i].identification.callsign,
        //         "origin": origin,
        //         "destination":destination,
        //         "status":flight_detail[i].status.generic.status.type,
        //         "time":timerange
        //     },
        }
        // trail_json.features.push(new_feature);
    }

    console.log(trail_json)
    var button = document.getElementById("export");
    button.addEventListener("click", saveHandler, false);
    function saveHandler(){
        let data = trail_json;
        var content = JSON.stringify(data);
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "trails.json");
        }

});