attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
varying vec2 v_texCoord;
varying vec4 v_color;

void main() {
  v_texCoord = a_texCoord;
  v_color = a_position;

  vec4 position = u_matrix * a_position;

  gl_Position = u_matrix * a_position;
}