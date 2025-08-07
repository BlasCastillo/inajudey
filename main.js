// 📦 Módulo Principal: Inicialización del sistema

document.addEventListener('DOMContentLoaded', () => {
  // Referencias globales necesarias
  window.fixedCostsTable = document.getElementById('fixed-costs-table');
  window.toolsTable = document.getElementById('tools-table');
  window.productsTable = document.getElementById('products-table');

  // Inicializa botones de UI
  inicializarUI();

  // Listeners para campos de entrada
  document.getElementById('business-name-input')?.addEventListener('input', calculateAll);
  document.getElementById('investment-input')?.addEventListener('input', calculateAll);
  document.getElementById('sales-units-input')?.addEventListener('input', calculateAll);

  // Listener para generación de PDF
  document.getElementById('generate-full-pdf')?.addEventListener('click', generarPDFResumen);

  // Carga inicial de datos de ejemplo
  addRow(fixedCostsTable, [
    { type: 'text', placeholder: 'Ej. Alquiler Local', value: 'Alquiler Local' },
    { type: 'number', placeholder: 'Ej. 500.00', value: '500' }
  ]);

  addRow(toolsTable, [
    { type: 'text', placeholder: 'Ej. Impresora 3D', value: 'Impresora' },
    { type: 'number', placeholder: 'Ej. 800.00', value: '800' },
    { type: 'number', placeholder: 'Ej. 100.00', value: '100' },
    { type: 'number', placeholder: 'Ej. 48', value: '48' }
  ]);

  addProductCard();

  // Cálculo inicial
  calculateAll();
});


