function isTestOver(endDate, endTime) {
  if (!endDate) return false;
  let end = new Date(endDate); // already ISO string

  if (endTime) {
    const [hh, mm] = endTime.split(":");
    end.setHours(Number(hh), Number(mm), 0, 0);
  }

  return Date.now() >= end.getTime();
}

module.exports = {isTestOver};