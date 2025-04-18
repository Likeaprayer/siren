import { Request, Response } from "express";
import {User} from "../db/models/user"
import { decryptPassword, encryptPassword } from "../utils/password";
import { createToken } from "../utils/token";

export const signup = async(req: Request, res: Response):Promise<any> => {
    const signupReq = req.body
   const exists = await User.query().findOne("email", signupReq.email)

   if(exists) {
     return res.status(409).json({ message: "Email already exists" });  
   }

   const hashedPassword = await encryptPassword(signupReq.password)

   const user = await User.query().insertAndFetch({
     email: signupReq.email,
     password: hashedPassword,
     user_type: signupReq.user_type,
     name: signupReq.name,
   })
  return res.status(200).json({ message: "sucess", data: user }); 
}

export const login = async(req: Request, res: Response): Promise<any> => {
    const loginReq = req.body

    const user = await User.query().findOne("email", loginReq.email)
    
    if(!user ||!decryptPassword(loginReq.password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });  
    }

    const token = createToken(user)

  return res.status(200).json({ message: "login",  data: user, token}); 
}