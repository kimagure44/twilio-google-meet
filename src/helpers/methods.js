import { ICON, USER_MINLENGTH } from './definitions';

export const validations = {
  requiredUsername: (payload) => !!payload || 'Username is required',
  minLengthUsername: (payload) =>
    (payload && payload.length > USER_MINLENGTH) ||
    'Username must have minimum 6 characters',
};
export const buttonStatus = (key, status) => ICON[key][status ? 'on' : 'off'];
