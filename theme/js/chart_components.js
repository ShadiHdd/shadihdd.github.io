/*
 *  ____                      _     _
 * |  _ \ ___ _   _ ___  __ _| |__ | | ___
 * | |_) / _ \ | | / __|/ _` | '_ \| |/ _ \
 * |  _ <  __/ |_| \__ \ (_| | |_) | |  __/
 * |_|_\_\___|\__,_|___/\__,_|_.__/|_|\___|           _
 * / ___|___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ ___
 * | |   / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __/ __|
 * | |__| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_\__ \
 *  \____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|___/
 *                      |_|
 */

function Line() {

    var line = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    var use = function(x) { return x; };
    var s_tolerance = 1.0;

    function chart(selection) {
        selection.each(function(data) {

            var path = d3.select(this).selectAll("path").data([data]);

            // update
            path
                .attr("d", function(d){
                    return line(simplify(d.points, s_tolerance));
                })
                .call(use);

            // enter + update
            path.enter()
                .append("path")
                .attr("d", function(d){
                    return line(simplify(d.points, s_tolerance));
                })
                .call(use);

            // exit
            path.exit().remove();

        });

    }

    chart.use = function(_) {
        if (!arguments.length) return use;
        use = _;
        return chart;
    };

    chart.s_tolerance = function(_) {
        if (!arguments.length) return s_tolerance;
        s_tolerance = _;
        return chart;
    };

    return chart;
}


function Text() {

    var use = function(x) { return x; };

    function chart(selection) {
        selection.each(function(data) {

            var txt = d3.select(this).selectAll("text").data([data]);

            // update
            txt
                .text(function(d){
                    return d.value;
                })
                .call(use);

            // enter + update
            txt.enter()
                .append("text")
                .text(function(d){
                    return d.value;
                })
                .call(use);

            // exit
            txt.exit().remove();

        });

    }

    chart.use = function(_) {
        if (!arguments.length) return use;
        use = _;
        return chart;
    };

    return chart;
}
