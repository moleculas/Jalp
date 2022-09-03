import bcrypt from 'bcryptjs';

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};