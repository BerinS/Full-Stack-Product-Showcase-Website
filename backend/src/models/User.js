import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
      minLength: [2, 'First name cannot be under 2 characters'],
      maxLength: [50, 'First name cannot exceed 50 characters']
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minLength: [2, 'Last name cannot be under 2 characters'],
      maxLength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 255,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters'],
      maxLength: [300, 'Password cannot exceed 300 characters']
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;