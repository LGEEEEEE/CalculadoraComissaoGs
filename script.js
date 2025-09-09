// ***** ATENÇÃO: EDITE ESTA ÁREA 1 *****
// Adicione ou altere as funcionárias e suas respectivas metas aqui.
// As metas devem ser listadas da MAIOR para a MENOR.
const regrasComissao = {
    "Ana Clara": {
        metas: [
            { valor: 57000, percentual: 5.5 },
            { valor: 42000, percentual: 4.0 },
            { valor: 32000, percentual: 3.0 },
            { valor: 25000, percentual: 2.0 }
        ]
    },
    "Fernanda": {
        metas: [
            { valor: 20000, percentual: 4.0 },
            { valor: 10000, percentual: 2.5 },
            { valor: 5000, percentual: 2.0 }
        ]
    },
    "Mariane": {
        metas: [
            { valor: 57000, percentual: 5.5 },
            { valor: 42000, percentual: 4.0 },
            { valor: 32000, percentual: 3.0 },
            { valor: 25000, percentual: 2.0 }
        ]
    },
    "Giovanna": {
        metas: [
            { valor: 20000, percentual: 4.0 },
            { valor: 10000, percentual: 2.5 },
            { valor: 5000, percentual: 2.0 }
        ]
    },
    "Rafaela": {
        metas: [
            { valor: 20000, percentual: 4.0 },
            { valor: 10000, percentual: 3.5 },
            { valor: 5000, percentual: 3.0 }
        ]
    },
    "Anne": {
        metas: [
            { valor: 20000, percentual: 4.0 },
            { valor: 10000, percentual: 2.5 },
            { valor: 5000, percentual: 2.0 }
        ]
    },
    "Andressa": {
        metas: [
            { valor: 20000, percentual: 4.0 },
            { valor: 10000, percentual: 3.5 },
            { valor: 5000, percentual: 3.0 }
        ]
    },
    "Larissa": {
        metas: [
            { valor: 32000, percentual: 5.5 },
            { valor: 16000, percentual: 4.5 },
            { valor: 8000, percentual: 3.0 }
        ]
    },

};

// ***** ATENÇÃO: EDITE ESTA ÁREA 2 *****
// Defina o valor pago por cada avaliação do Google.
const valorPorAvaliacao = 2.00;
// *****************************************

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

const funcionarioSelect = document.getElementById('selecionaFuncionario');
const avaliacoesInput = document.getElementById('avaliacoesGoogle');
const fileInput = document.getElementById('pdfFile');
const resultadoDiv = document.getElementById('resultado');

function popularMenuFuncionarias() {
    const nomes = Object.keys(regrasComissao);
    for (const nome of nomes) {
        const option = document.createElement('option');
        option.value = nome;
        option.textContent = nome;
        funcionarioSelect.appendChild(option);
    }
}
document.addEventListener('DOMContentLoaded', popularMenuFuncionarias);

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const nomeFuncionario = funcionarioSelect.value;
    const numAvaliacoes = parseInt(avaliacoesInput.value) || 0;

    if (!nomeFuncionario) {
        alert("Por favor, selecione uma funcionária primeiro!");
        fileInput.value = '';
        return;
    }
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const typedarray = new Uint8Array(e.target.result);
            processarPDF(typedarray, nomeFuncionario, numAvaliacoes);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Por favor, selecione um arquivo PDF válido.");
    }
}

async function processarPDF(pdfData, nomeFuncionario, numAvaliacoes) {
    resultadoDiv.textContent = `Analisando o relatório para ${nomeFuncionario}...`;
    resultadoDiv.style.display = 'block';

    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    let textoCompleto = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        textContent.items.forEach(item => {
            textoCompleto += item.str + ' ';
        });
    }

    analisarTextoDoPDF(textoCompleto, nomeFuncionario, numAvaliacoes);
}

