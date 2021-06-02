/**
 * Equals arrays: Compare two objects arrays where objects have an id property
 * @param array1 
 * @param array2 
 * @returns true if arrays are equals
 */
export function equalsArrays(array1, array2): boolean {
    let cleanArray1 = array1.filter(item => item?.id);
    let cleanArray2 = array2.filter(item => item?.id);

    if (cleanArray1.length !== cleanArray2.length) {
        return false;
    }

    let sortedArray1 = cleanArray1.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    let sortedArray2 = cleanArray2.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

    const areEquals = sortedArray1.every((value, index) => {
        return value.id === sortedArray2[index].id;
    });

    return areEquals;
}