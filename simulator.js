"use strict";

// WebGL context
let gl;  
let program;
let canvas;

// re-usable buffers
let vertexBuffer;
let normalBuffer;

// view matrices
let mvMatrix;
let mvMatrixLoc;
let projMat;
let projMatLoc;
let normMatLoc;
let normMat;
let lookPosLoc;

// scene data
let vertices = [];
let normals = [];

// initial/original direction and up vecs
const origVpn = vec4(0.0, 0.0, -1.0, 1.0);
const origUp = vec4(0.0, 1.0, 0.0, 1.0);

/**
 * Helper function that binds the specified buffer and creates the buffer
 * object's data store per the given size.
 * @param {GLenum} buffer
 * @param {number} size  
*/
function bufferBind(buffer, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
}

/**
 * Helper function that returns the location of the specified attribute 
 * variable in the current WEBGL program.
 * @param {string} varName
 * @param {number} size  
*/
function bufferPoint(varName, size) {
    let ptr = gl.getAttribLocation(program, varName);
    gl.vertexAttribPointer(ptr, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ptr);
}

/**
 * Helper function that returns the locations of the uniform variables
 * for the view matrices.
*/
function setupViewMatrices() {
    mvMatrixLoc = gl.getUniformLocation(program, "mvMat");
    projMatLoc = gl.getUniformLocation(program, "projMat");
    normMatLoc = gl.getUniformLocation(program, "normMat");
    lookPosLoc = gl.getUniformLocation(program, "lookPos");
}

/**
 * The animation routine - this method is called by the browser to update
 * the simulator parameters before the next 'repaint'/render.
 * @param {number} now - current date-time in seconds
*/
function animate(now) {
    // movement vec for eye and at
    const distance = config.speed * (now - config.animation.prevTime) / 1000;
    const unitDir = mult(distance, normalize(config.camera.vpn));

    // update time
    config.animation.prevTime = now;

    // update eye coordinates with values from movement vector
    config.camera.eye[0] += unitDir[0];
    config.camera.eye[1] += unitDir[1];
    config.camera.eye[2] += unitDir[2];

    // validate the eye point and check if terrain need be re-gen
    const patchFlag = checkBounds();

    // stitch and tile terrain if needed
    tileTerrain(patchFlag);

    // evaluate transformation matrix
    const transMat = getTransformation();

    // update the direction vec, at point and orientation
    updatePositions(transMat);

    // set viewing position
    gl.uniform4f(lookPosLoc,
        false,
        config.camera.at[0],
        config.camera.at[1],
        config.camera.at[2],
        1.0
    );

    // evaluate the matrices
    mvMatrix = lookAt(config.camera.eye,
                        config.camera.at,
                        config.camera.up
    );
    projMat = viewVolume();
    normMat = normalMatrix(mvMatrix, true);

    // render
    render();

    // requqest next frame
    window.requestAnimationFrame(animate);
}

/**
 * The onload event handler.
*/
window.onload = () => {
    // extract canvas
    canvas = document.getElementById("gl-canvas");

    // initialize webgl
    gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL 2.0 isn't available");

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(73 / 255, 151 / 255, 208 / 255, 1.0); // color the sky - celestial blue
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // handler for keydown event
    window.addEventListener('keydown', (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }
  
        // handle keypress
        keyHandler(event);
  
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);

    // setup the vpn and up vectors in the config
    config.camera.vpn = vec3(...origVpn.slice(0, 3));
    config.camera.up = vec3(...origUp.slice(0, 3));

    // initialize the terrain - generate mountains
    getPatch();

    // setup camera
    setupViewMatrices();
    
    // create the vertex buffer and load data in it
    vertexBuffer = gl.createBuffer();
    bufferBind(vertexBuffer, flatten(vertices));
    bufferPoint('vPosition', 4);
    
    // create the normal buffer and load data in it
    normalBuffer = gl.createBuffer();
    bufferBind(normalBuffer, flatten(normals));
    bufferPoint('normVec', 3);

    // start animation
    window.requestAnimationFrame(animate);
}

/**
 * The main render function that handles the entire sequence of
 * processing and buffer updates.
*/
function render() {
    // clear the screen
    gl.clear(gl.COLOR_BUFFER_BIT);

    // update and send scene primitives to GPU
    bufferBind(vertexBuffer, flatten(vertices));
    bufferBind(normalBuffer, flatten(normals));

    // update and send viewing matrices to GPU
    gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projMatLoc, false, flatten(projMat));
    gl.uniformMatrix3fv(normMatLoc, false, flatten(normMat));

    // display the scene
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}
