import { expressjwt } from "express-jwt";


export const Authorize = () => expressjwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['HS256'],
    requestProperty: 'user',
    // TODO: Add more validation
}).unless({ path: [/^\/api\/auth\/.*/]})

