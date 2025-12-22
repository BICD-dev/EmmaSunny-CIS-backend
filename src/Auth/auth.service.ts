import { backup } from "node:sqlite";
import { hashPassword } from "../utils/bcrypt/hash";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt/jwt.service";
import { AppError } from "../utils/middleware/error-handler";

interface UserData {
  username: string;
  password: string;
}
interface OfficerData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  role: "admin" | "staff";
  password: string;
}
export const loginService = async (data: UserData) => {
  // check that user name exists in the db
  const officer = await prisma.officer.findUnique({
    where: { username: data.username },
  });
  if (!officer) {
    return {
      status: false,
      code: 404,
      message: "Officer not found ",
    };
  }
  // check if password matches with password in the db
  const matchedPassword = await bcrypt.compare(data.password, officer.password);
  if (!matchedPassword) {
    return {
      status: false,
      code: 400,
      message: "Incorrect Username or password",
    };
  }
  // generate token
  const payload = {
    id: officer.id,
    email: officer.email,
    role: officer.role,
  };
  const token = generateToken(payload);
  // return success message
  return {
    status: true,
    code: 200,
    message: "Login successfully",
    data: {
      token,
    },
  };
};
// create either an admin or staff account, only someone with the role admin can do this
export const registerOfficerService = async (payload: OfficerData) => {
  
  // check if the username or email already exists in the db
  const usernameExists = await prisma.officer.findUnique({
    where: { username: payload.username },
  });
  const emailExists = await prisma.officer.findUnique({
    where: { email: payload.email },
  });
  if (emailExists || usernameExists) {
    return {
      status: false,
      code: 404,
      message: "username or email already exists",
    };
  }
  // hash password
  const hashedPassword = await hashPassword(payload.password);
  // create account by storing in the db
  return await prisma.$transaction(async (tx) => {
    try {
      const officer = await tx.officer.create({
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          username: payload.username,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          password: hashedPassword,
        },
      });

      // log action in the log table
      await tx.log.create({
        data: {
          officer_id: officer.id,
          action: `Registered_officer_${officer.first_name}_${officer.last_name}`,
        },
      });

      // return success message
      return {
        status: true,
        code: 201,
        message: `${officer.role} created successfully`,
      };
    } catch (error: any) {
      // this flags if the email already exists
      if (error.code === "P2002") {
        throw new AppError("Officer already exists", 409);
      }
      throw error; //for any unexpected error
    }
  });
};

export const resetPasswordService = (officer_id:string, oldPassword:string,  newPassword:string)=>{
    // only the owner of the account can request for a change password
}