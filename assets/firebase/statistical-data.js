firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const UID = user.uid;
        const snapshot = await firebase.database().ref(`Admin/Users/${UID}/readingInfo`).once('value')
        const data = snapshot.val()
        updateStatistics(data)
        updateChart(data)
        updateBasicInfo()
    }
})

function updateStatistics(data) {
    let storiesCount = 0,
        totalPoints = 0,
        totalPointsCurrentWeek = 0,
        totalPointsPreviousWeek = 0;

    let currentWeekNum = getWeekNumber(new Date(getFormattedDate(new Date()))),
        previousWeek = currentWeekNum - 1;

    if (data.storiesAlreadyRead)
        storiesCount = data.storiesAlreadyRead;

    totalPoints = data.points.totalPoints

    if (data.points.weeks[currentWeekNum])
        totalPointsCurrentWeek = data.points.weeks[currentWeekNum].weeklyTotalPoints
    if (data.points.weeks[previousWeek])
        totalPointsPreviousWeek = data.points.weeks[previousWeek].weeklyTotalPoints

    document.getElementById('totalStories').innerHTML = storiesCount;
    document.getElementById('totalPoints').innerHTML = totalPoints;
    document.getElementById('totalPointsCurrentWeek').innerHTML = totalPointsCurrentWeek;
    document.getElementById('totalPointsPreviousWeek').innerHTML = totalPointsPreviousWeek;
}

/**
 * Points Per Day of Current Week, from [Sun, Mon,... , Sat]
 * Current WeekNumber is calculated from current date 
 * @returns {Array} Points per day of week, 0th pos:Sunday, ..., 6th pos:Saturday
 */
async function getPointsPerDayOfWeek(data, weekNum = 0) {
    let currentWeekNum = getWeekNumber(new Date(getFormattedDate(new Date())))
    let targetWeekNum = currentWeekNum - weekNum
    let points = [0, 0, 0, 0, 0, 0, 0]
    if (data.points.weeks[targetWeekNum])
        points = data.points.weeks[targetWeekNum].dailyPoints
        
    return points
}

async function updateChart(data) {
    var countThisWeek = await getPointsPerDayOfWeek(data, 0)
    var countLastWeek = await getPointsPerDayOfWeek(data, 1)
    var updatingChart = $.HSCore.components.HSChartJS.init($('#updatingData'));
    updatingChart.data.datasets[0].data = countLastWeek
    updatingChart.data.datasets[1].data = countThisWeek
    updatingChart.update();

    const totalThisWeek = countThisWeek.reduce((a, b) => a + b, 0)
    const totalLastWeek = countLastWeek.reduce((a, b) => a + b, 0)
    const increasePercentage = Math.ceil((totalThisWeek - totalLastWeek) * 100 / totalLastWeek)

    const countTrend = document.getElementById("countTrend")
    if (increasePercentage > 0) {
        countTrend.classList.add("text-success");
        countTrend.classList.remove("text-danger");
        countTrend.innerHTML = `<i class="tio-trending-up"></i> ${increasePercentage}%`
    } else {
        countTrend.classList.remove("text-success");
        countTrend.classList.add("text-danger");
        countTrend.innerHTML = `<i class="tio-trending-down"></i> ${increasePercentage}%`
    }
}


