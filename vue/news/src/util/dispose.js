module.exports = function(content){
  return  content.replace(/<[^>]*?>(.*?)/gi,"")
}