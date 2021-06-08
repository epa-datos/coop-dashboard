import * as am4core from '@amcharts/amcharts4/core';
import am4lang_en_US from '@amcharts/amcharts4/lang/en_US';
import am4lang_es_ES from '@amcharts/amcharts4/lang/es_ES';
import am4lang_pt_BR from '@amcharts/amcharts4/lang/pt_BR';

// pt_BR (Portuguese) uses ',' character as decimal separator and '.' for thousand separator
// es_ES and en_US  (Spanish and English) use '.' character as decimal separator and ',' for thousand separator
// Is required use: 
//    a) For Spanish and Portuguese language: ',' character as decimal separator and '.' for thousand separator
//    b) For English language: '.' character as decimal separator and ',' for thousand separator

/**
 * load Language
 * @param chart chart instance
 * @param lang // 'es': Spanish | 'en': English | 'pt': Portuguese
 */

export function loadLanguage(chart, lang?: string) {
    let am4LangDate;
    let am4LangNumber;
    switch (lang) {
        case 'en':
            am4LangDate = am4lang_en_US;
            am4LangNumber = am4lang_en_US;
            break;
        case 'pt':
            am4LangDate = am4lang_pt_BR;
            am4LangNumber = am4lang_pt_BR;
            break;

        default:
            am4LangDate = am4lang_es_ES;
            am4LangNumber = am4lang_pt_BR;
    }

    chart.dateFormatter.language = new am4core.Language();
    chart.dateFormatter.language.locale = am4LangDate;

    chart.numberFormatter.numberFormat = '#,###.##';
    chart.numberFormatter.language = new am4core.Language();
    chart.numberFormatter.language.locale = am4LangNumber;
}
