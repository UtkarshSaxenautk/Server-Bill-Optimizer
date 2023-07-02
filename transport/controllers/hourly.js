const { CheckLimit, Alternate, Recommend_by_item } = require('../../helpers/logic');
const { Hourreport } = require('../../repo/sdk/twilio');
const { createReport } = require('../../svc/hourReport');
const hourlyService = require('../../svc/hourly');
const { getUserData } = require('../../svc/user');


const sendHourlyReport = async (req, res) => {
    const userId = req.userId; // Retrieve the user ID from the request object
    var curr = new Date();
    const countHour = curr.getHours();
    const exist = await hourlyService.checkExistenceInHourly(req.body.appliance_id)
    console.log(exist)
    const userdata = await getUserData(userId)
    try {
        if (exist !== null) {
            let currusage = req.body
            console.log("curr" , currusage)
            let mongoID = exist._id
            console.log("_id : ", mongoID)
            const currUsed = parseInt(req.body.usage.power);
            const addUsage = exist.usage.power + currUsed;
            var Limit = true
            var result = CheckLimit(userdata, currusage, addUsage , currUsed)
            var flag = true 
            if (result.value) {
                console.log("Yes got it")

            }
            else {
                
                flag = false
                var curr_usage_of_all = [];
                for (let i = 0; i < userdata.appliances.length; i++){
                    const curr_id = userdata.appliances[i].appliance_id;
                    const curr_hourly_report = await hourlyService.checkExistenceInHourly(curr_id)
                    if (curr_hourly_report !== null) {
                        curr_usage_of_all.push({ "appliance_id": curr_id, "usage": curr_hourly_report.usage })
                    }
                   
                }
                //const curr = {id : req.body.id  , usage : req.body.usage}
                
                console.log("Oops")
                console.log(curr_usage_of_all)
                Limit = false
                
                
            }
            const temp = {power: addUsage , limit: Limit}
            console.log(temp ,"   "   , mongoID)
            resultUpdate = await hourlyService.updateHourlyByMongoID(mongoID , temp)
            console.log("result : " , resultUpdate , " flag : " , flag)
            // Hourly.findByIdAndUpdate(mongoID, {$set:{usage:temp}}).then(result => {
            //     console.log('result', result)
            // })
            
            if (flag === false) {
                var temp_curr = { appliance_id: req.body.appliance_id, usage: { power: addUsage, limit: Limit } }
                const alterResponse = Alternate(userdata, curr_usage_of_all, temp_curr)
                console.log("alter : " , alterResponse)
                if (alterResponse === null) {
                    console.log("Still can cover")
                    const hourReportData = {user_id : userId , hour:countHour , message:"good going please maintain use",suggestedBrands:Recommend_by_item(userdata)};
                    const newReport = await createReport(hourReportData)
                    console.log(newReport)
                    if (result.faulted) {
                        res.status(201).json({ "message": `${result.appliance} is faulted please replace it ` });
                    } else {
                        res.status(201).json({ "message": `good going please maintain use `, "recommendedItem": Recommend_by_item(userdata) });
                    }
                    
                }
                else {
                    if (alterResponse !== 0) {
                        //console.log(alterResponse.suggestion[0].name)
                        if (alterResponse.suggestion.length === 0) {
                             const hourReportData = {user_id : userId ,hour:countHour , message:"used too much try next day and save as much as possible",suggestedBrands:Recommend_by_item(userdata)};
                            const newReport = await createReport(hourReportData)
                            console.log(newReport)
                            if (result.faulted) {
                                res.status(201).json({ "message": `${result.appliance} is faulted please replace it ` });
                            }
                            else {
                                res.status(201).json({ "message": `used too much try next day and save as much as possible `, "recommendedItem": Recommend_by_item(userdata) });
                            }
                        }
                        else {
                             const hourReportData = {user_id : userId ,hour:countHour , message:`your ${alterResponse.name} took too much energy try to use given item less`,suggestedBrands:Recommend_by_item(userdata) , suggestedhour:alterResponse.suggestion};
                             const newReport = await createReport(hourReportData)
                            console.log(newReport)
                            if (result.faulted) {
                                res.status(201).json({ "message": `${result.appliance} is faulted please replace it ` });
                            } else {
                                res.status(201).json({ "message": `your ${alterResponse.name} took too much energy try to use given item less `, "suggestion_for_items_to_be_use_less": alterResponse.suggestion, "recommendedItem": Recommend_by_item(userdata) });
                            }
                        }
                    }

                    const link = `https://localhost:3030/user/report/${countHour}`
                    Hourreport(`Action needed!!! Here is your hourly report link: ${link} See to save your bill` , userdata.phone_number)
                }
            }
            else {
                const hourReportData = {user_id : userId ,hour:countHour , message:"cool",suggestedBrands:Recommend_by_item(userdata)};
                 const newReport = await createReport(hourReportData)
                console.log(newReport)
                if (result.faulted) {
                    res.status(201).json({ "message": `${result.appliance} is faulted please replace it ` });
                } else {
                    res.status(201).json({ "message": `cool`, "recommendedItem": Recommend_by_item(userdata) });
                }
            }
            
        }
        else {
            const limit = CheckLimit(userdata, req.body, req.body.usage.power, req.body.usage.power)
            
            const hourlyData = {user_id: req.userId , appliance_id: req.body.appliance_id , usage: req.body.usage , timeSent:req.body.timeSent }
            const newHourly = await hourlyService.createHourly(hourlyData);
            console.log(newHourly)
            const hourReportData = {user_id : userId ,hour:countHour , message:"Good going",suggestedBrands:Recommend_by_item(userdata)};
            const newReport = await createReport(hourReportData)
            console.log(newReport)
            if (limit.faulted) {
                res.status(201).json({ "message": `${limit.appliance} is faulted please replace it ` });
            } else {
                res.status(201).json({ "message": "Good going", "recommendedItem": Recommend_by_item(userdata) });
            }
        }   
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}


module.exports = {
    sendHourlyReport
}