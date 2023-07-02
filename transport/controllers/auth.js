const userService = require('../../svc/user')
const jwt = require('jsonwebtoken');
const { cache } = require('../../repo/cache/cache');
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
  const { user_name, email , password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { user_name, password: hashedPassword , email : email };
    await userService.createUser(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to register user : ${error}` });
  }
}


async function loginUser(req, res) {
  const { user_name, password , email } = req.body;
  if ((user_name === "" || email === "") && password === "") {
     return res.status(400).json({ message: 'Bad Request' });
  } 
  try {
    const jwt = await userService.login(user_name , email , password)
    if (!jwt) {
      return res.status(401).json({ message: 'Wrong user_name or email and password' });
    }
    
    res.status(200).json({ jwt });
  } catch (error) {
      res.status(500).json({ message: `Failed to authenticate user ${error}` });
  }
}

function authenticateToken(req, res, next) {
  const jwtToken = req.body.jwt;

  if (!jwtToken) {
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  jwt.verify(jwtToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid jwtToken' });
    }

    const userId = cache.get(jwtToken);
    if (!userId) {
      return res.status(401).json({ message: 'Access denied. Invalid or expired jwtToken.' });
    }

    req.userId = userId; // Attach the user ID to the request object
    next();
  });
}





module.exports = {
  loginUser,
  authenticateToken,
  registerUser
};
