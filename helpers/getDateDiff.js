const getDateDiff = (date1, date2) => {
  const fromDate = new Date(date1);
  const toDate = new Date(date2);

  const diffInHours = Math.abs(toDate - fromDate) / 36e5;

  const days = Math.floor(diffInHours / 24);
  const hours = Math.floor(diffInHours % 24);
  const mins = Math.floor((diffInHours * 60) % 60);
  const daysString = days > 0 ? `${days} días ` : "";
  const hoursString = hours > 0 ? `${hours} horas ` : "";
  const minsString = mins > 0 ? `${mins} minutos` : "";
  const diff = `${daysString}${hoursString}${minsString}`;

  return {
    diff,
    diffInHours,
  }
};

module.exports = getDateDiff;
