
import prisma from "../prisma";
import { AppError } from "../utils/middleware/error-handler";
import { generateIDCard } from '../utils/idCard/idCardGenerator';
interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  address:string;
  DateOfBirth: Date;
  product_id: string;
  officer_id: string;
  profile_image: string;
}

export const registerCustomerService = async (payload: CustomerData) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: payload.product_id },
    });
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const officer = await prisma.officer.findUnique({
      where: { id: payload.officer_id },
    });
    if (!officer) {
      throw new AppError("Officer not found", 404);
    }

    const year = new Date().getFullYear();

    return await prisma.$transaction(async (tx) => {
      const count = await tx.customer.count({
        where: {
          customer_code: {
            startsWith: `CIS-${year}`,
          },
        },
      });

      const customerCode = generateCustomerCode(year, count + 1);
      let now = new Date();
      
      const data = {
        ...payload,
        is_active: true,
        customer_code: customerCode,
        last_visit: new Date(),
        expiry_date: new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        ),
      };

      let customer;
      try {
        customer = await tx.customer.create({
          data: data,
        });

        await tx.log.create({
          data: {
            officer_id: officer.id,
            action: `Registered_customer_${customer.customer_code}`
          }
        });

        // Generate ID Card PDF
        const idCardData = {
          id: customer.id,
          fullname: `${customer.first_name} ${customer.last_name}`,
          email: customer.email,
          phone: customer.phone,
          customerCode: customer.customer_code,
          dateOfBirth: customer.DateOfBirth,
          address: customer.address,
          registration_date: customer.created_at,
          expiry_date: customer.expiry_date,
          product: {
            name: product.product_name,
            price: product.price,
          },
          officer: {
            name: officer.username,
          }
        };
        
        const idCardPath = await generateIDCard(idCardData);

        // update id card path to customer record
        await tx.customer.update({
          where: { id: customer.id },
          data: { id_card: idCardPath },
        });

        return {
          success: true,
          message: "Customer created successfully",
          code: 201,
          data: {
            id: customer.id,
            fullname: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone: customer.phone,
            customerCode: customer.customer_code,
            dateOfBirth: customer.DateOfBirth,
            address: customer.address,
            last_visit: customer.last_visit,
            registration_date: customer.created_at,
            expiry_date: customer.expiry_date,
            is_active: customer.is_active,
            idCardPath: idCardPath, // Add the PDF path
            product: {
              id: product.id,
              name: product.product_name,
              price: product.price,
            },
            officer: {
              id: officer.id,
              name: officer.username,
            },
          },
        };
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new AppError("Customer already exists", 409);
        }
        throw error;
      }
    });
  } catch (error: any) {
    console.error("Error creating customer: ", error);
    throw error;
  }
};

