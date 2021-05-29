firebase.auth().onAuthStateChanged(async function(user) {
  //Code to make a sign out button that signs out user clears items
  if (user) {
    // Signed in
    console.log('signed in')
    document.querySelector(`.sign-in-or-sign-out`).innerHTML = `
    <button class="text-pink-500 underline sign-out">Sign Out</button>
    `
    //refer to signout button
    let signOutButton = document.querySelector(`.sign-out`)
    //handle click event to sign out
    signOutButton.addEventListener(`click`, function(event){
      //sign out user
      firebase.auth().signOut()
      //redirect use to home page
      document.location.href = `index.html`
    })

    //until we get the redirection authenitcation worked out I am going to keep coding here and we can just copy this over
    //get user id
    let userId = user.uid
    //get button to show items
    let getItemsButton = document.querySelector(`#showItems`)
    //create the url to get all items
    let getItemsUrl = `/.netlify/functions/get_userItems?userId=${userId}`
    //reference the items Div
    let itemsDiv = document.querySelector(`.items`)
    //console.log(getItemsUrl)

    //event listener for click to get items
    getItemsButton.addEventListener(`click`, async function(event){
      
      //get user items from db
      let userItemsResponse = await fetch(getItemsUrl)
      let userItemsJson = await userItemsResponse.json()
      //log length of user items list to console
      console.log(userItemsJson.length)

      //add the heading for the "closet contents table" to the items div, include a class in the table for later reference called "closet"
      itemsDiv.insertAdjacentHTML(`beforeend`,`
      <div class="flex justify-center">
          <table class="border-4 border-black m-8 text-3xl text-black-500">
              <tr class="border-2">
                <th>Item</th>
                <th>Price</th>
                <th>Date Purchased</th>
              </tr>
              <tr class="border-2 border-black m-8 text-3xl text-black-500 closet">
              </tr>
          </table>
        </div>  
      `)
      //grab reference to the table row in the items table to add db items to in the next loop step
      let tableDiv = document.querySelector(`.closet`)
      //Define variable for total value of closet
      let totalValue = 0
      //iterate through items and write to DOM in the "closet" <tr> from table above
      for (let i=0;i<userItemsJson.length; i++){
        let item = userItemsJson[i].item
        let buyDate = userItemsJson[i].buyDate
        let purchasePrice = userItemsJson[i].purchasePrice
        totalValue = totalValue + purchasePrice
        console.log(item)
        tableDiv.insertAdjacentHTML(`afterend`,`
        <div class="flex justify-center">
          <table class="border-4 border-black m-8 text-3xl text-black-500">
            <tr class="border-2">
                <td class="border-2">${item}</td>
                <td class="border-2">$${purchasePrice}</td>
                <td class="border-2">${buyDate}</td>
            </tr>
          </table>
        </div>  
        `)
      }
    //Display total value of closet and total number of items in readable text after items div
    itemsDiv.insertAdjacentHTML(`afterend`,`
    <div>
      You have ${userItemsJson.length} items in your closet. In total, your closet is worth $${totalValue}.
    </div>
    `)

    })
   

  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'addOrCheckCloset.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
