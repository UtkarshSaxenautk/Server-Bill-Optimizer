const HourReport = require("./model/daily");


async function createHourReport(hourReportData) {
    const hourReport = await HourReport.create(hourReportData);
    console.log(hourReport)
    return hourReport;
}

module.exports = {
    createHourReport
}