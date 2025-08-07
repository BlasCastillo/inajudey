function mostrarVistaPreviaPDF() {
  calculateAll();

  // Asegura que el DOM esté listo antes de sincronizar
  setTimeout(() => {
    sincronizarResumenPDF();

    const modal = document.getElementById('modal-preview');
    const resumenOriginal = document.getElementById('pdf-summary');
    const resumenPreview = document.getElementById('pdf-summary-preview');

    if (!modal || !resumenOriginal || !resumenPreview) {
      console.warn('No se encontró el modal o los contenedores de resumen.');
      return;
    }

    resumenPreview.innerHTML = resumenOriginal.innerHTML;
    modal.style.display = 'flex';
  }, 100); // Pequeña espera para asegurar renderizado
}
