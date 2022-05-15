// jsshift esversion:12

function curDate(){
    var options = {
        weekday:'long',
        // year:'numeric',
        month:'long',
        day:'numeric'
    };
    
    var today = new Date;
    return today.toLocaleDateString("en-IN",options);
}
function curDay(){
    var options = {
        weekday:'long',
        // year:'numeric',
        // month:'long',
        // day:'numeric'
    };
    
    var today = new Date;
    return today.toLocaleDateString("en-IN",options);
}
exports.getDate = curDate;
module.exports.getDay  = curDay;