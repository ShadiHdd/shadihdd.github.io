/*
 * Depends on [D3.js](https://d3js.org/)
 *
 * Automatically usable by using <d3> tags in the markdown
 * by virtue of /plugins/charts/charts.py
 *
 *//*
'''

References:
  [Towards reusable charts](https://bost.ocks.org/mike/chart/)
  [Thinking with joins](https://bost.ocks.org/mike/join/)
  [General Update Pattern](https://bl.ocks.org/mbostock/3808218)

Goals:

* Make it easy to compose graphics (i.e. subcharts) in a single SVG

  * Remove SVG generation from the concerns of reusable components,
    so that reusable components work with <g> instead.

  * Adopt a standard scale for drawing of all SVGs
    (width = 500 px for the space indended to be used for drawing)
    SVGs are _scalable_, so adjusting the actual width of the <svg>
    element can be accomplished by CSS later.
    The 500px value only sets the size of the area drawn relative to
    lines (which are typically 1 or 2 px thick). This value is set
    via the `viewBox` attribute.

* Allow ourselves to think of composing visualiztions as constructing
  a function pathway to visualize data.

  * We construct the visualization by composing reusable components
  * We call the resulting function on data.
  * Calling the function again on new data updates it.
  * We may focus on procedurally generated data for math visualizations
    and animations

* Automatically deal with scroll triggers.

Use Case:

* Assume access to reusable components as described in Bostock's article
  [Towards reusable charts](https://bost.ocks.org/mike/chart/), which
  do not create SVGs, but bind instead to <g> elements. Also assume these
  components properly take care of updates to `data`.

   */

var SVG_INNER_WIDTH = 500,
    SVG_INNER_HEIGHT = 300,
    SVG_MARGIN = 20;

function makeSVG(params={}) {
    /*
     * Convenience method for attaching an SVG to the DOM
     * (with a pre-determined px scale, and margin _inside_ the svg).
     * and positioning subplots.
     *
     *  |<--- width set by CSS --->|
     *  +--------------------------+  ^
     *  |    |<- 987 svg_px ->|    |  |
     *  |    +----------------+    |  |
     *  |    |                |    |  |
     *  |    |                |    |  | height
     *  |    |(0, 0)          |    |  | set by CSS
     *  |    $----------------+    |  |
     *  |                          |  |
     *  +--------------------------+  v
     *  |<-->|                |<-->|
     *   20 svg_px             20 svg_px
     *
     * returns a d3 selection of a <g> at (0, 0) within the SVG,
     * extended with a `subplot` method.
     *
     */

    // read paramers and replace with defaults if necessary
    container_id = params.id;

    function parse_param(name, default_value) {
        if (params[name] == undefined) {
            params[name] = default_value;
        } else {
            params[name] = Number(params[name]);
        }
    }
    parse_param('width', SVG_INNER_WIDTH);
    parse_param('height', SVG_INNER_HEIGHT);
    parse_param('margin', SVG_MARGIN);

    var outer_width = params.width + 2 * params.margin,
        outer_height = params.height + 2 * params.margin;

    var svg = d3.select(document.getElementById(container_id))
        .append("svg")
        .attr("viewBox", `0 0 ${outer_width} ${outer_height}`);

    // attach a <g> element with offset.
    // the returned object will also get a few other convenience
    // methods attached to it
    return _subplot.call(svg).transform(SVG_MARGIN, SVG_MARGIN);
}

