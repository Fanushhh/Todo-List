
exports.getDate =  function(){

const today = new Date(); // creates a new object called date
// provides certain criteria for our display of the date, such as weekday should be displayed as a long text e.g(Friday, instead of numeric which would be 02,03,etc.)
const options = {
  weekday: "long",
  month: "long",
  day: "numeric",
}
//this calls the method toLocaleDateString to get the date information, in the format en-GB with the options requested above, so we should have something like Friday, 03 June 2022
return today.toLocaleDateString("en-GB", options);

}
exports.getDay  = function(){

const today = new Date(); // creates a new object called date
// provides certain criteria for our display of the date, such as weekday should be displayed as a long text e.g(Friday, instead of numeric which would be 02,03,etc.)
const options = {
  weekday: "long"
}
//this returns the method toLocaleDateString to get the date information, in the format en-GB with the options requested above, so we should have something like Friday, 03 June 2022
return today.toLocaleDateString("en-GB", options);
}
console.log(module.exports);
