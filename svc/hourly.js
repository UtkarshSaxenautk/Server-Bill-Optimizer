const hourlyRepo = require('../repo/mongo/hourly')
async function checkExistenceInHourly(appliance_id) {
  // Check if the required fields are empty or null
  if (!appliance_id || appliance_id === "") {
    throw new Error('Bad Request');
  }
  try {
      const hourlyExisting = await hourlyRepo.getExistingHourly(appliance_id);
      return hourlyExisting
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
}

async function updateHourlyByMongoID(mongoID , temp) {
  // Check if the required fields are empty or null
  if (!mongoID || mongoID === "") {
    throw new Error('Bad Request');
  }
  try {
      const updatedRes = await hourlyRepo.updateByID(mongoID , temp);
      return updatedRes
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
}

async function createHourly(hourlyData) {
   
    // Create the report in the database
    try {
        const newhourly = await hourlyRepo.createHourly(hourlyData);
        console.log("hourly created : " , newhourly)
        return newhourly;
    } catch (error) {
  // Handle the error here
        console.log(error)
        error.message = "internal server error"     
     throw new Error(`Failed to create user: ${error.message}`);
    }
}

module.exports = {
    checkExistenceInHourly,
    updateHourlyByMongoID,
    createHourly

}