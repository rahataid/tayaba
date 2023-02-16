//Author: Santosh
const queueSheet = '1M8fX7rpBKnOA44PwpOwm33EuezZoiPL-rUCG7zRFPcA';
console.log('***********SENDING SMS FROM SHEET***********');

const {
  gsheet: { getSheetByTitle },
  smsService: {
    twilio: { sendSMS },
  },
} = require('./_common');

const sanitizeMessage = (message, name) => {
  const regex = /<(.+?)>/g;
  const matches = message.match(regex);
  if (matches) {
    matches.forEach((match) => {
      const key = match.replace(/<|>/g, '');
      message = message.replace(match, name);
    });
  }
  return message;
};

const run = async () => {
  const sheet = await getSheetByTitle(queueSheet, 'sms');
  const logSheet = await getSheetByTitle(queueSheet, 'sms_logs');
  let rows = await sheet.getRows();
  rows = rows.filter((d) => {
    return d.queue === 'TRUE' && d.phone.length > 8;
  });

  console.log({ rows });
  for (let d of rows) {
    console.log('->', d.phone);
    const msg = sanitizeMessage(d.message, d.ben_name);
    //   const ms = await sendSMS(d.phone, d.message);
    d.queue = false;
    d.sent_date = new Date();
    await d.save();
    await logSheet.addRow({
      phone: d.phone,
      date: d.sent_date,
      message: msg,
    });
  }
};

run();
