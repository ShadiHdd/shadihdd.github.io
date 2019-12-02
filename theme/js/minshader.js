// boilerplate for playing with shaders in WebGL
// (plus allowing full-screen toggle)
//
// assumes/assigns specific uniforms:
//
// * "resolution" - canvas resolution ([x, y] in px)
// * "min_dim" - minimum of resolution x and y (px)
// * "mouseover" - whether mouse is over (boolean)
// * "mousedown" - whether mouse is held (boolean)
// * "mouse" - mouse position ([x, y] mapped to [-1, 1]^2)
// * "click_elapsed" - time since last click on canvas (ms)
// * "mouse_click" - where last click occured (mouse_click)

var shaders = {};

function shade(shader_id, vs_id) {

    var canvas_el = document.getElementById(shader_id + "_canvas");

    var self = this;

    this.gl = canvas_el.getContext("webgl");

    var fs_aspect_ratio = screen.width / screen.height;

    // intended to never be edited by external code
    this.uniforms = {
        resolution: [screen.width, screen.height],
        min_dim: Math.min(screen.width, screen.height),
        mouseover: false,
        mousedown: mouseDown, // mouseDown is global var set by main.js
        mouse: [0, 0],
        mouse_click: [0, 0],
        click_elapsed: 0
    };

    var programInfo = twgl.createProgramInfo(this.gl, [vs_id, shader_id + "_shader"]);
    var triangles = {
        // two triangles covering the unit square
        position: [-1, -1, 0,
                    1, -1, 0,
                   -1,  1, 0,
                   -1,  1, 0,
                    1, -1, 0,
                    1,  1, 0],
        };
    var bufferInfo = twgl.createBufferInfoFromArrays(this.gl, triangles);

    var click_time = 0;
    this.update_uniforms = function() {
        // update and return uniforms

        this.uniforms.click_elapsed = (new Date()).getTime() - click_time;
        this.uniforms.resolution = [this.gl.canvas.width, this.gl.canvas.height];
        this.uniforms.min_dim = Math.min(
            this.uniforms.resolution[0],
            this.uniforms.resolution[1]
        );

    };

    this.render = function(_uniforms) {

        this.gl.canvas.height = this.gl.canvas.width / fs_aspect_ratio;
        twgl.resizeCanvasToDisplaySize(canvas_el);
        this.update_uniforms();

        var u = {};
        Object.setPrototypeOf(u, this.uniforms);

        this.gl.viewport(
            0, 0,
            this.uniforms.resolution[0],
            this.uniforms.resolution[1]
        );
        this.gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, _uniforms);
        twgl.drawBufferInfo(this.gl, bufferInfo);
    };

    function inline() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    function fullscreen() {
        canvas_el.requestFullscreen();
    }

    function is_inline() {
        return !document.fullscreenElement;
    }

    var toggle_fullscreen = function() {
        if (is_inline()) {
            fullscreen();
        } else {
            inline();
        }
    };

    function abs_to_rel(x, y) {

        var rect = self.gl.canvas.getBoundingClientRect();

        var canvasx = rect.left;
        var canvasy = rect.top;

        var min_dim = Math.min(self.uniforms.resolution[0], self.uniforms.resolution[1]);

        rx = (2 * (x - canvasx) - self.uniforms.resolution[0]) / min_dim;
        ry = -(2 * (y - canvasy) - self.uniforms.resolution[1]) / min_dim;

        return [rx, ry];
    }


    this.gl.canvas.setAttribute(
        'style',
        "width: 100%; height:auto; touch-action:none;"
    );

    this.gl.canvas.onmousemove = function(e){
        self.uniforms.mouseover = true;
        self.uniforms.mouse = abs_to_rel(e.clientX, e.clientY);
    };
    this.gl.canvas.onmouseout = function(e){
        self.uniforms.mouseover = false;
    };
    this.gl.canvas.ontouchmove = function(e){
        e.preventDefault();
        self.uniforms.mouseover = true;
        self.uniforms.mouse = abs_to_rel(e.touches[0].clientX, e.touches[0].clientY);
    };
    this.gl.canvas.onclick = function(e) {
        click_time = (new Date()).getTime();
        self.uniforms.mouse_click = abs_to_rel(e.clientX, e.clientY);
    };

    // enter fullscreen on link click
    document.getElementById(shader_id + "_fs").onclick = fullscreen;

    // toggle fullscreen on canvas double click
    canvas_el.ondblclick = function(e) {
        e.preventDefault();
        toggle_fullscreen();
    };

    // toggle fullscreen on canvas double tap
    var tappedTwice = false;
    canvas_el.addEventListener("touchstart", function(e) {
        if(!tappedTwice) {
            tappedTwice = true;
            setTimeout( function() { tappedTwice = false; }, 300 );
            return;
        }
        e.preventDefault();
        toggle_fullscreen();
    });

    // exit fullscreen on escape key
    window.addEventListener('keydown', function(e){
        if((e.key=='Escape'||e.key=='Esc'||e.keyCode==27) &&
           (e.target.nodeName=='BODY')){
            inline();
        }
    }, true);


    shaders[shader_id] = this;
}
