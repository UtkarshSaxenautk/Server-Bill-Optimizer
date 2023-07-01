const applianceRepo = require('../repo/mongo/appliance')

async function readAppliance(applianceName) {
  // Check if the required fields are empty or null
  if (!applianceName || applianceName === "") {
    throw new Error('Invalid request');
  }
  try {
    
    const appliance = await applianceRepo.readAppliance(applianceName);
    console.log("appliance : " , appliance);
    if (!appliance) {
      throw new Error("Internal server error");
    }
    return appliance;
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
}

async function writeAppliance(applianceData) {
  // Check if the required fields are empty or null
  if (!applianceData.name === "") {
    throw new Error('Invalid request');
  }
   try {
        const appliance = await applianceRepo.writeAppliance(applianceData);
        console.log("applaince created : " , appliance)
  return "sucess";
} catch (error) {
  // Handle the error here
        console.log(error)
   error.message = "internal server error"     
  throw new Error(`Failed to create appliance: ${error.message}`);
}
}

module.exports = {
    readAppliance,
    writeAppliance
}


