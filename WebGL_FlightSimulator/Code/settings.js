// config file.

/**
 * The configurations of the flight simulator.
*/
let config = {
    terrain: {
        xMin: -60,
        xMax: 60,
        zMin: -60,
        zMax: 0,
        width: 20,
        depth: 15
    },
    frustrum: {
        left: -2, // [-2, 0]
        right: 2, // [2, 4]
        above: 2, // [2, 4]
        bottom: -2, // [-2, -1]
        near: 3, // [3, 5]
        far: 30 // [20, 75]
    },
    camera: {
        eye: vec3(0.0, 7.0, 0.0), // cruising altitude at y = 7
        at: vec3(0.0, 7.0, 1.0),
        vpn: null,
        up: null
    },
    flight: {
        delta: 1,
        pitch: 0,
        roll: 0,
        yaw: 0
    },
    animation: {
        prevTime: 0
    },
    speed: 2.0,
};
