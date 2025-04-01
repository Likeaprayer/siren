import jsonwebtoken from 'jsonwebtoken';
import User from '../db/models/user';


export const createToken = (user: User): string => {
    const { id, email, role } = user;
    return jsonwebtoken.sign({ id, email, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};