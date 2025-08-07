// 📦 Módulo: Cálculos Financieros

/**
 * Calcula el total de gastos fijos incluyendo depreciación
 * @returns {number} - Total de gastos fijos mensuales
 */
function calcularGastosFijos() {
  let total = 0;

  fixedCostsTable.querySelectorAll('tr').forEach(row => {
    const valor = toFloat(row.querySelector('input[type="number"]')?.value);
    total += valor;
  });

  toolsTable.querySelectorAll('tr').forEach(row => {
    const inputs = row.querySelectorAll('input');
    const costo = toFloat(inputs[1]?.value);
    const residual = toFloat(inputs[2]?.value);
    const meses = toFloat(inputs[3]?.value);
    total += calcularDepreciacion(costo, residual, meses);
  });

  return total;
}

/**
 * Procesa todos los productos y devuelve métricas agregadas
 * @returns {Object} - Datos agregados y por producto
 */
function calcularProductos() {
  const productos = [];
  let totalCosto = 0;
  let totalPrecio = 0;

  productsTable.querySelectorAll('.p-4').forEach((card, index) => {
    const nombre = card.querySelector('.product-name')?.value || `Producto ${index + 1}`;
    const materiaPrima = toFloat(card.querySelector('.product-cost-raw')?.value);
    const manoObra = toFloat(card.querySelector('.product-cost-labor')?.value);
    const empaque = toFloat(card.querySelector('.product-cost-packaging')?.value);
    const margen = toFloat(card.querySelector('.product-margin')?.value) / 100;

    const costoTotal = materiaPrima + manoObra + empaque;
    const precioVenta = margen < 1 ? costoTotal / (1 - margen) : costoTotal;

    card.querySelector('.product-total-cost').textContent = formatCurrency(costoTotal);
    card.querySelector('.product-sell-price').textContent = formatCurrency(precioVenta);

    totalCosto += costoTotal;
    totalPrecio += precioVenta;

    productos.push({ nombre, costo: costoTotal, precio: precioVenta });
  });

  const promedioCosto = productos.length ? totalCosto / productos.length : 0;
  const promedioPrecio = productos.length ? totalPrecio / productos.length : 0;

  return { productos, promedioCosto, promedioPrecio };
}

/**
 * Calcula métricas financieras clave y actualiza el DOM
 */
function calculateAll() {
  const gastosFijos = calcularGastosFijos();
  const { productos, promedioCosto, promedioPrecio } = calcularProductos();
  const margenContribucion = promedioPrecio - promedioCosto;

  // Punto de equilibrio
  const unidadesEquilibrio = margenContribucion > 0 ? gastosFijos / margenContribucion : 0;
  const ingresosEquilibrio = unidadesEquilibrio * promedioPrecio;

  document.getElementById('summary-fixed-costs').textContent = formatCurrency(gastosFijos);
  document.getElementById('summary-be-units').textContent = unidadesEquilibrio.toFixed(0);
  document.getElementById('summary-be-value').textContent = formatCurrency(ingresosEquilibrio);

  // ROI y utilidad
  const inversion = toFloat(document.getElementById('investment-input')?.value);
  const unidadesVendidas = toFloat(document.getElementById('sales-units-input')?.value);

  const ingresos = unidadesVendidas * promedioPrecio;
  const costosVariables = unidadesVendidas * promedioCosto;
  const utilidad = ingresos - costosVariables - gastosFijos;
  const roi = inversion > 0 ? (utilidad / inversion) * 100 : 0;

  document.getElementById('summary-profit').textContent = formatCurrency(utilidad);
  document.getElementById('summary-roi').textContent = `${roi.toFixed(2)} %`;

  // Unidades sugeridas para ROI deseado
  const roiDeseado = 0.30;
  const unidadesROI = margenContribucion > 0
    ? ((roiDeseado * inversion + gastosFijos) / margenContribucion)
    : 0;

  document.getElementById('suggested-roi-units').textContent =
    unidadesROI > 0 ? unidadesROI.toFixed(0) : 'N/A';
}
