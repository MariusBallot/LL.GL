export default function cube(width) {
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