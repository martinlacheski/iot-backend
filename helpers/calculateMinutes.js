const calculateMinutes = (diffInHours) => {
  const timeGroups = [
    { hours: 1, minutes: 5 },
    { hours: 3, minutes: 10 },
    { hours: 6, minutes: 15 },
    { hours: 12, minutes: 30 },
    { hours: 24, minutes: 60 },
    { hours: 48, minutes: 90 },
    { hours: 72, minutes: 120 },
    { hours: 168, minutes: 240 },
    { hours: 336, minutes: 480 },
    { hours: 504, minutes: 960 },
    { hours: 672, minutes: 1920 },
  ];

  for (const group of timeGroups) {
    if (diffInHours <= group.hours) {
      return group.minutes;
    }
  }

  // Default value if none of the conditions are met
  return 1920;
};

module.exports = calculateMinutes;
