// log.js (Node.js 환경에서도 작동)
let rendererLogger = null;

function setRendererLogger(fn) {
  rendererLogger = fn; // main.js에서 넘겨줄 log 함수
}

function addLog(msg) {
  const formatted = `[INFO] - ${msg}`;
  console.log(formatted);
  if (rendererLogger) rendererLogger(formatted);
}

function addErrorLog(msg) {
  const formatted = `[ERROR] - ${msg}`;
  console.error(formatted);
  if (rendererLogger) rendererLogger(formatted);
}

module.exports = {
  addLog,
  addErrorLog,
  setRendererLogger
};
