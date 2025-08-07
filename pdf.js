// 📦 Módulo: Generación de PDF

/**
 * Sincroniza los valores del resumen visible con la versión para PDF
 */
function sincronizarResumenPDF() {
  document.getElementById('pdf-fixed-costs').textContent =
    document.getElementById('summary-fixed-costs').textContent;
  document.getElementById('pdf-be-units').textContent =
    document.getElementById('summary-be-units').textContent;
  document.getElementById('pdf-be-value').textContent =
    document.getElementById('summary-be-value').textContent;
  document.getElementById('pdf-profit').textContent =
    document.getElementById('summary-profit').textContent;
  document.getElementById('pdf-roi').textContent =
    document.getElementById('summary-roi').textContent;
  document.getElementById('pdf-roi-units').textContent =
    document.getElementById('suggested-roi-units').textContent;
}

/**
 * Genera un PDF del resumen financiero oculto
 */
function generarPDFResumen() {
  calculateAll();
  sincronizarResumenPDF();

  const resumen = document.getElementById('pdf-summary');
  if (!resumen) {
    console.warn('No se encontró la sección #pdf-summary.');
    return;
  }

  // Mostrar temporalmente
  resumen.classList.remove('hidden-print');

  setTimeout(() => {
    html2pdf().from(resumen).set({
      margin: 10,
      filename: 'resumen_financiero.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save().then(() => {
      // Ocultar nuevamente
      resumen.classList.add('hidden-print');
    });
  }, 300); // Espera para asegurar renderizado
}
