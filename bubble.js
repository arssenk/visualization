(function () {
    var width = 800,
        height = 700;

    var svg_chart = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(" +width/2 + "," + height/2 + ")");

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("collide", d3.forceCollide(function (d){
            return radiusScale(d.thousands) + 10
        }));

    d3.queue()
        .defer(d3.csv, "./data/pop.csv")
        .await(ready);


    var radiusScale = d3.scaleSqrt().domain([11, 1386395]).range([7, 23]);
    function ready(error, datapoints) {
        var circles = svg_chart.selectAll(".artist")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", function (d) {
                return radiusScale(parseInt(d.thousands))
            })
            .attr("fill", "blue");

        var labels = svg_chart.selectAll(".artist-label")
            .data(datapoints)
            .enter().append("text")
            .attr("class", "artist-label")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", function (d){
                return  Math.floor(radiusScale(parseInt(d.thousands))) - 2;
            })
            .text(function(d) {
                return d.Economy;
            });

        simulation.nodes(datapoints).on("tick", ticked);

        function ticked(){
            circles
                .attr("cx", function (d) {
                    return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
            labels
                .attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y;
                })
        }
    }
})();