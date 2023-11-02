export const createImagePNG = (imageBase64) => {
  const byteCharacters = atob(imageBase64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });
  return blob;
};

export function takeScreenshot(map) {
  return new Promise(function (resolve, reject) {
    map.once("render", function () {
      resolve(map.getCanvas().toDataURL());
    });
    map.setBearing(map.getBearing());
  });
}
