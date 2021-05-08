const firebaseConfig = {
  apiKey: "AIzaSyBIs_edcOn7UdogIcIoIIy6Opg_oHq9jmY",
  authDomain: "frosthack2021.firebaseapp.com",
  databaseURL: "https://frosthack2021-default-rtdb.firebaseio.com",
  projectId: "frosthack2021",
  storageBucket: "frosthack2021.appspot.com",
  messagingSenderId: "24481618378",
  appId: "1:24481618378:web:8b1b643c57bab62a321733"
};

firebase.initializeApp(firebaseConfig);

const authPages = ['login', 'forgot-password','signup']

firebase.auth().onAuthStateChanged((user) => {
    var currentPage = window.location.pathname.split('/')
    var currentPage = currentPage[currentPage.length-1].split('.')[0]
    if(!user && !authPages.includes(currentPage)) {
      // User is NOT signed in
      window.location.href = './auth/login.html'
    }
});  

function login(){
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      window.location = "../read-story.html" ;
      console.log(user);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${errorCode} ${errorMessage}`,
        }).then(
          () => { location.reload() }
        )
    });

    // Update the button description after click
    const button = document.getElementById('loginButton')
    button.disabled = true
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
}

function logout(){
  firebase.auth().signOut().then(() => {
    window.location.href='./auth/login.html';
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(`${errorCode} ${errorMessage}`)
  });
}
 
