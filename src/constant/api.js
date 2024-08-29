const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const api = {
  login: () => `${baseUrl}/api/user/login`,
  register: () => `${baseUrl}/api/user/register`,
  getAllFiles: () => `${baseUrl}/api/file/getAll`,
  uploadFile: () => `${baseUrl}/api/file/upload`,
  handleDownloadFile: (fileName, quality) =>  `${baseUrl}/api/file/handleDownload?key=${fileName}-${quality}`,
  downloadFile: (fileName, quality) => `${baseUrl}/api/file/download?fileName=${fileName}&quality=${quality}`,
  generateFile: (file, qualities) => `${baseUrl}/api/file/generate?file=${file}&qualities=${qualities}`,
};
