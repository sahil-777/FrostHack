firebase.auth().onAuthStateChanged( async (user) => {
    if(user){
        updateBasicInfo()
    }
})
 

 