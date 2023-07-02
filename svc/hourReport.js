const { createHourReport } = require("../repo/mongo/hourReport");


async function createReport(reportData) {
   
    // Create the report in the database
    try {
        const newReport = await createHourReport(reportData);
        console.log("report created : " , reportData)
        return newReport;
    } catch (error) {
  // Handle the error here
        console.log(error)
        error.message = "internal server error"     
     throw new Error(`Failed to create user: ${error.message}`);
    }
}


module.exports = {
    createReport
}