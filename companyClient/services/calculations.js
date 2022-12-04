/**
 * ------ Calculate Amount With Interest ------
 * @param {Number} amounts 
 * @param {Number} offersRate 
 * @returns {Number}
 */
export const calculateWithInterest = (amounts, offersRate) => {
    const floatAmounts = parseFloat(amounts);
    const floatRate = parseFloat(offersRate);

    const persentageAmounts = floatAmounts * (floatRate / 100);
    const sumWithAmounts = floatAmounts + persentageAmounts;
    return sumWithAmounts;
};


/**
 * ------ calculate the pay duration time with pay per time of amounts ------
 * @param {Number} amounts 
 * @param {Number} offersRate 
 * @param {Number} payDuration 
 * @returns {Number}
 */
export const calculateWithPayDuration = (amounts, offersRate, payDuration) => {
    const amount = calculateWithInterest(amounts, offersRate) / payDuration;
    return amount.toFixed(2);
};