function _subplot() {
    /*
     * the objects created by this function
     * (d3 selections of g objects) will have this method
     * attached to them as `.subplot` so that subplots
     * can also have subplots.
     *
     * subplots are useful for applying transformation
     * to groups of svg elements
     */

    /* `this` should be a d3 selection of an <svg> or <g> element */

    var g = this.append("g")
        .attr("class", "subplot");

    g.subcomponents = {};

    // nest a reusable d3 component inside the subplot
    // takes on the same role as `append`
    g.attach_component = function(reusable_d3_component, key) {
        /*
         * returns a chart object which provides
         * `transform` and `update` methods
         */

        // a subplot dedicated to the component
        // is created inside _this_ subplot.
        // the new subplot doesn't allow more nested subplots,
        // nor additional attached components
        var anchor = this.append("g")
            .attr("class", "component-g");

        var chart = reusable_d3_component();

        if (key) {
            g.subcomponents[key] = chart;
        }

        // bind the transform method to the parent <g> of the component
        chart.transform = function() {
            g_css_transform.apply(anchor, arguments);
            return this;
        };

        // regenerate or update the chart with new data
        chart.update = function(data) {
            // d3.select('.component-g').datum(data).call(chart);
            anchor.datum(data).call(chart);
            return this;
        };

        chart.parametric_update = parametric_update;

        chart.animate_with = animate_with;
        chart.animate_periodic_with = animate_periodic_with;

        return chart;
    };

    g.transform = g_css_transform;
    g.subplot = _subplot;
    g.anchor = g;

    g.update = function(data) {

        var keys = Object.keys(g.subcomponents);
        for (var i = 0; i < keys.length; i++) {
            g.subcomponents[keys[i]].update(data[keys[i]]);
        }

        return this;
    };

    g.parametric_update = function(data) {

        var keys = Object.keys(g.subcomponents);
        for (var i = 0; i < keys.length; i++) {
            g.subcomponents[keys[i]].parametric_update(data[keys[i]]);
        }

        return this;
    };

    g.animate_with = animate_with;
    g.animate_periodic_with = animate_periodic_with;

    return g;
}

// avoid having to write transform strings again
function g_css_transform(x, y) {
    this.attr(
        "transform",
        "translate(" + x + "," + y + ")"
    );

    return this;
}

// Update the chart using an object with parameterized attributes
// representing the data.
// Each attribute of the object may be a static value
// or a function of s (a parameter which varies in the interval [0, 1])
function parametric_update(parameterized_object, num_points) {

    // higher -> more simplification

    if (num_points == undefined) {
        num_points = 30;
    }

    // generate a list of objects
    var mapped = {};
    var keys = Object.keys(parameterized_object);

    for (var ki = 0; ki < keys.length; ki++) {
        var k = keys[ki];
        if (typeof parameterized_object[k] === "function") {
            mapped[k] = new Array(num_points);
            for (var i = 0; i < num_points; i++) {
                mapped[k][i] = parameterized_object[k](i / (num_points - 1));
            }
        } else {
            mapped[k] = parameterized_object[k];
        }
    }

    this.update(mapped);

    return this;
};

// Bind a function which generates data to the scroll
// event listeners such that the chart will only
// be animated while the element is in view.
//
// parameterized_object_generator is a function of f, and t:
//  * f - number of frames since animation started
//  * t - absolute unix time in ms
// which returns an object
// The attributes of this object may be functions of another parameter:
//  * s - varies from 0 to 1
function animate_with(parameterized_object_generator) {

    var that = this;

    var animate_frame_callback = function(f, t) {
        that.parametric_update(parameterized_object_generator(f, t));
    };

    var root_svg = this.anchor.node().parentNode;
    while (root_svg.tagName != 'svg') {
        root_svg = root_svg.parentNode;
    }

    bindScrollTriggers(
        root_svg,
        // start animation when content in view
        function() {
            addAnimation(
                animate_frame_callback
            );
        },
        // stop animation when not in view
        function() {
            removeAnimation(
                animate_frame_callback
            );
        }
    );

    return this;
};

// uses animate_with on pre-computed periodic data
//
//  frames_per_period - number of frames to precompute and cycle through
//
//  parameterized_object_generator - function to return data to pass to
//  reusable chart; is a function of a single parameter:
//    p - varies from 0 to 1, corresponds to proportion of period elapsed
//
function animate_periodic_with(
    frames_per_period,
    parameterized_object_generator
    ) {

    /* pre-compute a full period of animation */
    var tabulated_values = {};

    for(var p=0; p < frames_per_period; p++) {
        tabulated_values[p] =
            parameterized_object_generator(p / frames_per_period);
    }

    this.animate_with(function(f, t) {
        return tabulated_values[f % frames_per_period];
    });
};
