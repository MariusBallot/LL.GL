attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

uniform mat3 u_matrix;

varying vec2 v_texCoord;

void main() {
  v_texCoord = a_texCoord;

  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}