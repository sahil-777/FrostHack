const TOTAL_STORIES_AVAILABLE = 17;
const POINTS_PER_READING = 5;
const API_KEY = "451219b4-88ec-4d89-bad4-2dd0fce285d2";

firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const UID = user.uid
        loadStory(UID)
        updateBasicInfo()
    }
})

function loadTimer() {
    let seconds = 4 * 60; // 4 minutes
    var x = setInterval(function () {
        let min = parseInt(seconds / 60);
        let sec = parseInt(seconds % 60);
        document.getElementById("timer").innerHTML = min + "m " + sec + "s ";
        seconds--;
        if (seconds < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "Done?";
        }
    }, 1000);
}

function completedReading() {
    let val = document.getElementById('timer').innerText;
    if (val != 'Done?')
        return;

    const UID = firebase.auth().currentUser.uid;
    updateDailyPoints(UID);

}

function updateDailyPoints(UID) {
    let weekNum = getWeekNumber(new Date(getFormattedDate(new Date())));
    let d = new Date()
    let position = d.getDay();
    firebase.database().ref(`Admin/Users/${UID}/readingInfo/points/weeks/${weekNum}`).get().then(function (snapshot) {
        if (snapshot.exists()) {
            incrementDailyPoints(UID, weekNum, position);
        } else {
            firebase.database().ref(`Admin/Users/${UID}/readingInfo/points/weeks/${weekNum}`).set({
                weeklyTotalPoints: 0,
                dailyPoints: [0, 0, 0, 0, 0, 0, 0]
            })
            incrementDailyPoints(UID, weekNum, position);
        }
    });
}

function updateTotalValues(UID, weekNum) {
    incrementTotalValues(`Admin/Users/${UID}/readingInfo/points/weeks/${weekNum}/weeklyTotalPoints`, POINTS_PER_READING);
    incrementTotalValues(`Admin/Users/${UID}/readingInfo/points/totalPoints`, POINTS_PER_READING);
    incrementTotalValues(`Admin/Users/${UID}/readingInfo/storiesAlreadyRead`, 1);
}

function incrementTotalValues(path, incrementValue) {
    firebase.database().ref(`${path}`).transaction((value) => {
        if (value === null) {
            return 0;
        } else if (typeof value === 'number') {
            return value + incrementValue;
        } else {
            console.log('The count has a non-numeric value: ');
        }
    }, function (error, committed, snapshot) {
        if (error) {
            console.log('Count Increment failed abnormally!', error);
        } else if (!committed) {
            console.log('We aborted the Count Increment');
        } else {
            console.log('Total Values Incremented Successfully!');
            path = path.split('/')
            if (path[path.length - 1] == 'storiesAlreadyRead') {
                Swal.fire({
                        icon: 'success',
                        title: 'Hurray!',
                        text: `Successfully read one story! Keep reading`
                    })
                    .then(() => {
                        location.reload();
                    })
            }
        }
    });
}


function incrementDailyPoints(UID, weekNum, position) {
    firebase.database().ref(`Admin/Users/${UID}/readingInfo/points/weeks/${weekNum}/dailyPoints/${position}`).transaction((value) => {
        if (value === null) {
            return 0;
        } else if (typeof value === 'number') {
            return value + POINTS_PER_READING;
        } else {
            console.log('The count has a non-numeric value: ');
        }
    }, function (error, committed, snapshot) {
        if (error) {
            console.log('Count Increment failed abnormally!', error);
        } else if (!committed) {
            console.log('We aborted the Count Increment');
        } else {
            console.log('Daily Points Incremented Successfully!');

            updateTotalValues(UID, weekNum);
        }
    });
}

async function loadStory(UID) {
    let storyNum = getRandomIntInclusive(1, TOTAL_STORIES_AVAILABLE);
    let url = await firebase.storage().ref(`stories/${storyNum}.html`).getDownloadURL()
    document.getElementById('load-story').setAttribute('src', url);
    loadTimer()
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function searchWord() {
    let word = document.getElementById('searchWord').value;
    if (!word)
        return;

    getTheMeaningOfTheWord(word);

}

async function getTheMeaningOfTheWord(word) {
    let response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${API_KEY}`);
    const data = await response.json();
    if (!data[0].shortdef) {
        document.getElementById('word-meaning').innerHTML = 'Meaning not found'
    } else {
        let def = data[0].shortdef[0];
        if (!def)
            document.getElementById('word-meaning').innerHTML = 'Meaning not found'
        else if (def && def.length > 120)
            document.getElementById('word-meaning').innerHTML = 'Meaning not found'

        document.getElementById('word-meaning').innerHTML = def
    }
    
    setTimeout(() => {
        document.getElementById('word-meaning').innerHTML = '';
    }, 10000)
}

function errorMessage(msg = '') {
    msg = (msg == '') ? 'Something went wrong, please try again' : msg
    Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: `${msg}`
        })
        .then(() => {
            location.reload();
        })
}

