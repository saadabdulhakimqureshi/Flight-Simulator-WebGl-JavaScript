// all flight dynamics and viewing utilities here

/**
 * Enforce bounds upon the eye point. As such, if the plane is 
 * flying "out of bounds", a new patch is signaled to be generated.
 * Furthermore, constraints to keep the plane from running a-ground
 * are implemented. 
 * @returns {bool} genPatch 
*/
function checkBounds() {
    let genPatch = false;

    // check left bound of viewVolume
    if (config.camera.eye[0] <= config.terrain.xMin + config.terrain.width) {
        config.terrain.xMax -= config.terrain.width;
        config.terrain.xMin -= config.terrain.width;
        genPatch = true;
    }

    // check right bound of viewVolume
    if (config.camera.eye[0] >= config.terrain.xMax - config.terrain.width) {
        config.terrain.xMax += config.terrain.width;
        config.terrain.xMin += config.terrain.width;
        genPatch = true;
    }

    // check if eye has gone beyond the terrain patch 
    if (config.camera.eye[2] <= config.terrain.zMax - config.terrain.depth) {
        config.terrain.zMax -= config.terrain.depth;
        config.terrain.zMin -= config.terrain.depth;
        genPatch = true;
    }

    // check if plane is about to run aground
    if (config.camera.eye[1] < 7) {
        // cruising altitude is y = 7
        config.camera.eye[1] = 7;
    }

    // check if plane is about to go into space
    if (config.camera.eye[1] > 30) {
        // max curising altitude is y = 30
        config.camera.eye[1] = 30;
    }

    return genPatch
}

/**
 * For the current pitch, roll and yaw angles, the function
 * returns the transformation matrix, M.
 * @returns {mat4} transformation matrix, M 
*/
function getTransformation() {
    const rollMat = rotateZ(config.flight.roll);
    const yawMat = rotateY(config.flight.yaw);
    const pitchMat = rotateX(config.flight.pitch);

    return mult(rollMat, mult(yawMat, pitchMat));
}

/**
 * Helper function that updates the direction and up vectors in 
 * addition to, the at point.
 * @param {mat4} transMat 
*/
function updatePositions(transMat) {
    // update the direction vector
    config.camera.vpn = mult(transMat, origVpn);
    // typecast vpn vector to vec3
    config.camera.vpn = vec3(...config.camera.vpn.slice(0, 3));

    // Update the at point
    config.camera.at = add(config.camera.eye, config.camera.vpn);

    // update the orientation
    config.camera.up =  mult(transMat, origUp);
    // typecast up point to vec3
    config.camera.up = vec3(...config.camera.up.slice(0, 3));
}

/**
 * Using the viewing volume parameters, the function constructs
 * and returns the projection matrix.
 * @returns {mat4} projMatrix 
*/
function viewVolume() {
    let width = config.frustrum.right - config.frustrum.left;
    let height = config.frustrum.above - config.frustrum.bottom;
    let depth = config.frustrum.far - config.frustrum.near;

    // return the matrix
    return mat4(
        (2*config.frustrum.near/width), 0,
        (config.frustrum.right+config.frustrum.left)/width, 0,
        0, (2*config.frustrum.near/height),
        (config.frustrum.above+config.frustrum.bottom)/height, 0,
        0, 0,
        -(config.frustrum.far+config.frustrum.near)/depth, (-2*config.frustrum.far*config.frustrum.near)/depth,
        0, 0,
        -1, 0
    );
}
