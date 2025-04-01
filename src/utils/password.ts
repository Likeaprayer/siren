import bcrypt from "bcrypt";

export const encryptPassword = (password: string, salt: number = 8): Promise<string> => bcrypt.hash(password, salt)

export const encryptPasswordSync = (password: string, salt: number = 8): string => bcrypt.hashSync(password, salt)

export const decryptPassword = (password: string, hashedPassword: string): boolean => bcrypt.compareSync(password, hashedPassword)