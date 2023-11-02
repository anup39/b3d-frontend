const createMapImage = (map) => {
  const canvas = map.getCanvas();
  const screenshotCanvas = document.createElement("canvas");
  const context = screenshotCanvas.getContext("2d");
  screenshotCanvas.width = canvas.width;
  screenshotCanvas.height = canvas.height;
  context.drawImage(canvas, 0, 0);
  const imageBase64 = screenshotCanvas.toDataURL("image/png");
  const image = imageBase64;
  const byteCharacters = atob(image.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });
  return blob;
};

export default createMapImage;
