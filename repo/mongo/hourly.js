const Hourly = require("./model/hourlyreport");


async function getExistingHourly(appliance_id) {
    const exist = await Hourly.findOne({ appliance_id: appliance_id })
    console.log(exist)
    return exist;
}

async function updateByID(mongoID , temp) {
    Hourly.findByIdAndUpdate(mongoID, {$set:{usage:temp}}).then(result => {
        console.log('result', result)
        return result
    })
    return null;
}

async function createHourly(hourReportData) {
    const hourly = await Hourly.create(hourReportData);
    console.log(hourly)
    return hourly;
}


module.exports = {
    getExistingHourly,
    updateByID,
    createHourly
}