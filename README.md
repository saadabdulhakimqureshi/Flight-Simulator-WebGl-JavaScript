# Flight-Simulator-WebGL
We have created a basic flight simulator using only WEB-GL. 

Course: CS 440 Computer Graphics(Project)

There are 5 main features implemented in this project:

1. A height map is used to generate a terrain mesh. A grid, once generated, has it's y-coordinate randomly perturbed, giving the appearance of mountains.
2. A flyby view of the generated terrain is implemented. This is the perspective view obtained from a plane flying at a certain y-coordinate, facing parallel to the ground. The bounds of the view can be dynamically altered within reasonable limits.
3. The terrain is colored such that the 'mountains' have snowy tops, a grassy base, and lakes surrounding them.
4. The pitch, roll, and yaw of the plane is implemented to determine the orientation, within constraints.
5. The terrain is infinite. When the plane approaches the boundary of a patch it is currently flying over, a new patch is dynamically computed and added so the plane never flies out of terrain. 

## Implementation

API Renderer: WebGL(JavaScript)

## Requirements

Latest browsers(HTML5)

## Controls

Use WASD to move the camera.

Use QD to role the camera.

View Details.PNG to view further controls.

## Code

View Code directory for javascript files.

The terrain is generated using perlin noise algorithm.

The model view matrix is manipulated to create teh illusion of moving flight.

## Run 

Open simulator.html in code directory to view the simulator.

## Screens

![Alt text](/Snapshots/Terrain.PNG "Flight Simulator")
