const { SuccessMessage, Call, Alert } = require("../repo/sdk/twilio");

const Unit_price = 5.00;

const Recommend_by_item = (userdata) => {
    const recommendedItem = [];
    const included = [];
    for (let i = 0; i < userdata.appliances.length; i++) {
        if (userdata.appliances[i].name === "bulb" && included.includes(userdata.appliances[i].name) == false ) {
            recommendedItem.push({ "name": userdata.appliances[i].name, "brand": "Havells", "power": 5 })
            included.push(userdata.appliances[i].name)
        }
        if (userdata.appliances[i].name === "fan" &&included.includes(userdata.appliances[i].name) == false  ) {
            recommendedItem.push({ "name": userdata.appliances[i].name, "brand": "Orpat", "power": 40 })
            included.push(userdata.appliances[i].name)
        }
        if (userdata.appliances[i].name === "ac" &&included.includes(userdata.appliances[i].name) == false  ) {
            recommendedItem.push({ "name": userdata.appliances[i].name, "brand": "Voltas", "power": 2500 })
            included.push(userdata.appliances[i].name)
        }
        if (userdata.appliances[i].name === "tube" &&included.includes(userdata.appliances[i].name) == false  ) {
            recommendedItem.push({ "name": userdata.appliances[i].name, "brand": "Havells", "power": 25 })
            included.push(userdata.appliances[i].name)
        }
        
    }
    return recommendedItem
}
const CheckFeasibility = (userdata) => {
    let daily_power = 0 
    let total_time = 0
    for (var i = 0; i < userdata.appliances.length; i++) {
        daily_power += userdata.appliances[i].power * userdata.appliances[i].expectedhour;
        //total_time += userdata.appliances[i].expectedhour
      
    }
    console.log(daily_power);
    const power_in_month = daily_power * 30 
    const units=power_in_month/1000
    const practical_bill = units * Unit_price
    console.log(practical_bill)
    if (practical_bill - userdata.bill <= 50) {
       SuccessMessage("Congratulations! You have successfully subscribed to bill optimization!" , userdata.phone_number)
        return {"userbill" : userdata.bill , "our bill": practical_bill , "msg" : "your bill will be optimized"}
    } 
    const extra_per_day_power = (((practical_bill - userdata.bill) / Unit_price) * 1000) / 30;
    console.log(extra_per_day_power)
    const per_appliance_chnaged_needed = extra_per_day_power / userdata.total 
    const hours_appliance_should_decrease = [];
    for (var i = 0; i < userdata.appliances.length; i++) {
        var extra_hours = per_appliance_chnaged_needed / userdata.appliances[i].power;
        console.log("ex : " , extra_hours)
        hours_appliance_should_decrease.push({name : userdata.appliances[i].name , extraminutes : Math.round(extra_hours*60) , brand: userdata.appliances[i].brand })
    }
    const branddata = Recommend_by_item(userdata)
    Call()
    return { hours_appliance_should_decrease, "msg": "failed" , branddata };
}

const CheckLimit = ( userData , hourdata , total , currUsed) => {
    var total_power_of_appliance_per_day = 0;
    var limit_power = 0;
    var name;
    var fault = false;
    console.log("userdata logic chcek limit : " , userData , " hourdata : " , hourdata , " total : " , total)
    for (let i = 0; i < userData.appliances.length; i++){
        if (userData.appliances[i].appliance_id == hourdata.appliance_id) {
            limit_power += userData.appliances[i].power;
            name = userData.appliances[i].name;
            total_power_of_appliance_per_day += (userData.appliances[i].power * userData.appliances[i].expectedhour);
        }
        if (userData.appliances[i].appliance_id == hourdata.appliance_id && userData.appliances[i].power < currUsed) {
            fault = true;
            name = userData.appliances[i].name;
            break;
        }
    }
    if (fault) {
        Alert("Please check your " + name + " it is faulted" , userData.phone_number)
        return { value: false, appliance: name , faulted:true } ;
    }
    if (total > limit_power || total_power_of_appliance_per_day < hourdata.usage.power) {
        Alert("Please check your " + name + " it is taking more than expected" , userData.phone_number)
        return { value: false, appliance: name , faulted : false} ;
    }
    return { value: true, appliance: name , faulted: false } ;
}

const CheckUsage = (appliancedata, curr_usage_of_all) => {
    for (let i = 0; i < curr_usage_of_all.length; i++) {
        if (curr_usage_of_all[i].appliance_id === appliancedata.appliance_id) {
            const power = appliancedata.power *appliancedata.expectedhour;
            if (curr_usage_of_all[i].usage.power > power) {
            return false;
            }
        }
    }
    
    return true;
}

const Alternate = (userData ,curr_usage_of_all , curr_app) => {
    var curr_name;
    var curr_power;
    console.log("ud" , userData , " curr_usage alter : " ,  curr_usage_of_all," curr_app : " ,  curr_app);
    for (let i = 0; i < userData.appliances.length; i++) {
        if (userData.appliances[i].appliance_id === curr_app.appliance_id) {
            curr_name = userData.appliances[i].name;
            curr_power = userData.appliances[i].power * userData.appliances[i].expectedhour;
            break;
        }
    }
    var length = 0;
    var feasibleAppliances = [];
   
    for (let i = 0; i < userData.appliances.length; i++){
        if (userData.appliances[i].appliance_id !== curr_app.appliance_id) {
            if (CheckUsage(userData.appliances[i], curr_usage_of_all)) {
                length++;
                feasibleAppliances.push({appliance_id : userData.appliances[i].appliance_id , name: userData.appliances[i].name, power: userData.appliances[i].power });
            }
        }
    }
    var diff =  curr_app.usage.power - curr_power;
    console.log("length: " + length)
    console.log(diff)
    var temp_diff = 0;
    if (length == 0) {
        temp_diff = 0;
    } else {
        temp_diff = diff / length
    }
    console.log(temp_diff);
    
    if (diff > 0) {
        var suggest = [];
        for (let i = 0; i < feasibleAppliances.length; i++){
            const time_reduction = Math.round(temp_diff / feasibleAppliances[i].power)
             suggest.push({name: feasibleAppliances[i].name, time: `${time_reduction}hours` , id : feasibleAppliances[i].id})
        }
        return {diff : diff , name : curr_name, suggestion : suggest };
    }
    return null;
    
}

module.exports = {
    CheckFeasibility,
    CheckLimit,
    Alternate,
    Recommend_by_item
}