const USER_MINLENGTH = 6;
const ICON = {
  microphone: {
    on: 'mdi-microphone',
    off: 'mdi-microphone-off',
  },
  video: {
    on: 'mdi-video',
    off: 'mdi-video-off',
  },
};

export const validations = {
  requiredUsername: (payload) => !!payload || 'Username is required',
  minLengthUsername: (payload) =>
    (payload && payload.length > USER_MINLENGTH) ||
    'Username must have minimum 6 characters',
};
export const buttonStatus = (key, status) => ICON[key][status ? 'on' : 'off'];
