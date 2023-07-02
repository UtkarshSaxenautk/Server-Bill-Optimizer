const userRepo = require('../repo/mongo/user');
const { cache } = require('../repo/cache/cache');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CheckFeasibility } = require('../helpers/logic');
const { SuccessMessage } = require('../repo/sdk/twilio');
const tokenTTL = 36000; // 10 hours in seconds

async function createUser(userData) {
    // Check if the required fields are empty or null
    if (userData.user_name == null || userData.user_name === "" || userData.email == null || userData.email === "" || userData.password == null || userData.password === "") {
        console.log(userData)
        throw new Error("Missing important field")
    }

    // Check if the email already exists
    const emailExists = await userRepo.checkEmailExists(userData.email);
    if (emailExists) {
        throw new Error('Email already exists');
    }

    // Check if the username already exists
    const usernameExists = await userRepo.checkUsernameExists(userData.user_name);
    if (usernameExists) {
        throw new Error('Username already exists');
    }

    // Create the user in the database
    try {
        const newUser = await userRepo.createUser(userData);
        SuccessMessage("successfully signed up")
        console.log("user created : " , newUser)
  return ;
} catch (error) {
  // Handle the error here
        console.log(error)
   error.message = "internal server error"     
  throw new Error(`Failed to create user: ${error.message}`);
}
}

function generateToken(user) {
  const token = jwt.sign({ id: user._id, user_name: user.user_name }, process.env.SECRET_KEY);
  return token;
}

async function login(user_name, email , password) {
  // Check if the required fields are empty or null
  if ((!user_name && !email) || !password) {
    throw new Error('Missing username or password');
  }
    var user = null;
  // Check if the username exists
    if (user_name != null && user_name !== "") {
        try {
            user = await userRepo.getUserByUsername(user_name);
        }
        catch (error) {
            console.log("error in getting user from username : ", error)
        }
    }
   if (email != null && email !== "") {
        try {
            user = await userRepo.getUserByEmail(email);
        }
        catch (error) {
            console.log("error in getting user from email : ", error)
        }
    }
   
 
   if (!user) {
    throw new Error('Invalid username or email');
   }

  // Check if the password is correct
    try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return false
        }
    }
    catch (err) {
        throw new Error("internal server error")
        
    }
 

    const token = generateToken(user);
    cache.set(token, user._id.toString(), tokenTTL); 
  // Generate and return the authentication token
    return token;
}

async function updateUser(id, userData) {
  // Check if the required fields are empty or null
  if (!id || id === "") {
    throw new Error('Unauthorized user');
  }
  try {
    console.log("Before updating user");
    const user = await userRepo.updateUser(id, userData);
      console.log("After updating user");
     
    if (!user) {
      throw new Error("Internal server error");
    }
    console.log(user, "updated");
    return CheckFeasibility(user);
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
}

async function getUserData(id) {
  // Check if the required fields are empty or null
  if (!id || id === "") {
    throw new Error('Bad Request');
  }
  try {
    const userData = await userRepo.getUserByUserId(id);
    console.log(userData)
    return userData
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
}




module.exports = {
    createUser,
    login,
  updateUser,
    getUserData
};
