precision mediump float;

uniform vec4 u_color;
uniform sampler2D u_image;

varying vec2 v_texCoord;
varying vec4 v_color;

 
void main() {
  // gl_FragColor = u_color;
  gl_FragColor = vec4(v_color.x,0.,v_color.z,1.);
}