import jsonwebtoken from 'jsonwebtoken';
import {User} from '../db/models/user';


export const createToken = (user: User): string => {
    const { id, email, user_type } = user;
    return jsonwebtoken.sign({ id, email, user_type }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};