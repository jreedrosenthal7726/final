// Goal: Provide a function to add items to the closet db

// allows us to use firebase
let firebase = require(`./firebase`)

// 
exports.handler = async function(event) {

  // get the querystring parameters and store in memory
  let userId = event.queryStringParameters.userId
  let item = event.queryStringParameters.item
  let buyDate = event.queryStringParameters.buyDate
  let purchasePrice = event.queryStringParameters.purchasePrice

  if (typeof purchasePrice != 'number') {
    console.log(`NaN Converting`)
    // This is a regular expression to convert currency to integer to store in DB; if someone adds $120 rather than just 120
    purchasePrice = Number(purchasePrice.replace(/[^0-9.-]+/g,""))
  }
  //convert string date to date type
  buyDate = new Date(buyDate)
  
  // establish a connection to firebase in memory
  let db = firebase.firestore()

  // add a new item to the closet in the firebase db, wait for it to return
  await db.collection('myClosetItems').add({
    userId: userId,
    item: item,
    purchasePrice: purchasePrice,
    buyDate: buyDate
  })

  return {
    statusCode: 200}
  }