// https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result?.toString() || "");
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};

export default getBase64;
