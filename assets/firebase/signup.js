//updates confirmation page based on user inputs.
function confirmpage() {
    document.getElementById("Name2").innerHTML = document.getElementById('fullName').value;
    document.getElementById("email2").innerHTML = document.getElementById('email').value;
    document.getElementById("birth").innerHTML = document.getElementById('birthdate').value;
}

//Signup using email and password.
function signUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            let UID = user.uid;

            let updates = {
                details: {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    birthdate: document.getElementById('birthdate').value,
                },
                readingInfo: {
                    storiesAlreadyRead: 0,
                    points: {
                        totalPoints: 0,
                        weeks: {
                            start: getWeekNumber(new Date(getFormattedDate(new Date())))
                        }
                    }
                }
            };

            firebase.database().ref(`Admin/Users/${UID}`).set(updates)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Account created successfully !',
                    })
                    .then(() => {
                            window.location = "./read-story.html";
                        })
                })
                .catch((error) => {
                    let errorMessage = error.message;
                    Swal.fire({
                        icon: 'error',
                        title: 'Opps...',
                        message: errorMessage
                    })
                    .then(() => {
                            location.reload();
                        })
                });
        })
        .catch((error) => {
            let errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Opps...',
                message: errorMessage
            })
            .then(() => {
                    location.reload();
                })
        });
}

//To check password length and show an alert.
function checkpass() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    if (password.length < 8) {
        alert("Password length should be minimum 8 characters")
        location.reload();
    }
    else if (password != confirmPassword) {
        alert("Passwords don't match, please enter correctly")
        location.reload();
    }
}

