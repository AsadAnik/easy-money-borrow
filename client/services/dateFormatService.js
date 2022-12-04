import { format, getMinutes } from 'date-fns';

/**
 * ----- Get The Formated Date -----
 * @param {String} unformatedDate 
 * @returns 
 */
export const getFormatedDate = function (unformatedDate) {
    return format(unformatedDate, 'dd-MMMM-yyyy');
};

/**
 * ---- Get The Formated Time ----
 * @param {String} unformatedTime 
 * @returns 
 */
export const getFormatedTime = function (unformatedTime) {
    return getMinutes(unformatedTime);
};