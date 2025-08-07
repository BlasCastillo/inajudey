// 📦 Módulo: Interfaz de Usuario

/**
 * Agrega una fila editable a una tabla HTML
 * @param {HTMLElement} table - Elemento <tbody> de la tabla
 * @param {Array} fields - Array de objetos con propiedades: type, placeholder, value, class
 */
function addRow(table, fields) {
  const row = document.createElement('tr');
  row.className = 'border-b border-slate-200';

  fields.forEach(field => {
    const cell = document.createElement('td');
    cell.className = 'py-2 pr-2';

    const input = document.createElement('input');
    input.type = field.type;
    input.placeholder = field.placeholder;
    input.className = `input-field ${field.class || ''}`;
    if (field.value) input.value = field.value;

    cell.appendChild(input);
    row.appendChild(cell);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.className = 'btn-danger rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg';
  deleteBtn.onclick = () => {
    row.remove();
    calculateAll();
  };

  const actionCell = document.createElement('td');
  actionCell.className = 'py-2';
  actionCell.appendChild(deleteBtn);
  row.appendChild(actionCell);

  table.appendChild(row);

  row.querySelectorAll('input').forEach(input => input.addEventListener('input', calculateAll));
}

/**
 * Agrega una tarjeta de producto con campos dinámicos
 */
function addProductCard() {
  const cardId = `product-${Date.now()}`;
  const card = document.createElement('div');
  card.id = cardId;
  card.className = 'p-4 border border-slate-200 rounded-lg relative';

  card.innerHTML = `
    <button class="btn-danger absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg product-delete-btn">×</button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="${cardId}-name" class="text-sm font-semibold text-slate-700 block mb-1">Nombre del Producto</label>
        <input type="text" id="${cardId}-name" placeholder="Ej. Camiseta Básica" class="input-field font-bold text-lg col-span-full product-name">
      </div>
      <div>
        <label for="${cardId}-raw" class="text-sm font-semibold text-slate-700 block mb-1">Costo Materia Prima (Bs.S)</label>
        <input type="number" id="${cardId}-raw" placeholder="Ej. 8.00" class="input-field product-cost-raw">
      </div>
      <div>
        <label for="${cardId}-labor" class="text-sm font-semibold text-slate-700 block mb-1">Costo Mano de Obra (Bs.S)</label>
        <input type="number" id="${cardId}-labor" placeholder="Ej. 5.00" class="input-field product-cost-labor">
      </div>
      <div>
        <label for="${cardId}-packaging" class="text-sm font-semibold text-slate-700 block mb-1">Costo Empaque (Bs.S)</label>
        <input type="number" id="${cardId}-packaging" placeholder="Ej. 1.00" class="input-field product-cost-packaging">
      </div>
      <div>
        <label for="${cardId}-margin" class="text-sm font-semibold text-slate-700 block mb-1">Margen Ganancia (%)</label>
        <input type="number" id="${cardId}-margin" placeholder="Ej. 50" value="50" class="input-field product-margin">
      </div>
    </div>
    <div class="mt-4 bg-slate-100 p-3 rounded-md grid grid-cols-2 gap-4 text-center">
      <div>
        <p class="text-sm font-medium text-slate-500">Costo Total</p>
        <p class="font-bold text-lg text-slate-800 product-total-cost">0,00 Bs.S</p>
      </div>
      <div>
        <p class="text-sm font-medium text-slate-500">Precio Venta</p>
        <p class="font-bold text-lg text-teal-600 product-sell-price">0,00 Bs.S</p>
      </div>
    </div>
  `;

  productsTable.appendChild(card);

  card.querySelector('.product-delete-btn').onclick = () => {
    card.remove();
    calculateAll();
  };

  card.querySelectorAll('input').forEach(input => input.addEventListener('input', calculateAll));
}

/**
 * Asocia los botones de la interfaz con sus funciones
 */
function inicializarUI() {
  document.getElementById('add-fixed-cost-btn').addEventListener('click', () =>
    addRow(fixedCostsTable, [
      { type: 'text', placeholder: 'Ej. Alquiler Local' },
      { type: 'number', placeholder: 'Ej. 500.00' }
    ])
  );

  document.getElementById('add-tool-btn').addEventListener('click', () =>
    addRow(toolsTable, [
      { type: 'text', placeholder: 'Ej. Impresora 3D' },
      { type: 'number', placeholder: 'Ej. 800.00' },
      { type: 'number', placeholder: 'Ej. 100.00' },
      { type: 'number', placeholder: 'Ej. 48' }
    ])
  );

  document.getElementById('add-product-btn').addEventListener('click', addProductCard);
}
