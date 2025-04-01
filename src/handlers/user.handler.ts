import { Request, Response } from "express";
import { User } from "../db/models/user";
import { encryptPassword } from "../utils/password";

export const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const user = await User.query().findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "success", data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, user_type } = req.body;
    
    // Check if email already exists
    const existingUser = await User.query().where('email', email).first();
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    const user = await User.query().insert({
      name,
      email,
      password, // Should be hashed before storing
      user_type,
      created_At: new Date().toISOString()
    });
    
    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    
    const user = await User.query().findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updatedUser = await User.query().patchAndFetchById(id, {
      name,
      email
    });
    
    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const createUser = async(req: Request, res: Response): Promise<any> => {
//     const signupReq = req.body
//    const exists = await User.query().findOne("email", signupReq.email)

//    if(exists) {
//      return res.status(409).json({ message: "Email already exists" });  
//    }

//    const hashedPassword = await encryptPassword(signupReq.password)

//    const user = await User.query().insertAndFetch({
//      email: signupReq.email,
//      password: hashedPassword,
//      role: signupReq.role,
//      full_name: signupReq.full_name,
//    })
//   return res.status(200).json({ message: "sucess", data: user });
// };


