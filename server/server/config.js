import dotenv from "dotenv";
import path from "path";
import os from 'os';

dotenv.config();

export const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/bbddJalp";
export const PORT = process.env.PORT || 3100;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const JWT_SECRET = process.env.JWT_SECRET;
//google
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
//sendinblue
export const API_KEY_SB = process.env.API_KEY_SB;

const hostname = os.platform();
let preRuta;
if (hostname === 'win32') {
    preRuta = '../../client/public/';
} else {
    preRuta = '../../client/';
};
const elPathPublic = path.join(__dirname, preRuta);
export const RUTA_PUBLIC = elPathPublic;
const elPathAvatars = path.join(__dirname, preRuta + 'assets/images/avatars/');
export const RUTA_FILES_AVATARS = elPathAvatars;
const elPathNotes = path.join(__dirname, preRuta + 'assets/images/notes/');
export const RUTA_FILES_NOTES = elPathNotes;
const elPathFiles = path.join(__dirname, preRuta + 'assets/files/');
export const RUTA_FILES_FILES = elPathFiles;
