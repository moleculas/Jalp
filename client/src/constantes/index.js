let rutaApi, rutaServer
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    rutaApi = "http://localhost:3100/api";
    //rutaServer = window.location.protocol + "//" + window.location.host + "/";
    rutaServer = "http://localhost:3100";
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

const productos = [
    { producto: "1070x90x21", familia: "palet", unidades: 2 },
    { producto: "1140x90x21", familia: "palet", unidades: 4 },
    { producto: "1003x98x21", familia: "palet", unidades: 4 },
    { producto: "2500x135x72", familia: "taco", unidades: 1 },
    { producto: "2420x103x72", familia: "taco", unidades: 1 },
    { producto: "2500x103x94", familia: "taco", unidades: 1 },
    { producto: "1150x135x21", familia: "patin", unidades: 1 },
    { producto: "1150x78x21", familia: "patin", unidades: 2 }
];

const productosLX = [
    { producto: "LX3FR" },
    { producto: "TOPLAYERFR" },
    { producto: "LX3DE" },
    { producto: "LX3ES" },
    { producto: "TOPLAYERES" },
];

export const SUBDIRECTORI_PRODUCCIO = subdirectoriProduccio;
export const RUTA_API = rutaApi;
export const RUTA_SERVER = rutaServer;
export const SUPPORTED_FORMATS = formatosArchivos;
export const PRODUCTOS = productos;
export const PRODUCTOSLX = productosLX;
//Redondeado decimales
export const REDONDEADO = 4;