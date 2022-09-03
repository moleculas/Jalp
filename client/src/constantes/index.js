let rutaApi, rutaServer
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    rutaApi = "http://localhost:3100/api";
    rutaServer = window.location.protocol + "//" + window.location.host + "/";
} else {
    rutaApi = "/api";
    rutaServer = window.location.protocol + "//" + window.location.host + "/";
};

const subdirectoriProduccio = '';
//afegir a package.json: "homepage": "https://domini/subdomini",

const formatosArchivos = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.presentation",
    "text/plain",
    "application/zip",
    "video/mp4",
    "application/vnd.rar",
    "application/rtf"
];

export const SUBDIRECTORI_PRODUCCIO = subdirectoriProduccio;
export const RUTA_API = rutaApi;
export const RUTA_SERVER = rutaServer;
export const SUPPORTED_FORMATS = formatosArchivos;