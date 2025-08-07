// 📦 Módulo: Utilidades Generales

/**
 * Formatea un número como moneda venezolana (Bs.S)
 * @param {number} value - Valor numérico a formatear
 * @returns {string} - Valor formateado como moneda
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    currencyDisplay: 'symbol'
  }).format(value).replace('VES', 'Bs.S');
}

/**
 * Convierte un valor a número flotante seguro
 * @param {string|number} input - Valor a convertir
 * @returns {number} - Número flotante o 0 si no es válido
 */
function toFloat(input) {
  const num = parseFloat(input);
  return isNaN(num) ? 0 : num;
}

/**
 * Calcula la depreciación mensual de una herramienta
 * @param {number} costo - Costo de adquisición
 * @param {number} residual - Valor residual
 * @param {number} meses - Vida útil en meses
 * @returns {number} - Depreciación mensual
 */
function calcularDepreciacion(costo, residual, meses) {
  if (meses <= 0) return 0;
  const depreciacion = (costo - residual) / meses;
  return depreciacion > 0 ? depreciacion : 0;
}


