var count_origin = {};
var count_dest = {};

d3.json("/data/flights_detail.json", function(data) {
    console.log(data);
    for(var i=0; i<data.length; i++){
        if ((data[i].airport.origin == null) || (data[i].airport.destination == null)) {
            var origin = 'unknown';
            var destination = 'unknown';
            // continue;
        } else {
            var origin = data[i].airport.origin.position.country.name;
            var destination = data[i].airport.destination.position.country.name;
        }

        if(count_origin[origin]){
            count_origin[origin]++;
        } else {
            count_origin[origin] = 1;
        }

        if(count_dest[destination]){
            count_dest[destination]++;
        } else {
            count_dest[destination] = 1;
        }
    };

    var count_origin_csv = [];
    count_origin_csv.country = '';
    count_origin_csv.count = 0;
    for (x in count_origin) {
        // document.getElementById("chartshow").innerHTML += "<td>" + x + "</td>" + "<td>" + count_origin[x] + "</td>";
        count_origin_csv.push({'country':x,'count':count_origin[x],'category':'origin'});
    }
    for (x in count_dest) {
        // document.getElementById("chartshow").innerHTML += "<td>" + x + "</td>" + "<td>" + count_origin[x] + "</td>";
        count_origin_csv.push({'country':x,'count':count_dest[x],'category':'destination'});
    }
        
    var svg = dimple.newSvg("#chartshow", 840, 440); // The chart is an svg variable assigned to the chartshow div. It's width and height are also assigned here

    var myChart = new dimple.chart(svg, count_origin_csv);  // Create the chart with CityData as the data input
    myChart.setBounds(50, 15, 450, 200);            // Set the chart bounds within the svg container, top-left and bottom-right coords measured from top left


    var x = myChart.addCategoryAxis("x", "country");  // Define the x axis. In this example it is a category axis
    var y = myChart.addMeasureAxis("y", "count"); // Define the y axis
    var myLegend = myChart.addLegend(30, 0, 480, 10, "right");
    y.title = "count";
    myChart.addSeries("category", dimple.plot.bar);

    myChart.draw(500); // Draw the chart. The number is the animation delay in miliseconds

    svg.selectAll("path.domain").style("stroke", "black"); // These statements change the chart gridlines to a lighter grey colour
    svg.selectAll("g.tick line").style("stroke", "black");
    // legend.style("fill", '#fff')
    // svg.selectAll(".x.axis .tick text").style("stroke", "white")
    // d3.selectAll(".dimple-axis-x .dimple-custom-axis-label").style("fill","#e0dede");
    // d3.selectAll(".dimple-axis-y .dimple-custom-axis-label").style("fill","#e0dede");

});