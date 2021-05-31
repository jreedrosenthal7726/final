firebase.auth().onAuthStateChanged(async function(user) {
  //Code to make a sign out button that signs out user and clears items
  if (user) {
    // Signed in
    console.log('signed in')
    document.querySelector(`.sign-in-or-sign-out`).innerHTML = `
    <button class="sign-out bg-green-500 flex:md hover:bg-green-600 text-white px-3 py-3 rounded-xl font-bold">Sign Out</button><h1>Welcome ${user.providerData[0].email}</h1>
    `
    //reference to signout button
    let signOutButton = document.querySelector(`.sign-out`)
    console.log(signOutButton)
    //handle click event to sign out
    signOutButton.addEventListener(`click`, function(event){
      //sign out user
      firebase.auth().signOut()
      //redirect use to home page
      document.location.href = `index.html`
    })
    
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
    // getItemsButton.addEventListener(`click`, async function(event){
      
      //get user items from db
      let userItemsResponse = await fetch(getItemsUrl)
      let userItemsJson = await userItemsResponse.json()
      //log length of user items list to console
      //console.log(userItemsJson.length)

      //add the heading for the "closet contents table" to the items div, include a class in the table for later reference called "closet"
      itemsDiv.insertAdjacentHTML(`beforeend`,`
        <table class="border-4 border-black m-8 text-3xl text-black-500">
            <tr class="border-2">
              <th></th>
              <th>Item</th>
              <th>Price</th>
              <th>Date Purchased</th>
            </tr>
            <tr class="border-2 border-black m-8 text-3xl text-black-500 closet">
            </tr>
        </table>
      `)

      //grab reference to the table row in the items table to add db items to in the next loop step
      let tableDiv = document.querySelector(`.closet`)
      //Define variable for total value of closet
      let totalValue = 0
      //iterate through items and write to DOM in the "closet" <tr> from table above
      for (let i=0;i<userItemsJson.length; i++){
        let itemId = userItemsJson[i].id
        let item = userItemsJson[i].item
        let buyDate = userItemsJson[i].buyDate
        let purchasePrice = userItemsJson[i].purchasePrice
        totalValue += purchasePrice
        //console.log(itemId)
        tableDiv.insertAdjacentHTML(`afterend`,`
          <td class="border-2"><input type="checkbox" class="selectItemCheckBox" name="${itemId}">
          <td class="border-2">${item}</td>
          <td class="border-2">$${purchasePrice}</td>
          <td class="border-2">${buyDate}</td>
        `)
      }
    //Display total value of closet and total number of items in readable text 
    let itemSummaryDiv = document.querySelector(`.itemSummary`)
    itemSummaryDiv.insertAdjacentHTML(`afterend`,`
    <div class="flex justify-center font-bold text-4xl">
      You have ${userItemsJson.length} items in your closet. In total, your closet is worth $${totalValue}. 
    </div>
    `)

    //get reference to button to add items
    let addItemsButton = document.querySelector(`#addItemButton`)
    //event listener for click to get items
    addItemsButton.addEventListener(`click`, async function(event){
      // get a reference to the newly created item field inputs
      let itemInput = document.querySelector(`#addItem`)
      let priceInput = document.querySelector(`#purchasePrice`)
      let buyDateInput = document.querySelector(`#buyDate`)
      // get the input from the fields
      let itemBody = itemInput.value
      let priceBody = priceInput.value
      let buyDateBody = buyDateInput.value
      // Build the URL for our posts API
      let url = `/.netlify/functions/addItem?userId=${userId}&item=${itemBody}&purchasePrice=${priceBody}&buyDate=${buyDateBody}`
      // Fetch the url, wait for a response, store the response in memory
      let response = await fetch(url)
      // refresh the page
      location.reload()
    })

    //get a reference to the delete button
    let deleteButton = document.querySelector(`#deleteButton`)
    deleteButton.addEventListener(`click`, async function(event){
      event.preventDefault()
      //gets all checked checkboxes on the forms in the closet table
      let checkBoxes = document.querySelectorAll(`.selectItemCheckBox`)
      let checkedBoxes = []
      //iterate through checkboxes to see if they are checked and if so, add them to an array
      for (let chb=0;chb<checkBoxes.length;chb++){
        checkBox = checkBoxes[chb]
        if (checkBox.checked){
          checkedBoxes.push(checkBox.name)
          console.log(checkBox) 
        }
      }
      
      //stringify the array to pass through URL
      let CheckedBoxesString = checkedBoxes.toString()
      console.log(CheckedBoxesString)


      let deleteItemsUrl = `/.netlify/functions/removeItem?itemIds=${CheckedBoxesString}`
      await fetch(deleteItemsUrl)
      // refresh the page
      location.reload()
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
      signInSuccessUrl: 'myClosetDashboard.html'
    }

    //Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