export const getAllCustomersService = async () => {
  try {
    // this is a batch get for customers
    const customers = await prisma.customer.findMany({
      include:{
        product:{
          select:{
            product_name:true
          }
        }
      }
    });
    return {
      status: true,
      code:200,
      message: "Customers details gotten successfully",
      data: customers,
    };
  } catch (error: any) {
    console.error("Error getting all customers: ", error);
    throw error;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    // get customer by id
    const customer = await prisma.customer.findUnique({
      where: { id: id },
      include: {
        product: {
          select: {
            product_name: true,
            price: true
          }
        },
        officer: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      }
    });
    if(!customer){
      throw new AppError("Customer not found", 404);
    }
    return {
      status: true,
      code: 200,
      message: "Customer details gotten successfully",
      data: customer,
    };
  } catch (error: any) {
    console.error("Error getting customer: ", error);
    throw error;
  }
};
export const renewCustomerService = async (
  customer_id: string,
  product_id: string,
  officer_id: string
) => {
  // renew the product or change product for a customer
  try {
    //   find the product using id
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    // get the officer using id
    const officer = await prisma.officer.findUnique({
      where: { id: officer_id },
    });
    if (!officer) {
      throw new AppError("Officer not found", 404);
    }
    // find the customer first
    const customer = await prisma.customer.findUnique({
      where: { id: customer_id },
    });
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    // calculate expiry date
    let now = new Date();
    // either from today or from now
    let baseDate = customer.expiry_date ?? now;
    let new_expiry = new Date(baseDate);
    new_expiry.setFullYear(new_expiry.getFullYear()+1)
    // update customer, renewal table and logs
    return await prisma.$transaction(async (tx) => {
      // update customer in the customer table
      const updatedCustomer = await tx.customer.update({
        where: { id: customer_id },
        data: {
          expiry_date: new_expiry,
          is_active: true,
          product_id: product_id,
        },
      });
      // update customer renewal table
      const updateRenewal = await tx.customerRenewal.create({
        data: {
          customer_id: updatedCustomer.id,
          product_id: product.id,
          renewed_by: officer.id,
        },
      });
      // add action to the log table
      const log = await tx.log.create({
        data: {
          officer_id: officer.id,
          action: `Renew_Customer_Product ${customer.customer_code}`,
        },
      });
      // return success message
      return {
        status: true,
        message: "Customer product renewed successfully",
        code: 200,
        data: {
          id: updatedCustomer.id,
          fullname: `${updatedCustomer.first_name} ${updatedCustomer.last_name}`,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          customerCode: updatedCustomer.customer_code,
          dateOfBirth: updatedCustomer.DateOfBirth,
          last_visit: updatedCustomer.last_visit,
          registration_date: updatedCustomer.created_at,
          expiry_date: updatedCustomer.expiry_date,
          is_active: updatedCustomer.is_active,
          product: {
            id: product.id,
            name: product.product_name,
            price: product.price,
          },
          officer: {
            id: officer.id,
            name: officer.username,
          },
        },
      };
    });
  } catch (error: any) {
    console.error("Error updating customer details: ", error);
    throw error;
  }
};

export const deleteCustomerService = async (id: string, officer_id: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // check if product exists
      const customer = tx.customer.findUnique({
        where: { id: id },
      });
      if (!customer) {
        return {
          success: false,
          code: 404,
          message: "Customer not found",
        };
      }
      // delete customer
      const deleteCustomer = await tx.customer.delete({
        where: { id: id },
      });
      // log action
      await tx.log.create({
        data: {
          officer_id: officer_id,
          action: `Deleted_customer_${deleteCustomer.first_name} ${deleteCustomer.last_name}`,
        },
      });

      return {
        status: true,
        code: 200,
        message: "Customer deleted successfully",
      };
    });
  } catch (error: any) {
    console.error("An error occured while deleting customer: ", error);
    throw error;
  }
};

// Service to get customer statistics
export const getCustomerStatisticsService = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const [
    total,
    active,
    expired,
    registeredThisMonth,
    expiringThisWeek,
    expiringThisMonth
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { is_active: true } }),
    prisma.customer.count({ where: { is_active: false } }),
    prisma.customer.count({ where: { created_at: { gte: startOfMonth, lte: endOfMonth } } }),
    prisma.customer.count({ where: { expiry_date: { gte: startOfWeek, lte: endOfWeek } } }),
    prisma.customer.count({ where: { expiry_date: { gte: startOfMonth, lte: endOfMonth } } })
  ]);

  return {
    status: true,
    code: 200,
    message: "Customer statistics fetched successfully",
    data: {
      total_customers: total,
      active_customers: active,
      expired_customers: expired,
      registered_this_month: registeredThisMonth,
      expiring_this_week: expiringThisWeek,
      expiring_this_month: expiringThisMonth
    }
  };
};
function calculateAge(dob: Date) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

function generateCustomerCode(year: number, sequence: number) {
  return `CIS-${year}-${sequence.toString().padStart(5, "0")}`;
}
