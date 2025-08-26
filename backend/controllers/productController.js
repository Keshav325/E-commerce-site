import { sql } from '../config/db.js';

export const getProducts = async (req, res) => { 
    try {
        // Store the result of the query in a variable
        const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;

        console.log(products); 

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const createProduct = async (req, res) => { 
  const { name, image, price } = req.body;

    if (!name || !image || !price) {
        return res.status(400).json({ error: 'Name, image, and price are required' });
    }
    try{
       const newProduct = await sql`
        INSERT INTO products (name,image,price) VALUES (${name},${image},${price})
        RETURNING *;
        `
         console.log(newProduct);
        res.status(201).json({ success: true, data: newProduct[0] });

    }
    catch (error) {
        console.error(error);   }
        res.status(500).json({ error: 'Failed to create product' });
};
export const getProduct = async (req, res) => { 
    const {id } = req.params
    try {
        const product = await sql`SELECT * FROM products WHERE id = ${id}`;
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log(product);
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
export const updateProduct = async (req, res) => { 
    const { id } = req.params;
    const { name, image, price } = req.body;
    try {
        const updatedProduct = await sql`
            UPDATE products 
            SET name = ${name}, image = ${image}, price = ${price} 
            WHERE id = ${id}
            RETURNING *;
        `;

        if (updatedProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log(updatedProduct);
        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Execute DELETE and get the deleted row
        const deletedProduct = await sql`
            DELETE FROM products WHERE id = ${id} RETURNING *;
        `;

        if (deletedProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully', data: deletedProduct[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
