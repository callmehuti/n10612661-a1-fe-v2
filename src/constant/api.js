const baseUrl = import.meta.env.VITE_BACKEND_URL;
const externalUrl = import.meta.env.VITE_EXTERNAL_API;

export const api = {
  login: () => `${baseUrl}/api/user/login`,
  register: () => `${baseUrl}/api/user/register`,
  getAllFiles: () => `${baseUrl}/api/file/getAll`,
  uploadFile: () => `${baseUrl}/api/file/upload`,
  handleDownloadFile: (fileName, quality) =>  `${baseUrl}/api/file/handleDownload?key=${fileName}-${quality}`,
  downloadFile: (fileName, quality) => `${baseUrl}/api/file/download?fileName=${fileName}&quality=${quality}`,
  generateFile: (file, qualities) => `${baseUrl}/api/file/generate?file=${file}&qualities=${qualities}`,
  deleteFile: (fileName) => `${baseUrl}/api/file/remove?fileName=${fileName}`,
  addRelativeInfo: () => `${baseUrl}/api/file/addRelativeInfo`,
  editRelativeInfo: () => `${baseUrl}/api/file/editRelativeInfo`,
  getFileInfo: (fileName) => `${baseUrl}/api/file/getFileInfo?fileName=${fileName}`,
  getRelativeVideos: (keyword) => `${externalUrl}/api/search?key=${keyword}&pageToken=`,
};
