//updates confirmation page based on user inputs.
function confirmpage() {
    // First Page
    console.log(document.getElementById('fullName').value);
    document.getElementById("Name2").innerHTML = document.getElementById('fullName').value;
    document.getElementById("email2").innerHTML = document.getElementById('email').value;

    console.log(document.getElementById('birthdate').value)
    document.getElementById("birth").innerHTML = document.getElementById('birthdate').value;

}

//Signup using secondary authentication. 
//Signup using email and password.
function signUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        var UID = user.uid;

        user.sendEmailVerification().then(function(){
            console.log("Verification Email sent to user");
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
        
        var updates = {
            details: {
                Name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                BirthDate: document.getElementById('birthdate').value,
            },
            readinginfo: {
                storiesAlreadyRead: '',
                points:{
                    totalPoints:0,
                    weeks: {start: getWeekNumber(new Date(getFormattedDate(new Date())))}
                }
            }
        };

        firebase.database().ref(`Admin/Users/${UID}`).set(updates)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Your Account created Successfully !',
                message: 'Your Account created Successfully !'
              }).then(
                () => { 
                    window.location = "./read-story.html" ;
                 }
              )
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            swal(errorMessage);
        });
        // $('#successMessageContent').show();
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        swal(errorMessage)
        // $('#failureMessageContent').show();
    });
}

//To check password length and show an alert.
function checkpass()
{
    var password =  document.getElementById('password').value;
    var confirmPassword =  document.getElementById('confirmPassword').value;
    if (password.length<8) {
        swal("Password length should be minimum 8 characters")
        location.reload();
    }
    if (password != confirmPassword) {
        swal("Passwords don't match, please try again!")
        location.reload();
    }
}

