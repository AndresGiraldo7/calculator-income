//-------------------------------------------------//Calculadora de luz
// Variables para formulario de Luz
const formLuz = document.getElementById('form-luz');

const medidaAnteriorLuz = formLuz.querySelector('input[name="medida-anterior"]');
const medidaActualLuz = formLuz.querySelector('input[name="medida-actual"]');
const totalConsumoLuz = formLuz.querySelector('input[name="total-consumo"]');
const valorVatioLuz = formLuz.querySelector('input[name="valor-vatio"]');
const totalPagarDisplayLuz = document.getElementById('total-pagar-value-luz');

// Eventos
medidaActualLuz.addEventListener('input', calcularTotalConsumoLuz);
valorVatioLuz.addEventListener('input', calcularTotalPagarLuz);

// Funciones
function calcularTotalConsumoLuz() {
    const anterior = parseFloat(medidaAnteriorLuz.value);
    const actual = parseFloat(medidaActualLuz.value);

    if (!isNaN(anterior) && !isNaN(actual)) {
        const consumo = actual - anterior;
        totalConsumoLuz.value = consumo.toFixed(2);
        calcularTotalPagarLuz();
    } else {
        totalConsumoLuz.value = '';
    }
}

function calcularTotalPagarLuz() {
    const consumo = parseFloat(totalConsumoLuz.value);
    const valorVatio = parseFloat(valorVatioLuz.value);

    if (!isNaN(consumo) && !isNaN(valorVatio)) {
        const total = consumo * valorVatio;
        totalPagarDisplayLuz.textContent = total.toFixed(2);
    } else {
        totalPagarDisplayLuz.textContent = '0.00';
    }
}
//------------------------------------//Calculadora de Agua

document.getElementById('generar-familias').addEventListener('click', () => {
    const numeroFamilias = parseInt(document.getElementById('numero-familias').value, 10);
    const container = document.getElementById('familias-container');

    // Limpiar contenido anterior
    container.innerHTML = '';

    if (isNaN(numeroFamilias) || numeroFamilias <= 0) {
        container.innerHTML = `<div class="alert alert-warning">Por favor, introduce un número válido de familias.</div>`;
        return;
    }

    const titulo = document.createElement('h5');
    titulo.classList.add('text-dark', 'mt-4', 'mb-3');
    titulo.textContent = `Datos por familia (${numeroFamilias}):`;
    container.appendChild(titulo);

    for (let i = 1; i <= numeroFamilias; i++) {
        const card = document.createElement('div');
        card.className = 'card bg-light mb-2';
        card.style.border = 'none';
        card.style.boxShadow = 'none';

        const row = document.createElement('div');
        row.className = 'd-flex flex-nowrap gap-3 p-2 overflow-auto align-items-end flex-row';

        const colNombre = document.createElement('div');
        colNombre.style.minWidth = '180px';
        colNombre.innerHTML = `
      <label class="form-label fw-bold text-dark mb-1">Nombre Familia ${i}:</label>
      <input type="text" class="form-control form-control-sm" name="nombre-familia-${i}" required>
    `;
        row.appendChild(colNombre);

        const colMetros = document.createElement('div');
        colMetros.style.minWidth = '80px';
        colMetros.innerHTML = `
      <label class="form-label fw-bold text-dark mb-1">Metros(Foto contador):</label>
      <input type="number" class="form-control form-control-sm text-center" name="metros-consumidos-${i}" required>
    `;
        row.appendChild(colMetros);

        const colDias = document.createElement('div');
        colDias.style.minWidth = '80px';
        colDias.innerHTML = `
      <label class="form-label fw-bold text-dark mb-1">Días:</label>
      <input type="number" class="form-control form-control-sm text-center" name="dias-${i}" value="60" min="1" max="60" required>
    `;
        row.appendChild(colDias);

        card.appendChild(row);
        container.appendChild(card);
    }

    agregarBotonCalculo(); // Agrega el botón solo una vez
});

function agregarBotonCalculo() {
    if (!document.getElementById('calcular-consumo')) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary w-100 mt-3';
        btn.id = 'calcular-consumo';
        btn.textContent = 'Calcular Valor Consumo';
        document.getElementById('familias-container').appendChild(btn);
        btn.addEventListener('click', calcularConsumos);
    }
}

const formatterCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

function calcularConsumos() {
    const familias = parseInt(document.getElementById('numero-familias').value, 10);
    if (isNaN(familias) || familias <= 0) return;

    const getInputValue = (name) => parseFloat(document.querySelector(`[name="${name}"]`)?.value || 0);

    const cargoAcueducto = getInputValue('cargo-acueducto') / familias;
    const cargoAlcantarillado = getInputValue('cargo-alcantarillado') / familias;
    const basura = getInputValue('basura') / familias;
    const valorMetroAgua = getInputValue('metros-agua');
    const valorMetroAlcantarillado = getInputValue('metros-alcantarillado');

    const tbody = document.querySelector('#tabla-resultados tbody');
    tbody.innerHTML = '';

    const nombres = []; // almacenar nombres para el selector

    for (let i = 1; i <= familias; i++) {
        const nombre = document.querySelector(`[name="nombre-familia-${i}"]`)?.value || `Familia ${i}`;
        const metrosConsumidos = parseFloat(document.querySelector(`[name="metros-consumidos-${i}"]`)?.value || 0);
        const dias = parseFloat(document.querySelector(`[name="dias-${i}"]`)?.value || 60);
        const factorDias = dias / 60;

        const agua = valorMetroAgua * metrosConsumidos;
        const alcantarillado = valorMetroAlcantarillado * metrosConsumidos;

        const total = (
            cargoAcueducto +
            cargoAlcantarillado +
            basura +
            agua +
            alcantarillado
        ) * factorDias;

        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${nombre}</td>
    <td>${formatterCOP.format(cargoAcueducto)}</td>
    <td>${formatterCOP.format(cargoAlcantarillado)}</td>
    <td>${formatterCOP.format(basura)}</td>
    <td>${formatterCOP.format(agua)}</td>
    <td>${formatterCOP.format(alcantarillado)}</td>
    <td>${dias.toFixed(0)}</td>
    <td><strong>${formatterCOP.format(total)}</strong></td>
`;
        tbody.appendChild(row);

        nombres.push(nombre);
    }

    // Llenar el selector de familias (fuera del loop)
    const select = document.getElementById('familia-select');
    if (select) {
        select.innerHTML = '<option value="">Seleccione una familia</option>';
        nombres.forEach((nombre, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = nombre;
            select.appendChild(option);
        });
    }

    const resumenSeccion = document.getElementById('seccion-resumen');
    if (resumenSeccion) {
        resumenSeccion.style.display = 'block';
    }
}

async function exportarTablaAPdf(nombre, headers, data, archivo = 'resumen_consumo.pdf') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Resumen de Consumo - ${nombre}`, 14, 20);

    doc.autoTable({
        startY: 30,
        head: [headers],
        body: [data],
        styles: {
            fontSize: 10,
            halign: 'center'
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
        },
        theme: 'striped'
    });

    doc.save(archivo);
}

document.getElementById('exportar-todo-pdf').addEventListener('click', () => {
    const headers = Array.from(document.querySelectorAll('#tabla-resultados thead th')).map(th => th.textContent.trim());
    const rows = Array.from(document.querySelectorAll('#tabla-resultados tbody tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
    );

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Resumen de Consumo por Familias", 14, 20);

    doc.autoTable({
        startY: 30,
        head: [headers],
        body: rows,
        styles: {
            fontSize: 10,
            halign: 'center'
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
        },
        theme: 'striped'
    });

    doc.save('consumo_total.pdf');
});

document.getElementById('exportar-familia-pdf').addEventListener('click', () => {
    const selectedIndex = document.getElementById('familia-select').value;
    if (selectedIndex === "") {
        alert("Seleccione una familia para exportar");
        return;
    }

    const headers = Array.from(document.querySelectorAll('#tabla-resultados thead th')).map(th => th.textContent.trim());
    const tr = document.querySelectorAll('#tabla-resultados tbody tr')[selectedIndex];
    const data = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    const nombre = data[0];

    exportarTablaAPdf(nombre, headers, data, `consumo_${nombre.replace(/\s+/g, '_')}.pdf`);
});
