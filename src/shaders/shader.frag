// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

uniform vec4 u_color;
uniform sampler2D u_image;

varying vec2 v_texCoord;
 
void main() {
  // gl_FragColor = u_color;
  gl_FragColor = texture2D(u_image, v_texCoord);
}