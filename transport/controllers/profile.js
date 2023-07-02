const userService = require('../../svc/user')

async function updateUserProfile(req, res) {
  const userId = req.userId; // Retrieve the user ID from the request object
  const updatedData = req.body; // Retrieve the updated data from the request body

  try {
    const updatedUser = await userService.updateUser(userId, updatedData);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found or internal error' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user profile' });
  }
}

async function sendHourlyUpdate(req, res) {

}

module.exports = {
  updateUserProfile,
};