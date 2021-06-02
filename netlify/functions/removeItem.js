// Goal: Provide a function to add items to the closet db
let fetch = require('node-fetch')
// allows us to use firebase
let firebase = require(`./firebase`)
// 
exports.handler = async function(event) {
  let db = firebase.firestore()
  let itemsToDelete = event.queryStringParameters.itemIds
  let userId = event.queryStringParameters.userId
  let baseUrl = event.queryStringParameters.baseUrl

  //Splits the string back into an array toiterate through
  itemsToDelete = itemsToDelete.split(`,`)
  for (let i = 0; i<itemsToDelete.length; i++){
    let itemToDelete = itemsToDelete[i]
    let salvagedItem = await db.collection(`myClosetItems`).doc(itemToDelete).get()
    let collection = `myClosetSalvagedItems`
    let itemData = salvagedItem.data()
    let item = itemData.item
    let salvagePrice = itemData.purchasePrice
    let buyDate = itemData.buyDate.seconds 
    let url = new URL(`/.netlify/functions/addItem?userId=${userId}&item=${item}&purchasePrice=${salvagePrice}&buyDate=${buyDate}&collection=${collection}`, baseUrl)
    // let url = `/addItem?userId=${userId}&item=${item}&purchasePrice=${salvagePrice}&buyDate=${buyDate}&collection=${collection}`
    // console.log(url)
    await fetch(url)
    db.collection(`myClosetItems`).doc(itemToDelete).delete()
  }

  
  //console.log(itemsToDelete)

  return {
    statusCode: 200}
  }