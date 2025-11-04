import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, user: users });
  } catch (error) {
    console.log("Error in getAllUsers", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log("Error in getAllUsers", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}

export const updateOwnProfile = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const updateFields = {};
    
    if (first_name !== undefined) updateFields.first_name = first_name;
    if (last_name !== undefined) updateFields.last_name = last_name;
    if (email !== undefined) updateFields.email = email;

    // Users can only update their own profile
    const user = await User.findByIdAndUpdate(
      req.user._id, // Use the logged-in user's ID
      { $set: updateFields },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log("Error in updateOwnProfile", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const updateAnyUser = async (req, res) => {
  try {
    const { first_name, last_name, email, role } = req.body;
    const updateFields = {};
    
    if (first_name !== undefined) updateFields.first_name = first_name;
    if (last_name !== undefined) updateFields.last_name = last_name;
    if (email !== undefined) updateFields.email = email;
    if (role !== undefined) updateFields.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log("Error in updateAnyUser", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}




