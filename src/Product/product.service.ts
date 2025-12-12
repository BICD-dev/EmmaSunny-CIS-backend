
// create product function
export const createProduct = async (productData: any): Promise<any> => {
    // validate missing fields
    const { name, price, description } = productData;
    if (!name || !price) {
        throw new Error('Name and price are required to create a product.');
    }
    // add product to database
    