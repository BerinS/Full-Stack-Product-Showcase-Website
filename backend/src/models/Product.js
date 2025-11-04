import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxLength: [100, 'Title cannot exceed 100 characters']     
    },
    content: {
      type: String,
      required: [true, 'Product content is required'],
      maxLength: [2000, 'Content cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      max: [100000, 'Price cannot exceed 100,000'],
      set: v => parseFloat(v.toFixed(2)) 
    },
    type: {
      type: String,
      trim: true,
      maxLength: 100
    },
    packaging: {
      type: String,
      trim: true,
      maxLength: 150
    },
    intensity: {
      type: String, 
      trim: true,
      maxLength: 200
    },
    taste: {
      type: String, 
      trim: true,
      maxLength: 200
    },
    box: {
      type: String, 
      trim: true,
      maxLength: 200
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  {timestamps:true}
);

// pre-save middlware
productSchema.pre('save', function(next) {
  // Basic XSS prevention for all string fields
  const stringFields = ['title', 'content', 'type', 'packaging', 'intensity', 'taste', 'box'];
  
  stringFields.forEach(field => {
    if (this[field] && typeof this[field] === 'string') {
      // Remove script tags and basic XSS vectors
      this[field] = this[field]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    }
  });
  
  // Slug generation
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;