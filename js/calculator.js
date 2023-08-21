//Calculadora de luz
const medidaAnteriorInput = document.querySelector('input[name="medida-anterior"]');
const medidaActualInput = document.querySelector('input[name="medida-actual"]');
const totalConsumoInput = document.querySelector('input[name="total-consumo"]');
const valorVatioInput = document.querySelector('input[name="valor-vatio"]');
const totalPagarInput = document.querySelector('input[name="total-pagar"]');
const totalPagarDisplay = document.getElementById('total-pagar-value');

medidaActualInput.addEventListener('input', calcularTotalConsumo);
valorVatioInput.addEventListener('input', calcularTotalPagar);

function calcularTotalConsumo() {
    const medidaAnterior = parseFloat(medidaAnteriorInput.value);
    const medidaActual = parseFloat(medidaActualInput.value);
    
    if (!isNaN(medidaAnterior) && !isNaN(medidaActual)) {
        const consumo = medidaActual - medidaAnterior;
        totalConsumoInput.value = consumo.toFixed(2);
    } else {
        totalConsumoInput.value = '';
    }
}

function calcularTotalPagar() {
    const consumo = parseFloat(totalConsumoInput.value);
    const valorVatio = parseFloat(valorVatioInput.value);
    
    if (!isNaN(consumo) && !isNaN(valorVatio)) {
        const totalPagar = consumo * valorVatio;
        totalPagarDisplay.textContent = totalPagar.toFixed(2);
    } else {
        totalPagarDisplay.textContent = '0.00';
    }
}

//Calculadora de Agua