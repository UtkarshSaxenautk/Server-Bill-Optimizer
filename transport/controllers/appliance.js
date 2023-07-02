const applianceService = require('../../svc/applianceitem')

async function readAppliance(req, res) {
  const name =  req.params.name
  if (name === "" )  {
     return res.status(400).json({ message: 'Bad Request' });
  } 
  try {
    const appliance = await applianceService.readAppliance(name)
    if (!appliance) {
      return res.status(401).json({ message: 'Wrong appliance name' });
    }
    
    res.status(200).json({ appliance });
  } catch (error) {
      res.status(500).json({ message: `Failed to read appliance name ${name} : ${error}` });
  }
}

async function writeAppliance(req, res) {
  const applianceData = req.body;
  if (applianceData.name === "" )  {
     return res.status(400).json({ message: 'Bad Request' });
  } 
  try {
    const appliance = await applianceService.writeAppliance(applianceData)
    if (!appliance) {
      return res.status(401).json({ message: 'error in writing appliance' });
    }
    
    res.status(200).json({ appliance });
  } catch (error) {
      res.status(500).json({ message: `Failed to write appliance ${applianceData} : ${error}` });
  }
}

module.exports = {
  readAppliance,
  writeAppliance
}