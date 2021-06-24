export function convertWeekdayToString(weekday: number): string {
    let weekdayName;
    switch (weekday) {
        case 1:
            weekdayName = 'Lun';
            break;
        case 2:
            weekdayName = 'Mar';
            break;
        case 3:
            weekdayName = 'Mier';
            break;
        case 4:
            weekdayName = 'Jue';
            break;
        case 5:
            weekdayName = 'Vie';
            break;
        case 6:
            weekdayName = 'Sab';
            break;
        case 7:
            weekdayName = 'Dom';
            break;
    }

    return weekdayName;
}

export function convertMonthToString(month: string): string {
    let monthName;
    switch (month) {
        case '01':
            monthName = 'Ene';
            break;
        case '02':
            monthName = 'Feb';
            break;
        case '03':
            monthName = 'Mar';
            break;
        case '04':
            monthName = 'Abr';
            break;
        case '05':
            monthName = 'May';
            break;
        case '06':
            monthName = 'Jun';
            break;
        case '07':
            monthName = 'Jul';
            break;
        case '08':
            monthName = 'Ago';
            break;
        case '09':
            monthName = 'Sep';
            break;
        case '10':
            monthName = 'Oct';
            break;
        case '11':
            monthName = 'Nov';
            break;
        case '12':
            monthName = 'Dic';
            break;
    }

    return monthName;
}