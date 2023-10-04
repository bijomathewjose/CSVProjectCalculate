import { isSameDate, isNextWorkingDay, setIfConsective7Days, getDelay, getTotalShiftWork } from './time.js'

function generateLogPerPerson(data) {
    const logs = {}
    for (let shift of data) {

        logs[shift.posId] ??= { name: shift.empName, file: shift.file }
        const person = logs[shift.posId]
        person.prevDay ??= shift.inTime
        person.consectiveWorkDays ??= 1
        person.maxWorkDays ??= 0
        person.workDays ??= {}
        person.workDays ??= []
        if (shift.inTime) {
            person.workDays[shift.inTime.toDateString()] ??= { cardTime: {} }
            const cardTime = person.workDays[shift.inTime.toDateString()].cardTime
            cardTime[shift.cardTime] = { inTime: shift.inTime, outTime: shift.outTime }
            if (getDelay(shift.inTime, cardTime, person))
                person.hasShiftDifferenceGreaterThan1andLessThan10 = true
            if (!(isSameDate(person.prevDay, shift.inTime))) {
                if (getTotalShiftWork(cardTime))
                    person.hasShiftGreaterThan14Hours = true
                if (isNextWorkingDay(person.prevDay, shift.inTime)) {
                    person.consectiveWorkDays += 1
                    setIfConsective7Days(person)
                }
                else {
                    person.consectiveWorkDays = 1
                }
            }
            person.maxWorkDays = Math.max(person.maxWorkDays, person.consectiveWorkDays)
            person.prevDay = shift.inTime
        }
    }
    return logs
}

export function filterRequiredData(data) {
    const inter1 = Object.entries(data).map(([key, person]) => {
        const value = {
            name: person.name,
            position: key
        }
        // assuming sunday is not working day,so if the user has taken sunday leave then it will be not be counted as absence
        if (person.consective7Days) value.consective7Days = true
        if (person.hasShiftGreaterThan14Hours) value.hasShiftGreaterThan14Hours = true
        if (person.hasShiftDifferenceGreaterThan1andLessThan10) value.hasShiftDifferenceGreaterThan1andLessThan10 = true
        return value
    })

    const inter2 = inter1.filter(person => {
        return person?.consective7Days >= 7 || person?.hasShiftGreaterThan14Hours || person?.hasShiftDifferenceGreaterThan1andLessThan10
    })
    return inter2
}


export default generateLogPerPerson