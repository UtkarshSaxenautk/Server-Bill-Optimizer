//const twilio = require('twilio');
const accountSid = 'AC1517122a4a2b63954e7eb75b76a12dae'; // Your Account SID from www.twilio.com/console
const authToken = '13321c15ca035a98f3e010a815b5c62c'; // Your Auth Token from www.twilio.com/console
const parsePhoneNumber = require('libphonenumber-js');
const client = require("twilio")(accountSid, authToken);

const Call = () => {
  console.log("call");
  client.messages.create({
    body: 'This is a test message',
    from: '+121764519601',
    to: '+918092506511'
  })
    .then((data) => {
      console.log('Message sent:', data.sid);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};

const Alert = (msg) => {
  client.messages.create({
    body: msg,
    from: '+121764519601',
    to: '+918092506511'
  })
    .then((data) => {
      console.log('Message sent:', data.sid);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};

const SuccessMessage = (msg) => {
  console.log(msg);
  client.messages.create({
    body: msg,
    from: '+121764519601',
    to: '+918092506511'
  })
    .then((data) => {
      console.log('Message sent:', data.sid);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};

const Hourreport = (msg) => {
  client.messages.create({
    body: msg,
    from: '+121764519601',
    to: '+918092506511'
  })
    .then((data) => {
      console.log('Message sent:', data.sid);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};

const DailyReport = (msg) => {
  client.messages.create({
    body: msg,
    from: '+121764519601',
    to: '+918092506511'
  })
    .then((data) => {
      console.log('Message sent:', data.sid);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};

module.exports = { Call, SuccessMessage, Alert, Hourreport, DailyReport };
