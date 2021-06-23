/**
 * Disaggregates data to pictorial chart
 * @param metricName1 name property (value) to to distinguish the first metric
 * @param metricName2 name property (value) to to distinguish the second metric
 * @param dataRaw array with two metrics (objects)
 * @param usePercentage by default returns value property in percentage otherwise use original value
 * @returns an object with 2 objetcs (disaggregated metric1 and metric2 data)
 */

export function disaggregatePictorialData(metricName1: string, metricName2: string, dataRaw: any[], usePercentage: boolean = true): {} {
    let disMetric1;
    let disMetric2;

    const metric1 = dataRaw.find(item => item.name === metricName1);
    const metric2 = dataRaw.find(item => item.name === metricName2);

    let value1: any;
    let value2: any;

    if (usePercentage) {
        const percValues = getPercentageValues(metric1?.value, metric2?.value);
        value1 = percValues.perc1;
        value2 = percValues.perc2;
    } else {
        value1 = metric1.value.toFixed(2);
        value2 = metric2.value.toFixed(2);
    }

    if (metric1) {
        disMetric1 = [
            {
                name: 'empty',
                value: value1 ? +(100 - (+value1)).toFixed(2) : 100
            },
            {
                name: metricName1,
                value: value1 ? +value1 : 0,
                rawValue: usePercentage ? metric1.value.toFixed(2) : undefined
            },
        ];
    } else {
        disMetric1 = [];
    }

    if (metric2) {
        disMetric2 = [
            {
                name: 'empty',
                value: value2 ? +(100 - (+value2)).toFixed(2) : 100
            },
            {
                name: metricName2,
                value: value2 ? +value2 : 0,
                rawValue: usePercentage ? metric2.value.toFixed(2) : undefined
            },
        ];
    } else {
        disMetric2 = [];
    }

    return {
        [metricName1.toLowerCase()]: disMetric1,
        [metricName2.toLowerCase()]: disMetric2
    };
}

function getPercentageValues(value1: any, value2: any) {
    let total = value1 + value2;
    let perc1 = ((value1 * 100) / total).toFixed(2);
    let perc2 = ((value2 * 100) / total).toFixed(2);
    return { perc1, perc2 };
}
