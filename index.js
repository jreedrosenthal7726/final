firebase.auth().onAuthStateChanged(async function(user) {
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

    //until we get the redirection authenitcation worked out I am going to  keep coding here and we can just copy this over
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
      //get user items
      let userItemsResponse = await fetch(getItemsUrl)
      let userItemsJson = await userItemsResponse.json()
      console.log(userItemsJson.length)
      //iterate through items and write to DOM
      for (let i=0;i<userItemsJson.length; i++){
        let item = userItemsJson[i].item
        let buyDate = userItemsJson[i].buyDate
        let purchasePrice = userItemsJson[i].purchasePrice
        console.log(item)
        itemsDiv.insertAdjacentHTML(`beforeend`,`
          <div class="md:mt-16 mt-8"><span>${item}</span></div>
          <div class="md:mt-16 mt-8"><span>${buyDate}</span></div>
          <div class="md:mt-16 mt-8"><span>${purchasePrice}</span></div>
        `)
      }
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
