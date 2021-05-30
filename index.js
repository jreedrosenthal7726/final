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
    // //testing out a custom form to fancy up the google maps search, might delete later
    //   let form = document.createElement('form');
    //   form.action = 'https://www.google.com/maps';
    //   form.method = 'GET';

    //   form.innerHTML = '<input name="q" value="+donation+centers">';

    //   the form must be in the document to submit it
    //   document.body.append(form);

    //   form.submit();
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
