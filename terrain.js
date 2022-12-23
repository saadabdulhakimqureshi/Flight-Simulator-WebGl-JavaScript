// terrain generation and management functions

/**
 * Perturbs the y-coordinate.
 * @param {number} x
 * @param {number} z
 * @returns {number} 
*/
function pertrub(x, z) {
    return perlin.perlin2(x, z) * 3;
}

/**
 * For the given location in the x-z plane, the function generates
 * vertices.
 * @param {number} x
 * @param {number} z
 * @param {number} interval
 * @returns {object} points
*/
function triangulate(x, z, interval) { 
    // object holding the neighborhood
    let points = {};

    // pertrube y-coordinate of grid points
    let yFirst = Math.max(pertrub(x, z), 0);
    points[1] = vec4(x, yFirst, z, 1.0);    

    let ySecond = Math.max(pertrub(x + interval, z), 0);
    points[2] = vec4(x + interval, ySecond, z, 1.0);

    let yThird = Math.max(pertrub(x, z + interval), 0);
    points[3] = vec4(x, yThird, z + interval, 1.0);

    let yFourth = Math.max(pertrub(x + interval, z + interval), 0);
    points[4] = vec4(x + interval, yFourth, z + interval, 1.0);

    // return the mapping
    return points;
}

/**
 * Constructs and records the normals for the given points in space. 
 * @param {Array.<number>} u
 * @param {Array.<number>} v
 * @param {Array.<number>} x
*/
function recordNormals(u, v, x) {
    // construct vectors
    let firstVec = subtract(u, v);
    let secondVec = subtract(u, x);

    // calculate and record normals
    let normal = normalize(cross(firstVec, secondVec));
    normals.push(normal, normal, normal);
}

/**
 * Helper function that loads up the vertices and instigates construction
 * of their normals - and their eventual loading. 
 * @param {Array.<number>} firstPt
 * @param {Array.<number>} secPt
 * @param {Array.<number>} thirdPt
*/
function loadTriangles(firstPt, secPt, thirdPt) {
    vertices.push(firstPt);
    vertices.push(secPt);
    vertices.push(thirdPt);
    
    // record normal
    recordNormals(firstPt, secPt, thirdPt);
}

/**
 * Generates a patch of terrain over the x-z plane. 
*/
function getPatch() {  
    const interval = 0.50; // higher values improve performance but degrade terrain look

    // generate height-field over the xz plane
    for (let z = config.terrain.zMin; z < config.terrain.zMax; z += interval) {
        for (let x = config.terrain.xMin; x < config.terrain.xMax; x += interval) {
            // generate the vertices
            let points = triangulate(x, z, interval);
        
            // record first triangle
            loadTriangles(points[1], points[2], points[3]);

            // record second triangle
            loadTriangles(points[3], points[2], points[4]);
        }
    }
}

/**
 * Check if a new patch is to be generated. If so, the previous patch
 * is unloaded and a new patch is generated.  
 * @param {boolean} genPatch
*/
function tileTerrain(genPatch) {
    // check if regeneration threshold limit is met
    if (genPatch) {           
        // unload prev terrain
        vertices = [];
        normals = [];

        // generate new terrain
        getPatch();
    }
}
