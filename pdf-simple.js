function sincronizarResumenPDF() {
  const pares = [
    ['summary-fixed-costs', 'pdf-fixed-costs'],
    ['summary-be-units', 'pdf-be-units'],
    ['summary-be-value', 'pdf-be-value'],
    ['summary-profit', 'pdf-profit'],
    ['summary-roi', 'pdf-roi'],
    ['suggested-roi-units', 'pdf-roi-units']
  ];

  pares.forEach(([origenId, destinoId]) => {
    const origen = document.getElementById(origenId);
    const destino = document.getElementById(destinoId);
    if (origen && destino) {
      destino.textContent = origen.textContent;
    } else {
      console.warn(`Elemento no encontrado: ${origenId} o ${destinoId}`);
    }
  });
}

function generarPDFResumen() {
  const resumen = document.getElementById('pdf-summary');
  if (!resumen) {
    console.warn('No se encontró la sección #pdf-summary.');
    return;
  }

  html2pdf().from(resumen).set({
    margin: 10,
    filename: 'resumen_financiero.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).save();
}



document.addEventListener('DOMContentLoaded', () => {
  const btnActualizar = document.getElementById('actualizar-resumen-pdf');
  const btnGenerar = document.getElementById('generar-pdf-final');

  if (btnActualizar) {
    btnActualizar.addEventListener('click', () => {
      calculateAll(); // si quieres recalcular antes de sincronizar
      sincronizarResumenPDF();
    });
  }

  if (btnGenerar) {
    btnGenerar.addEventListener('click', generarPDFResumen);
  }
});
