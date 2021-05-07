async function test(){
    let snapshot = await firebase.database().ref('/').once('value');
    if(snapshot.exists()){
        console.log(snapshot.val());
    }
    else{
        console.log('Something bad happen');
    }
}