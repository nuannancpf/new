module.exports = function(time){
    let times = new Date(parseInt(time));
    return times.getFullYear()+'-'+(times.getMonth()+1)+'-'+times.getDate()
}