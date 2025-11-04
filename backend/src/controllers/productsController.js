import Product from "../models/Product.js";
import mongoose from "mongoose";

// Get all products
export async function getAllProducts(_, res){
  try {
    const products = await Product.find();
    res.status(200).json({success: true , products});
  } catch (error) {
    console.log("Error in getAllProducts", error);
    res.status(500).json({message:"Internal server error"});
  }
}

// Get product by ID
export async function getProductById(req, res) {
  try {
    let product;

    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    } else {
      // If not ObjectId, treat it as a slug
      product = await Product.findOne({ slug: req.params.id });
    }

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.log("Error in getProductById", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}

// Create Product 
export async function createProduct(req, res) {
  try {
    const { title, content, price, type, packaging, intensity, taste, box } = req.body;

    if (!title || !content || !price) {
      return res.status(400).json({ 
        message: "Title, content and price are required" 
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        message: "Price invalid" 
      });
    }

    const newProduct = new Product({
      title: title,
      content: content,
      price: price,
      type: type || "",        
      packaging: packaging || "",      
      intensity: intensity || "",
      taste: taste || "",
      box: box || "",
      // slug  auto-generated 
    });

    await newProduct.save();
    res.status(201).json({success: true, message: "Product created successfully", product: newProduct});
  } catch (error) {
    console.log("Error in createProduct", error);
    
    //  duplicate slug error if title already exists
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "A product with this title already exists" 
      });
    }
    
    res.status(500).json({message: "Internal server error"});
  }
}

// Update product
export async function updateProduct(req, res){
  try {
    const { title, content, price, type, packaging, intensity, taste, box } = req.body;

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({message: "Product not found"});
    }

    // Data check
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (price !== undefined) {
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber < 0) {
        return res.status(400).json({ message: "Price invalid" });
      }
      updateData.price = priceNumber;
    }
    if (type !== undefined) updateData.type = type;
    if (packaging !== undefined) updateData.packaging = packaging;
    if (intensity !== undefined) updateData.intensity = intensity;
    if (taste !== undefined) updateData.taste = taste;
    if (box !== undefined) updateData.box = box;

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return updated document and run validators
    );

    res.status(200).json({success: true,updateData});
    
  } catch (error) {
    console.log("Error in updateProduct", error);
    res.status(500).json({message: "Internal server error"})
  }
}

// Delete product
export async function deleteProductById(req, res){
  try {

    //Check if product exists
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct){
      return res.status(404).json({message:"Product not found"});
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: {
        id: deletedProduct._id,
        title: deletedProduct.title,
        price: deletedProduct.price,
        type: deletedProduct.type
      }
    });

  } catch (error) {
    console.log("Error in deleteProductById", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid product ID format" 
      });
    }
    
    res.status(500).json({message: "Internal server error"});
  }
}