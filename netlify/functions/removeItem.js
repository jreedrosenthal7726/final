// Goal: Provide a function to add items to the closet db

// allows us to use firebase
let firebase = require(`./firebase`)

// 
exports.handler = async function(event) {
  let db = firebase.firestore()
  let itemsToDelete = event.queryStringParameters.itemIds
  //Splits the string back into an array toiterate through
  itemsToDelete = itemsToDelete.split(`,`)
  for (let i = 0; i<itemsToDelete.length; i++){
    let itemToDelete = itemsToDelete[i]
    db.collection(`myClosetItems`).doc(itemToDelete).delete()
  }
  
  //console.log(itemsToDelete)

  return {
    statusCode: 200}
  }