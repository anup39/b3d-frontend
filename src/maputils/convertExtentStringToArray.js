function convertExtentStringToArray(inputString) {
  // Extracting coordinates from the string
  const coordinates = inputString
    .replace("BOX(", "") // Remove "BOX("
    .replace(")", "") // Remove ")"
    .split(",") // Split by ","
    .map((coord) => coord.trim().split(" ").map(parseFloat)); // Split by " " and convert to floats

  // Creating the array format
  const extentArray = [
    coordinates[0][0],
    coordinates[0][1],
    coordinates[1][0],
    coordinates[1][1],
  ];

  return extentArray;
}

export default convertExtentStringToArray;
