
/** This program takes in a point, does an operation based on
  * some model position / project data
  * and outputs the modified point
  */

//Carries the current vertex position
attribute vec4 aVertexPosition;

//Passed from materials
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

//Program that gets executed per vertex
void main() {
  //Multiply position data by vertex local position to get world position
  //Output it to gl_Position where it will be used for rasterizing pixels
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
