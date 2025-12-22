import { off } from "node:cluster";
import prisma from "../prisma";

export const getAllOfficerService = async () => {
  try {
    // this is a batch get for customers
    const officers = await prisma.officer.findMany({
      omit: {
        password: true,
      },
    });

    return {
      status: true,
      code: 200,
      message: "Officers details gotten successfully",
      data: officers,
    };
  } catch (error: any) {
    console.error("Error getting all officers: ", error);
    throw error;
  }
};

export const getOfficerById = async (id: string) => {
  try {
    // get officer by id
    const officers = await prisma.officer.findUnique({
      where: { id: id },
    });
    return {
      status: true,
      code: 200,
      message: "Officer details gotten successfully",
      data: officers,
    };
  } catch (error: any) {
    console.error("Error getting officer: ", error);
    throw error;
  }
};
