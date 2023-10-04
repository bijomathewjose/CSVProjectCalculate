import csv from 'csv-parser'
import fs from 'fs'
import generateLogPerPerson, { filterRequiredData } from "./utils/perPersonLog.js";
import { convertToDate } from "./utils/time.js";
const results = []

fs.createReadStream('Assignment_Timecard.csv')
    .pipe(csv())
    .on('data', (data) => {

        results.push({
            posId: data['Position ID'],
            posStat: data['Position Status'],
            inTime: convertToDate(data['Time']),
            outTime: convertToDate(data['Time Out']),
            cardTime: data['Timecard Hours (as Time)'],
            startDate: convertToDate(data['Pay Cycle Start Date']),
            endDate: convertToDate(data['Pay Cycle End Date']),
            empName: data['Employee Name'],
            file: data['File Number']
        })
    })
    .on('end', () => {
        const logs = generateLogPerPerson(results)
        console.log(filterRequiredData(logs))
    });
