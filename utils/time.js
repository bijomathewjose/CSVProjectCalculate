function isSameDate(dateA, dateB) {
    if (dateA == undefined || dateB === undefined) return false
    return dateA.toDateString() === dateB.toDateString()
}

function isNextWorkingDay(prevDay, currentDay) {
    if (prevDay === undefined || currentDay === undefined) return false
    if (isSameDate(getNthDay(prevDay), currentDay)) {
        return true
    }
    else if (prevDay.getDay() === 6) {
        // assume it's a Sunday and a holiday
        return isSameDate(getNthDay(prevDay, 2), currentDay)
    }
}

function getNthDay(date, n = 1) {
    if (date === undefined) return undefined
    return new Date(date.getTime() + n * (24 * 60 * 60 * 1000));
}
function setIfConsective7Days(person) {
    if (person.consectiveWorkDays >= 7) person.consective7Days = true
}
function convertToDate(string) {
    if (string === '') return undefined
    return new Date(string)
}

function getDelay(endTime, cardTime) {
    const cards = Object.keys(cardTime)

    if (cards.length === 0) return false
    else {
        const key = cards[cards.length - 1]
        const startTime = cardTime[key].outTime
        return getTimeDifference(startTime, endTime)
    }
}
function getTotalShiftWork(cardTime) {
    if (cardTime) {
        let time = 0
        const cards = Object.keys(cardTime)
        if (cards.length === 0) return false
        else {
            for (let timeTaken of cards) {
                const [hour, min] = timeTaken.split(':')
                time += hoursInMilliSeconds(parseInt(hour)) + minutesInMilliSeconds(parseInt(min))
            }
        }
        const timeObject = getTimeComponents(time)
        return (timeObject.hours > 14 || (timeObject.hours === 14 && timeObject.minutes > 0))
    }
    return false
}
function getTimeDifference(time1, time2) {
    // Parse the times into Date objects
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(time1 - time2);
    // Create an object to store the result
    const timeObject = getTimeComponents(timeDifference);
    return (timeObject.hours > 1 && timeObject.hours < 10)

}

const getTimeComponents = (time) => {
    const hours = Math.floor(time / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((time % 3600000) / 60000); // 1 minute = 60000 milliseconds
    const seconds = Math.floor((time % 60000) / 1000); // 1 second = 1000 milliseconds
    return { hours: hours, minutes: minutes, seconds: seconds }
}
function hoursInMilliSeconds(hours) {
    return hours * 60 * 60 * 1000
}
function minutesInMilliSeconds(minutes) {
    return minutes * 60 * 1000
}
export { isSameDate, isNextWorkingDay, setIfConsective7Days, convertToDate, getDelay, getTotalShiftWork }