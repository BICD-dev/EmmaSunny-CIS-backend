import { off } from "node:cluster";
import prisma from "../prisma";
import { AppError } from "../utils/middleware/error-handler";

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
      omit: {
        password: true,
      },
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

export const deleteOfficer = async (id: string, officer_id: string) => {
  try {
    const officer = await prisma.officer.findUnique({
      where: { id: id },
    });
    if (!officer) {
      throw new AppError("Officer not found", 404);
    }
    const currentStatus = officer.status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    return await prisma.$transaction(async (tx) => {
      // update status of the officer
      await tx.officer.update({
        where: { id: id },
        data: { status: newStatus },
      });
      // log action
      await tx.log.create({
        data: {
          officer_id: officer_id,
          action: `CHANGED_OFFICER_STATUS_${officer.first_name}_${officer.last_name}`,
        },
      });

      return {
        status: true,
        code: 201,
        message: "Officer Status changed successfully",
      };
    });
  } catch (error: any) {
    console.error("Error deleting officer", error);
    throw error;
  }
};

export const getActivityLogs = async () => {
  try {
    // get all logs from db
    const logs = await prisma.log.findMany({
      include: {
        Officer: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    let payload =
      logs.map((log) => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        fullname: log.Officer.first_name + " " + log.Officer.last_name,
      })) || [];
    return {
      status: true,
      code: 200,
      message: "Activity logs gotten successfully",
      data: payload,
    };
  } catch (error: any) {
    console.error("Error fetching Activity logs: ", error);
    throw error;
  }
};
