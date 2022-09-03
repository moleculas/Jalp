import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";

export const createJWTToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const createJWTTokenRecuperacion = (user) => {
    return jwt.sign({ user }, JWT_SECRET, {
        expiresIn: 60 * 30,
    });
};

export const decodeJWTToken = (token) => {
    return jwt.decode(token);
};

