export default function cubeGeom(width) {
  var positions = [
    width, 0, 0,
    0, 0, 0,
    0, width, 0,
    width, width, 0,
    width, 0, 0,
    0, width, 0,
    //___________________________
    0, width, 0,
    0, width, width,
    width, width, 0,
    width, width, width,
    width, width, 0,
    0, width, width,
    //___________________________
    0, 0, 0,
    0, width, width,
    0, width, 0,
    0, 0, width,
    0, width, width,
    0, 0, 0,
    //___________________________
    0, 0, 0,
    width, 0, 0,
    0, 0, width,
    0, 0, width,
    width, 0, 0,
    width, 0, width,
    //___________________________
    0, 0, width,
    width, 0, width,
    0, width, width,
    0, width, width,
    width, 0, width,
    width, width, width,
    //___________________________
    width, 0, width,
    width, 0, 0,
    width, width, 0,
    width, width, width,
    width, 0, width,
    width, width, 0,
  ];
  return positions
}

export function cubeNorm() {
  var positions = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    //___________________________
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    //___________________________
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    //___________________________
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    //___________________________
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    //___________________________
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
  ];
  return positions
}