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