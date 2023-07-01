const Appliance = require('./model/item.js');

async function readAppliance(name) {
    const appliance = await Appliance.find({ name: name });
    console.log(appliance)
    return appliance;
}

async function writeAppliance(applianceData) {
    const appliance = new Appliance(applianceData)
    try {
       await appliance.save()
    }
    catch (error) {
        throw new Error("mongo internal error")
    }
}

module.exports = {
    readAppliance,
    writeAppliance
};