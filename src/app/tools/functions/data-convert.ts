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