function analisarTextoDoPDF(texto, nomeFuncionario, numAvaliacoes) {
    const textoLimpo = texto.replace(/\s+/g, ' ').trim();
    const regexTotalSemFrete = /TOTAL DOS PEDIDOS \(SEM FRETE\).*?R\$ ([\d.,]+)/;
    const regexTaxas = /TOTAL DE TAXAS.*?R\$ ([\d.,]+)/;
    const regexExtras = /TOTAL DE EXTRAS.*?R\$ ([\d.,]+)/;
    
    const matchTotal = textoLimpo.match(regexTotalSemFrete);
    const matchTaxas = textoLimpo.match(regexTaxas);
    const matchExtras = textoLimpo.match(regexExtras);

    const converterMoedaParaNumero = (str) => {
        if (!str) return 0;
        return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    };

    if (!matchTotal) {
        resultadoDiv.textContent = 'Não foi possível encontrar o "TOTAL DOS PEDIDOS (SEM FRETE)" no PDF.';
        return;
    }

    const totalPedidosSemFrete = converterMoedaParaNumero(matchTotal[1]);
    const totalTaxas = converterMoedaParaNumero(matchTaxas ? matchTaxas[1] : '0');
    const totalExtras = converterMoedaParaNumero(matchExtras ? matchExtras[1] : '0');
    
    const baseCalculoComissao = totalPedidosSemFrete - totalTaxas - totalExtras;
    const regrasDaFuncionario = regrasComissao[nomeFuncionario].metas;
    const nomesMetas = ["PRIMEIRA", "SEGUNDA", "TERCEIRA", "QUARTA", "QUINTA"];
    
    let comissao = 0;
    let percentualAtingido = 0;
    // MUDANÇA 1: Variável para guardar o NOME da meta
    let nomeMetaAtingida = "NENHUMA"; 

    // O loop continua o mesmo, mas agora guarda também o nome da meta
    for (let i = 0; i < regrasDaFuncionario.length; i++) {
        const meta = regrasDaFuncionario[i];
        if (baseCalculoComissao >= meta.valor) {
            percentualAtingido = meta.percentual;
            comissao = baseCalculoComissao * (meta.percentual / 100);
            
            // MUDANÇA 2: Descobrimos o nome da meta
            const indiceNomeMeta = regrasDaFuncionario.length - 1 - i;
            nomeMetaAtingida = nomesMetas[indiceNomeMeta];
            
            break;
        }
    }
    
    const bonusAvaliacoes = numAvaliacoes * valorPorAvaliacao;
    const totalFinal = comissao + bonusAvaliacoes;

    // MUDANÇA 3: Enviamos o nome da meta para a função de exibição
    exibirResultado(nomeFuncionario, baseCalculoComissao, comissao, numAvaliacoes, bonusAvaliacoes, totalFinal, nomeMetaAtingida);
}

// MUDANÇA 4: A função agora recebe "nomeMeta" no final
function exibirResultado(nome, baseCalculo, comissao, numAvaliacoes, bonus, total, nomeMeta) {
    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const getSaudacao = () => {
        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) return 'Bom dia';
        if (hora >= 12 && hora < 18) return 'Boa tarde';
        return 'Boa noite';
    };
    
    const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
    const dataAtual = new Date();
    const mesAtual = meses[dataAtual.getMonth()];
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    const mesRelatorio = meses[dataAtual.getMonth()];

    // MUDANÇA 5: A linha abaixo agora usa diretamente a variável "nomeMeta"
    const metaBatidaStr = nomeMeta;
    
    const nomesMetasDisplay = ["PRIMEIRA", "SEGUNDA", "TERCEIRA", "QUARTA", "QUINTA"];
    const regras = [...regrasComissao[nome].metas].reverse(); // Copia e inverte para listar da menor para a maior
    let metasStr = "";
    regras.forEach((meta, index) => {
        metasStr += `${nomesMetasDisplay[index]}: ${formatarMoeda(meta.valor)} = ${meta.percentual.toLocaleString('pt-BR')}% \n`;
    });
    
    const mensagemFinal = `
${getSaudacao()}, ${nome}

VALORES DE ${mesRelatorio}
ENTREGUE: ${formatarMoeda(baseCalculo)}
META BATIDA= ${metaBatidaStr.toUpperCase()}
COMISSÃO: ${formatarMoeda(comissao)}
${String(numAvaliacoes).padStart(2, '0')} AVALIAÇÕES GOOGLE: ${formatarMoeda(bonus)}
TOTAL: ${formatarMoeda(total)}

REFERÊNCIA DA META PARA ${mesAtual}
${metasStr}
LEMBRETE: É sempre importante aumentar a EMISSÃO para crescer o resultado ENTREGUE
Bora correr atrás!!
    `;

    resultadoDiv.textContent = mensagemFinal.trim();
    resultadoDiv.style.display = 'block';
}