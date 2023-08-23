const getMinutesGroups = (diffHours) => {
  const baseMinutes = 10; // Valor base de minutos
  const exponent = 0.2; // Exponente para ajustar la curva exponencial

  // Aplica la fórmula exponencial para calcular los minutos
  const minutes = baseMinutes * Math.pow(diffHours, exponent);

  return Math.round(minutes); // Redondea al número entero más cercano
};

module.exports = getMinutesGroups;
