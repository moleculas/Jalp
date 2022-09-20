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

const productos = [
    { producto: "1070x90x21", familia: "palet", serie: ["1070x90x21", "1140x90x21", "1003x98x21"], unidades: 2, posicion: 1 },
    { producto: "1140x90x21", familia: "palet", serie: ["1070x90x21", "1140x90x21", "1003x98x21"], unidades: 4, posicion: 2 },
    { producto: "1003x98x21", familia: "palet", serie: ["1070x90x21", "1140x90x21", "1003x98x21"], unidades: 4, posicion: 3 },
    { producto: "2500x135x72", familia: "taco", serie: ["2500x135x72", "2420x103x72", "2500x103x94"], unidades: 1, posicion: 1 },
    { producto: "2420x103x72", familia: "taco", serie: ["2500x135x72", "2420x103x72", "2500x103x94"], unidades: 1, posicion: 2 },
    { producto: "2500x103x94", familia: "taco", serie: ["2500x135x72", "2420x103x72", "2500x103x94"], unidades: 1, posicion: 3 },
    { producto: "1150x135x21", familia: "patin", serie: ["1150x135x21", "1150x78x21"], unidades: 1, posicion: 1 },
    { producto: "1150x78x21", familia: "patin", serie: ["1150x135x21", "1150x78x21"], unidades: 2, posicion: 2 }
];

export const SUBDIRECTORI_PRODUCCIO = subdirectoriProduccio;
export const RUTA_API = rutaApi;
export const RUTA_SERVER = rutaServer;
export const SUPPORTED_FORMATS = formatosArchivos;
export const PRODUCTOS = productos;