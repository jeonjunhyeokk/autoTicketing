const startTicketing = require('./function.js');

function dateToString(timeStr) {
  let string = timeStr.toString();
  string = string.substring(0, string.length - 3);
  return string.replace('T', " ");
}

async function runAutomation({ id, pw, reserveTimeStr, consertId, numberPerson, day }) {
  const reserveTime = new Date(reserveTimeStr);
  const delay = reserveTime.getTime() - Date.now();
  console.log(`[INFO] ${delay}ms 뒤 자동화 시작`);

  setTimeout(async () => {
    console.log(`[INFO] ${dateToString(new Date())} - 자동화 시작`);
    const success = await startTicketing(consertId, Number(numberPerson), Number(day), id, pw);
    if (success) {
      console.log('[SUCCESS] 예매 자동화 완료');
    } else {
      console.log('[FAIL] 예매 자동화 실패');
    }
  }, delay);
}

module.exports = runAutomation;
