// ***** ATENÇÃO: EDITE ESTA ÁREA 1 *****
// Adicione ou altere as funcionárias e suas respectivas metas aqui.
// As metas devem ser listadas da MAIOR para a MENOR.

const valorPorAvaliacao = 2.00; 
const regrasIniciais = {
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
// =================================================================================
// ELEMENTOS DO HTML (DOM)
// =================================================================================

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

const funcionarioSelect = document.getElementById('selecionaFuncionario');
const avaliacoesInput = document.getElementById('avaliacoesGoogle');
const fileInput = document.getElementById('pdfFile');
const resultadoDiv = document.getElementById('resultado');

// Elementos do Modal
const modal = document.getElementById('modalGerenciamento');
const btnGerenciar = document.getElementById('btnGerenciar');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnSalvarFuncionario = document.getElementById('btnSalvarFuncionario');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const listaFuncionariasDiv = document.getElementById('listaFuncionarias');
const formTitulo = document.getElementById('formGerenciamentoTitulo');
const inputNome = document.getElementById('inputNome');
const inputNomeOriginal = document.getElementById('inputNomeOriginal');
// Novos elementos para metas dinâmicas
const metasContainer = document.getElementById('metas-container');
const btnAdicionarMeta = document.getElementById('btnAdicionarMeta');


// =================================================================================
// FUNÇÕES DE GERENCIAMENTO DE DADOS (localStorage)
// =================================================================================

function getRegras() {
    const regrasSalvas = localStorage.getItem('regrasComissao');
    if (regrasSalvas) {
        return JSON.parse(regrasSalvas);
    } else {
        localStorage.setItem('regrasComissao', JSON.stringify(regrasIniciais));
        return regrasIniciais;
    }
}

function saveRegras(regras) {
    localStorage.setItem('regrasComissao', JSON.stringify(regras));
}


// =================================================================================
// LÓGICA PRINCIPAL E EVENTOS
// =================================================================================

let regrasComissao = getRegras();

function popularMenuFuncionarias() {
    funcionarioSelect.innerHTML = '<option value="">-- Escolha uma opção --</option>';
    const nomes = Object.keys(regrasComissao).sort();
    for (const nome of nomes) {
        const option = document.createElement('option');
        option.value = nome;
        option.textContent = nome;
        funcionarioSelect.appendChild(option);
    }
}

document.addEventListener('DOMContentLoaded', popularMenuFuncionarias);
fileInput.addEventListener('change', handleFileSelect);


// =================================================================================
// LÓGICA DO MODAL DE GERENCIAMENTO (CRUD) - ATUALIZADA
// =================================================================================

function criarLinhaDeMeta(valor = '', percentual = '') {
    const metaRow = document.createElement('div');
    metaRow.className = 'meta-row';
    
    metaRow.innerHTML = `
        <input type="number" class="input-meta-valor" placeholder="Valor da Meta (Ex: 5000)" value="${valor}">
        <input type="number" class="input-meta-percentual" placeholder="% (Ex: 2.5)" value="${percentual}">
        <button type="button" class="btn-remover-meta">&times;</button>
    `;
    
    metaRow.querySelector('.btn-remover-meta').addEventListener('click', () => {
        metaRow.remove();
    });
    
    metasContainer.appendChild(metaRow);
}

function renderizarGerenciador() {
    listaFuncionariasDiv.innerHTML = '';
    const nomes = Object.keys(regrasComissao).sort();

    if (nomes.length === 0) {
        listaFuncionariasDiv.innerHTML = '<p>Nenhuma funcionária cadastrada.</p>';
        return;
    }

    nomes.forEach(nome => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        const metasStr = regrasComissao[nome].metas.map(m => `${m.percentual}%`).join(' / ');
        itemDiv.innerHTML = `<div class="item-info"><strong>${nome}</strong><span>Metas: ${metasStr}</span></div><div class="item-actions"><button class="btn-terciario btn-editar" data-nome="${nome}">Editar</button><button class="btn-terciario btn-excluir" data-nome="${nome}">Excluir</button></div>`;
        listaFuncionariasDiv.appendChild(itemDiv);
    });
}

function abrirModal() {
    renderizarGerenciador();
    resetarFormularioModal();
    modal.classList.remove('hidden');
}

function fecharModal() {
    modal.classList.add('hidden');
}

function resetarFormularioModal() {
    formTitulo.textContent = 'Adicionar Nova Funcionária';
    inputNome.value = '';
    inputNomeOriginal.value = '';
    metasContainer.innerHTML = ''; // Limpa as linhas de meta
    btnCancelarEdicao.classList.add('hidden');
    inputNome.disabled = false;
}

