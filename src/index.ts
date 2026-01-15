// Предполагаем, что эти функции уже существуют в соответствующих модулях
// и мы только объявляем их сигнатуры
declare module './makeOrdinal' {
    function makeOrdinal(words: string): string;
    export = makeOrdinal;
}

declare module './isFinite' {
    function isFinite(num: number): boolean;
    export = isFinite;
}

declare module './isSafeNumber' {
    function isSafeNumber(num: number): boolean;
    export = isSafeNumber;
}

// Импорты должны быть такими:
import makeOrdinal = require('./makeOrdinal');
import isFinite = require('./isFinite');
import isSafeNumber = require('./isSafeNumber');

const TEN = 10;
const ONE_HUNDRED = 100;
const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;
const ONE_TRILLION = 1000000000000;
const ONE_QUADRILLION = 1000000000000000;
const MAX = 9007199254740992;

const LESS_THAN_TWENTY: string[] = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const TENTHS_LESS_THAN_HUNDRED: string[] = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number: number | string, asOrdinal?: boolean): string {
    const num = typeof number === 'string' ? parseInt(number, 10) : number;

    if (!isFinite(num)) {
        throw new TypeError(
            `Not a finite number: ${number} (${typeof number})`
        );
    }

    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it\'s either too large or too small.'
        );
    }

    const words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}

// Вспомогательная рекурсивная функция
function generateWords(number: number, wordsArray?: string[]): string {
    let remainder: number;
    let word: string;
    const words = wordsArray || [];

    // We're done
    if (number === 0) {
        return words.length === 0 ? 'zero' : words.join(' ').replace(/,$/, '');
    }

    // If negative, prepend "minus"
    if (number < 0) {
        words.push('minus');
        number = Math.abs(number);
    }

    if (number < 20) {
        remainder = 0;
        word = LESS_THAN_TWENTY[number];
    } else if (number < ONE_HUNDRED) {
        remainder = number % TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
        // In case of remainder, we need to handle it here to be able to add the "-"
        if (remainder) {
            word += '-' + LESS_THAN_TWENTY[remainder];
            remainder = 0;
        }
    } else if (number < ONE_THOUSAND) {
        remainder = number % ONE_HUNDRED;
        word = generateWords(Math.floor(number / ONE_HUNDRED)) + ' hundred';
    } else if (number < ONE_MILLION) {
        remainder = number % ONE_THOUSAND;
        word = generateWords(Math.floor(number / ONE_THOUSAND)) + ' thousand,';
    } else if (number < ONE_BILLION) {
        remainder = number % ONE_MILLION;
        word = generateWords(Math.floor(number / ONE_MILLION)) + ' million,';
    } else if (number < ONE_TRILLION) {
        remainder = number % ONE_BILLION;
        word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion,';
    } else if (number < ONE_QUADRILLION) {
        remainder = number % ONE_TRILLION;
        word = generateWords(Math.floor(number / ONE_TRILLION)) + ' trillion,';
    } else if (number <= MAX) {
        remainder = number % ONE_QUADRILLION;
        word = generateWords(Math.floor(number / ONE_QUADRILLION)) + ' quadrillion,';
    } else {
        throw new RangeError('Number too large');
    }

    if (word !== undefined) {
        words.push(word);
    }

    return generateWords(remainder!, words);
}

export = toWords;