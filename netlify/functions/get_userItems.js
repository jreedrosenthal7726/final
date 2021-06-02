let firebase = require('./firebase')

exports.handler = async function(event) {
  let returnValue = [] // sample only...
  //reference userId to pull all items for logged in user
  let userId = event.queryStringParameters.userId
  let status = event.queryStringParameters.status
  console.log(status)
  //instantiate db
  let db = firebase.firestore()
  if (status == `currentItems`){
    //query db for all items for user
    let itemsQuery = await db.collection("myClosetItems").where("userId", "==", userId).get()
    //retreive the documents from the query
    let items = itemsQuery.docs
    //console.log(items)

    for (let i = 0; i<items.length;i++){
      //get data from indexed item
      let itemData = items[i].data()
      let itemId = items[i].id
      let dateTemp = new Date(itemData.buyDate.seconds * 1000)
      let dateString = dateTemp.toDateString()
      //console.log(dateTemp)
      //create item object
      let itemObject = {
        id: itemId,
        buyDate: dateString,
        item: itemData.item,
        purchasePrice: itemData.purchasePrice
      }
      //console.log(itemObject)
      //fill return array
      returnValue.push(itemObject)
    }
  } else {
    //query db for all items for user
    let itemsQuery = await db.collection("myClosetSalvagedItems").where("userId", "==", userId).get()
    //retreive the documents from the query
    let items = itemsQuery.docs
    //console.log(items)

    for (let i = 0; i<items.length;i++){
      //get data from indexed item
      let itemData = items[i].data()
      let itemId = items[i].id
      let buyDateTemp = new Date(itemData.buyDate.seconds * 1000)
      let buyDateString = buyDateTemp.toDateString()
      let salvageDateTemp = new Date(itemData.buyDate.seconds * 1000)
      let salvageDateString = salvageDateTemp.toDateString()
      //console.log(dateTemp)
      //create item object
      let itemObject = {
        id: itemId,
        buyDate: buyDateString,
        salvageDate: salvageDateString,
        item: itemData.item,
        purchasePrice: itemData.purchasePrice
      }
      //console.log(itemObject)
      //fill return array
      returnValue.push(itemObject)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(returnValue)
  }
}