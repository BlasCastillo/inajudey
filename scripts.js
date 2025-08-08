      document.addEventListener('DOMContentLoaded', () => {
            const businessNameInput = document.getElementById('business-name-input');
            const fixedCostsTable = document.getElementById('fixed-costs-table');
            const addFixedCostBtn = document.getElementById('add-fixed-cost-btn');
            const toolsTable = document.getElementById('tools-table');
            const addToolBtn = document.getElementById('add-tool-btn');
            const productsTable = document.getElementById('products-table');
            const addProductBtn = document.getElementById('add-product-btn');

            const instructionsHeader = document.getElementById('instructions-header');
            const instructionsContent = document.getElementById('instructions-content');
            const instructionsIcon = document.getElementById('instructions-icon');

            let costsChart, productsChart;

            const formatCurrency = (value) => {
                return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES', currencyDisplay: 'symbol' }).format(value).replace('VES', 'Bs.S');
            };

            const addRow = (table, fields) => {
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

                const actionCell = document.createElement('td');
                actionCell.className = 'py-2';
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '×';
                deleteBtn.className = 'btn-danger rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg';
                deleteBtn.onclick = () => {
                    row.remove();
                    calculateAll();
                };
                actionCell.appendChild(deleteBtn);
                row.appendChild(actionCell);
                table.appendChild(row);
                
                row.querySelectorAll('input').forEach(input => input.addEventListener('input', calculateAll));
            };
            
            const addProductCard = () => {
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
            };

            const calculateAll = () => {
                let totalFixedCosts = 0;
                fixedCostsTable.querySelectorAll('tr').forEach(row => {
                    const value = parseFloat(row.querySelector('input[type="number"]').value) || 0;
                    totalFixedCosts += value;
                });

                let totalDepreciation = 0;
                toolsTable.querySelectorAll('tr').forEach(row => {
                    const cost = parseFloat(row.querySelectorAll('input')[1].value) || 0;
                    const residual = parseFloat(row.querySelectorAll('input')[2].value) || 0;
                    const months = parseFloat(row.querySelectorAll('input')[3].value) || 1;
                    const depreciation = (cost - residual) / months;
                    totalDepreciation += depreciation > 0 ? depreciation : 0;
                });
                
                totalFixedCosts += totalDepreciation;
                document.getElementById('summary-fixed-costs').textContent = formatCurrency(totalFixedCosts);

                let totalVariableCost = 0;
                let totalSellPrice = 0;
                let productCount = 0;
                const productsData = [];

                productsTable.querySelectorAll('.p-4').forEach(card => {
                    const raw = parseFloat(card.querySelector('.product-cost-raw').value) || 0;
                    const labor = parseFloat(card.querySelector('.product-cost-labor').value) || 0;
                    const packaging = parseFloat(card.querySelector('.product-cost-packaging').value) || 0;
                    const margin = parseFloat(card.querySelector('.product-margin').value) / 100 || 0;
                    
                    const productTotalCost = raw + labor + packaging;
                    const productSellPrice = margin < 1 ? productTotalCost / (1 - margin) : productTotalCost;
                    
                    card.querySelector('.product-total-cost').textContent = formatCurrency(productTotalCost);
                    card.querySelector('.product-sell-price').textContent = formatCurrency(productSellPrice);

                    totalVariableCost += productTotalCost;
                    totalSellPrice += productSellPrice;
                    productCount++;
                    
                    productsData.push({
                        name: card.querySelector('.product-name').value || `Producto ${productCount}`,
                        cost: productTotalCost,
                        price: productSellPrice
                    });
                });

                const avgVariableCost = productCount > 0 ? totalVariableCost / productCount : 0;
                const avgSellPrice = productCount > 0 ? totalSellPrice / productCount : 0;
                const contributionMargin = avgSellPrice - avgVariableCost;

                let beUnits = 0;
                if (contributionMargin > 0) {
                    beUnits = totalFixedCosts / contributionMargin;
                }
                
                document.getElementById('summary-be-units').textContent = beUnits.toFixed(0);
                document.getElementById('summary-be-value').textContent = formatCurrency(beUnits * avgSellPrice);

                const investment = parseFloat(document.getElementById('investment-input').value) || 0;
                const salesUnits = parseFloat(document.getElementById('sales-units-input').value) || 0;
                
                const totalRevenue = salesUnits * avgSellPrice;
                const totalVariableCostsForSales = salesUnits * avgVariableCost;
                const profit = totalRevenue - totalVariableCostsForSales - totalFixedCosts;
                
                document.getElementById('summary-profit').textContent = formatCurrency(profit);
                
                const roi = investment > 0 ? (profit / investment) * 100 : 0;
                document.getElementById('summary-roi').textContent = `${roi.toFixed(2)} %`;

                const desiredROI = 0.30;
                let suggestedUnitsForROI = 0;

                if (investment > 0 && contributionMargin > 0) {
                    suggestedUnitsForROI = (desiredROI * investment + totalFixedCosts) / contributionMargin;
                } else if (investment === 0 && contributionMargin > 0) {
                    suggestedUnitsForROI = totalFixedCosts / contributionMargin; // Just cover fixed costs for 0 investment
                } else {
                    suggestedUnitsForROI = 0; // Or indicate impossibility
                }
                document.getElementById('suggested-roi-units').textContent = suggestedUnitsForROI > 0 ? suggestedUnitsForROI.toFixed(0) : 'N/A';
                
                updateCostsChart(totalFixedCosts, totalVariableCostsForSales);
                updateProductsChart(productsData);
            };
            
            const updateCostsChart = (fixed, variable) => {
                const ctx = document.getElementById('costs-chart').getContext('2d');
                const data = {
                    labels: ['Gastos Fijos', 'Gastos Variables'],
                    datasets: [{
                        data: [fixed, variable],
                        backgroundColor: ['#0f766e', '#99f6e4'],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                };
                if (costsChart) {
                    costsChart.data = data;
                    costsChart.update();
                } else {
                    costsChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: data,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'bottom' } }
                        }
                    });
                }
            };
            
            const updateProductsChart = (productsData) => {
                const ctx = document.getElementById('products-chart').getContext('2d');
                const topProducts = productsData.slice(0, 3);
                const data = {
                    labels: topProducts.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
                    datasets: [
                        {
                            label: 'Costo Total',
                            data: topProducts.map(p => p.cost),
                            backgroundColor: '#0f766e',
                            borderRadius: 4
                        },
                        {
                            label: 'Precio Venta',
                            data: topProducts.map(p => p.price),
                            backgroundColor: '#99f6e4',
                            borderRadius: 4
                        }
                    ]
                };
                 if (productsChart) {
                    productsChart.data = data;
                    productsChart.update();
                } else {
                    productsChart = new Chart(ctx, {
                        type: 'bar',
                        data: data,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'bottom' } },
                            scales: { y: { beginAtZero: true } }
                        }
                    });
                }
            };

            addFixedCostBtn.addEventListener('click', () => addRow(fixedCostsTable, [
                { type: 'text', placeholder: 'Ej. Alquiler Local' },
                { type: 'number', placeholder: 'Ej. 500.00' }
            ]));
            
            addToolBtn.addEventListener('click', () => addRow(toolsTable, [
                { type: 'text', placeholder: 'Ej. Impresora 3D' },
                { type: 'number', placeholder: 'Ej. 800.00' },
                { type: 'number', placeholder: 'Ej. 100.00' },
                { type: 'number', placeholder: 'Ej. 48' }
            ]));
            
            addProductBtn.addEventListener('click', addProductCard);
            
            businessNameInput.addEventListener('input', calculateAll);
            document.getElementById('investment-input').addEventListener('input', calculateAll);
            document.getElementById('sales-units-input').addEventListener('input', calculateAll);

            // Collapsible instructions
            instructionsHeader.addEventListener('click', () => {
                instructionsContent.classList.toggle('active');
                instructionsIcon.textContent = instructionsContent.classList.contains('active') ? '▲' : '▼';
            });

            // Initial state
            addRow(fixedCostsTable, [{ type: 'text', placeholder: 'Ej. Alquiler Local', value: 'Alquiler Local' }, { type: 'number', placeholder: 'Ej. 500.00', value: '500' }]);
            addRow(toolsTable, [{ type: 'text', placeholder: 'Ej. Impresora 3D', value: 'Impresora' }, { type: 'number', placeholder: 'Ej. 800.00', value: '800' }, { type: 'number', placeholder: 'Ej. 100.00', value: '100' }, { type: 'number', placeholder: 'Ej. 48', value: '48' }]);
            addProductCard();
            calculateAll();
        });