const User = require('../mongo/model/user')

async function checkEmailExists(email) {
    const existingUser = await User.findOne({ email });
    return existingUser !== null;
}

async function checkUsernameExists(username) {
    const existingUser = await User.findOne({ user_name: username });
    return existingUser !== null;
}

async function getUserByUsername(user_name) {
    const user = await User.findOne({ user_name });
    return user;
}

async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
}

async function getUserByUserId(userId) {
    const userData = await User.findOne({ _id : userId });
    return userData;
}

async function createUser(userData) {
    const newUser = await User.create(userData);
    console.log(newUser)
    return newUser;
}

async function updateUser(id, userData) {
  try {
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    // Handle the error here
    throw new Error(`Failed to update user: mongo error`);
  }
}



module.exports = {
    checkEmailExists,
    checkUsernameExists,
    createUser,
    getUserByUsername,
    getUserByEmail,
  updateUser,
     getUserByUserId
};
