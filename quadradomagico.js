let ordem = 0;
let matriz = [];
let somaNumeros = 0;

document.addEventListener('DOMContentLoaded', () => {
    iniciaAe();
});

function iniciaAe() {
    const div = document.createElement('div');
    document.body.append(div);

    const textoInicio = document.createElement('p');
    textoInicio.classList.add('textoinicio');
    textoInicio.innerText = "Em uma escala de 1 a infinito, o quão você é bom?"
    div.append(textoInicio);

    const input = document.createElement('input');
    input.classList.add('ordem');
    div.append(input)

    input.addEventListener('change', () => {
        ordem = parseInt(input.value);
        matriz = Array(ordem)
        for (let i=0; i<matriz.length; i++) {
            matriz[i] = Array(ordem);
        }
        somaNumeros = (ordem + ordem**3)/2;
        textoInicio.remove();
        input.remove();
        insereTabela();
    });
}

function insereTabela() {
    const tabela = document.createElement('table');
    tabela.id = 'quadradomagico';
    document.body.append(tabela);
    for (let i=0; i<ordem; i++) {
        const linha = document.createElement('tr');
        tabela.append(linha);
        for (let j=0; j<ordem; j++) {
            const celula = document.createElement('td');
            linha.append(celula)
            celula.id = `lin${i}col${j}`;
            insereInput(celula);
        }
    }
}

function getLinhaColuna(celula) {
    const [linha,coluna] = celula.id.split('col');
    return [linha.split('lin')[1],coluna];
}

function insereInput(celula) {
    const input = document.createElement('input');
    celula.append(input);
    input.addEventListener('change', () => {
        const valor = parseInt(input.value);
        const [linha,coluna] = getLinhaColuna(celula);
        matriz[linha][coluna] = valor;
        const quadradroCompleto = verificaMatriz();
        if (quadradroCompleto) {
            document.querySelector('#quadradomagico').classList.add('vitoria');
            document.querySelectorAll('input').forEach(input => {
                input.readOnly = true;
            })
            criaTextoParabens();
            criaBotaoReinicia();
        }
    });
}

function criaTextoParabens() {
    const parabens = document.createElement('p');
    parabens.innerText = "Parabéns :D Vamos jogar de novo? :)"
    document.body.append(parabens);
}

function criaBotaoReinicia() {
    const botaoReinicia = document.createElement('button');
    botaoReinicia.innerText = "Reiniciar"
    document.body.append(botaoReinicia);
    botaoReinicia.addEventListener('click', () => {
        const tabela = document.querySelector('#quadradomagico');
        const parabens = document.querySelector('p');
        tabela.remove();
        parabens.remove();
        botaoReinicia.remove();
        iniciaAe();
    })
}



function verificaMatriz() {
    const numerosRepetidos = verificaNumerosRepetidos();
    const numerosForaDosLimites = verificaNumerosForaDosLimites();
    const todasSomaOK = verificaSomas();
    return !numerosRepetidos && !numerosForaDosLimites && todasSomaOK;
}

function verificaSomas() {
    const diagonalPrincipalOK = verificaSomaDiagonalPrincipal();
    const diagonalSecundariaOK = verificaSomaDiagonalSecundaria();
    const todasLinhasOK = verificaSomaLinhas();
    const todasColunasOK = verificaSomaColunas();
    return diagonalPrincipalOK && diagonalSecundariaOK && todasLinhasOK && todasColunasOK;
}

function verificaSomaColunas() {
    let todasColunasOK = true;
    for (let j=0; j<ordem; j++) {
        todasColunasOK &= verificaSomaColuna(j);
    }
    return todasColunasOK;
}

function verificaSomaColuna(j) {
    let soma = 0;
    for (let i=0; i<ordem; i++) {
        if (matriz[i][j] == null) return false;
        soma += matriz [i][j];
    }
    if (soma != somaNumeros) {
        for (let i=0; i<ordem; i++) {
            atribuiClasseCelula("somaerradacoluna", i, j);
        }
        return false;
    } else {
        for (let i=0; i<ordem; i++) {
            removeClasseCelula("somaerradacoluna", i, j);
        }
    }
    return true;
}

function verificaSomaLinhas() {
    let todasLinhasOK = true;
    for (let i=0; i<ordem; i++) {
        todasLinhasOK &= verificaSomaLinha(i);
    }
    return todasLinhasOK;
}

function verificaSomaLinha(i) {
    let soma = 0;
    for (let j=0; j<ordem; j++) {
        if (matriz[i][j] == null) return false;
        soma += matriz [i][j];
    }
    if (soma != somaNumeros) {
        for (let j=0; j<ordem; j++) {
            atribuiClasseCelula("somaerradalinha", i, j);
        }
        return false;
    } else {
        for (let j=0; j<ordem; j++) {
            removeClasseCelula("somaerradalinha", i, j);
        }
    }
    return true;
}

function verificaSomaDiagonalSecundaria() {
    let soma = 0;
    for (let i=0; i<ordem; i++) {
        if (matriz[i][ordem-i-1] == null) return false;
        soma += matriz [i][ordem-i-1];
    }
    if (soma != somaNumeros) {
        for (let i=0; i<ordem; i++) {
            atribuiClasseCelula("somaerradadiagonalsecundaria", i, ordem-i-1);
        }
        return false;
    } else {
        for (let i=0; i<ordem; i++) {
            removeClasseCelula("somaerradadiagonalsecundaria", i, ordem-i-1);
        }
    }
    return true;
}

function verificaSomaDiagonalPrincipal() {
    let soma = 0;
    for (let i=0; i<ordem; i++) {
        if (matriz[i][i] == null) return false;
        soma += matriz [i][i];
    }
    if (soma != somaNumeros) {
        for (let i=0; i<ordem; i++) {
            atribuiClasseCelula("somaerradadiagonalprincipal", i, i);
        }
        return false;
    } else {
        for (let i=0; i<ordem; i++) {
            removeClasseCelula("somaerradadiagonalprincipal", i, i);
        }
    }
    return true;
}

function verificaNumerosForaDosLimites() {
    const minimo = 1;
    const maximo = ordem**2;
    let numerosForaDosLimites = false;
    for (let i=0; i<ordem; i++) {
        for (let j=0; j<ordem; j++){
            if (matriz[i][j] < minimo || matriz[i][j] > maximo) {
                numerosForaDosLimites = true;
                atribuiClasseCelula('foradoslimites', i, j);
            } else {
                removeClasseCelula('foradoslimites', i, j);
            }
        }
    }
    return numerosForaDosLimites;
}

function verificaNumerosRepetidos() {
    const numeros = Array(ordem**2).fill(0);
    let numerosRepetidos = false;
    for (let i=0; i<ordem; i++) {
        for (let j=0; j<ordem; j++) {
            const valor = matriz[i][j];
            if (!isNaN(valor)) {
                numeros[valor-1]++;
            }
        }
    }
    for (let i=0; i<ordem; i++) {
        for (let j=0; j<ordem; j++) {
            const valor = matriz [i][j];
            if (!isNaN(valor) && numeros[valor-1] > 1) {
                numerosRepetidos = true;
                atribuiClasseCelula('numerosrepetidos', i, j);
            } else {
                removeClasseCelula('numerosrepetidos', i, j);
            }
        }
    }
    return numerosRepetidos;
}

function atribuiClasseCelula(classe, i, j) {
    const celula = document.querySelector(`#lin${i}col${j}`);
    celula.classList.add(classe);
}

function removeClasseCelula(classe, i, j) {
    const celula = document.querySelector(`#lin${i}col${j}`);
    celula.classList.remove(classe);
}