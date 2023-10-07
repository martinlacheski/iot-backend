const calculateMinutes = (diffInHours) => {
  const timeGroups = [
    { hours: 1, minutes: 5 },
    { hours: 3, minutes: 7 },
    { hours: 6, minutes: 8 },
    { hours: 12, minutes: 10 },
    { hours: 24, minutes: 15 },
    { hours: 48, minutes: 20 },
    { hours: 72, minutes: 25 },
  ];

  for (const group of timeGroups) {
    if (diffInHours <= group.hours) {
      return group.minutes;
    }
  }

  return 30;
};

module.exports = calculateMinutes;
