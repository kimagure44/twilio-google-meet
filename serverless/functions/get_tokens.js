const twilio = require('twilio');

exports.handler = async (context, event, callback) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = context;
  const accessToken = new twilio.jwt.AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );
  accessToken.identity = event.username;

  const grant = new twilio.jwt.AccessToken.VideoGrant({
    room: 'TECNOPS_ROOM',
  });

  accessToken.addGrant(grant);
  const token = accessToken.toJwt();

  callback(null, {
    token,
  });
};