function handleSalvarFuncionario() {
    const nome = inputNome.value.trim();
    const nomeOriginal = inputNomeOriginal.value;
    
    if (!nome) {
        alert('Por favor, preencha o nome.');
        return;
    }
    
    const metasArray = [];
    const metaRows = metasContainer.querySelectorAll('.meta-row');

    for (const row of metaRows) {
        const valorInput = row.querySelector('.input-meta-valor');
        const percentualInput = row.querySelector('.input-meta-percentual');
        
        const valor = parseFloat(valorInput.value);
        const percentual = parseFloat(percentualInput.value);

        if (!isNaN(valor) && !isNaN(percentual)) {
            metasArray.push({ valor, percentual });
        }
    }

    if (metasArray.length === 0) {
        alert('Adicione pelo menos uma meta válida.');
        return;
    }
    
    metasArray.sort((a, b) => b.valor - a.valor);

    if (nomeOriginal && nomeOriginal !== nome) {
        delete regrasComissao[nomeOriginal];
    }
    
    regrasComissao[nome] = { metas: metasArray };
    saveRegras(regrasComissao);
    popularMenuFuncionarias();
    renderizarGerenciador();
    resetarFormularioModal();
}

function handleEditarFuncionario(nome) {
    const dados = regrasComissao[nome];
    if (!dados) return;

    resetarFormularioModal();
    formTitulo.textContent = `Editando: ${nome}`;
    inputNome.value = nome;
    inputNomeOriginal.value = nome;
    
    // Popula as metas dinamicamente
    dados.metas.forEach(meta => {
        criarLinhaDeMeta(meta.valor, meta.percentual);
    });

    btnCancelarEdicao.classList.remove('hidden');
}

function handleExcluirFuncionario(nome) {
    if (confirm(`Tem certeza que deseja excluir ${nome}? Esta ação não pode ser desfeita.`)) {
        delete regrasComissao[nome];
        saveRegras(regrasComissao);
        popularMenuFuncionarias();
        renderizarGerenciador();
    }
}

// Eventos do Modal
btnGerenciar.addEventListener('click', abrirModal);
btnFecharModal.addEventListener('click', fecharModal);
modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });
btnSalvarFuncionario.addEventListener('click', handleSalvarFuncionario);
btnCancelarEdicao.addEventListener('click', resetarFormularioModal);
btnAdicionarMeta.addEventListener('click', () => criarLinhaDeMeta());

listaFuncionariasDiv.addEventListener('click', (e) => {
    const nome = e.target.dataset.nome;
    if (e.target.classList.contains('btn-editar')) { handleEditarFuncionario(nome); }
    if (e.target.classList.contains('btn-excluir')) { handleExcluirFuncionario(nome); }
});


// =================================================================================
// LÓGICA DE CÁLCULO (Permanece a mesma)
// =================================================================================
function handleFileSelect(event) {
    // ...código de cálculo permanece inalterado...
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
    } else if (file) { // Se um arquivo foi selecionado mas não é PDF
        alert("Por favor, selecione um arquivo PDF válido.");
        fileInput.value = ''; // Limpa a seleção
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
        textContent.items.forEach(item => { textoCompleto += item.str + ' '; });
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
    let nomeMetaAtingida = "NENHUMA"; 

    for (let i = 0; i < regrasDaFuncionario.length; i++) {
        const meta = regrasDaFuncionario[i];
        if (baseCalculoComissao >= meta.valor) {
            percentualAtingido = meta.percentual;
            comissao = baseCalculoComissao * (meta.percentual / 100);
            const indiceNomeMeta = regrasDaFuncionario.length - 1 - i;
            nomeMetaAtingida = nomesMetas[indiceNomeMeta];
            break;
        }
    }
    
    const bonusAvaliacoes = numAvaliacoes * valorPorAvaliacao;
    const totalFinal = comissao + bonusAvaliacoes;

    exibirResultado(nomeFuncionario, baseCalculoComissao, comissao, numAvaliacoes, bonusAvaliacoes, totalFinal, nomeMetaAtingida);
}

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
    const metaBatidaStr = nomeMeta;
    
    const nomesMetasDisplay = ["PRIMEIRA", "SEGUNDA", "TERCEIRA", "QUARTA", "QUINTA"];
    const regras = [...regrasComissao[nome].metas].reverse();
    let metasStr = "";
    regras.forEach((meta, index) => {
        metasStr += `${nomesMetasDisplay[index]}: ${formatarMoeda(meta.valor)} = ${meta.percentual.toLocaleString('pt-BR')}% \n`;
    });
    
    const mensagemFinal = `
${getSaudacao()}, ${nome}

VALORES DE ${mesRelatorio} ENTREGUE: ${formatarMoeda(baseCalculo)}
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
