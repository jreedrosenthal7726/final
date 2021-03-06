firebase.auth().onAuthStateChanged(async function(user) {
  //Code to make a sign out button that signs out user and clears items
  if (user) {
    // Signed in
    console.log('signed in')
    document.querySelector(`.sign-in-or-sign-out`).innerHTML = `
    <button class="sign-out bg-green-500 md:w-1/8 hover:bg-green-600 text-white px-3 py-3 rounded-xl font-bold">Sign Out</button><h1>Welcome ${user.providerData[0].email}</h1>
    <form class="text-center" action="/myClosetDashboard.html">
    <button class="bg-green-500 md:w-1/8 hover:bg-green-600 text-white px-3 py-3 rounded-xl font-bold" value="Donation Centers">Take me to myCloset</button>
    </form>

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

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
