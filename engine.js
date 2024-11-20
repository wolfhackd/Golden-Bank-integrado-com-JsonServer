// Recuperar Informação do Banco de dados ----------
//Criar movimentação e adicionar classe para mudar a core subir contador
//Apagar movimentação e apagar do contador

//Área do Funciona :3
async function CarregarDB() {
    const db = await(await fetch("http://localhost:3000/transacoes")).json();
    db.forEach((transacao) => {mostrarTransacoes(transacao)})
}

async function mostrarTransacoes(transacao){
    const transacoes_entry = document.createElement("span");
    let valor = transacao.valor;
    let sinal = valor >0? "ENTRADA":"SAÍDA";
    transacoes_entry.classList.add(sinal);

    const transacoes_info = document.createElement("div");
    transacoes_info.classList.add("transacoes_info");


    const transacoes_info_text_one = document.createElement("span");
    transacoes_info_text_one.textContent = "Valor:"

    const transacoes_info_value = document.createElement("span");
    transacoes_info_value.classList.add("transacoes_info_value");
    let condicao = transacao.valor >0? "positivo":"negativo";
    transacoes_info_value.classList.add(condicao);
    transacoes_info_value.textContent = transacao.valor;

    const transacoes_info_text_two = document.createElement("span");
    transacoes_info_text_two.textContent = "Saldo Final:";

    const transacoes_info_valuefinal = document.createElement("span");
    transacoes_info_valuefinal.classList.add("transacoes_info_valuefinal");
    // transacoes_info_valuefinal.textContent = (Number(transacao.saldoFinal) + (Number(transacao.valor))); //tem que arrumar isso
    transacoes_info_valuefinal.textContent = transacao.saldoFinal; //tem que arrumar isso
    
    const del = document.createElement("span");
    del.classList.add("delete");
    del.textContent = "X";
    
    
    const transacoes = document.createElement("div");
    transacoes.classList.add("transacoes");
    
    transacoes.setAttribute("data-id", transacao.id);
    
    transacoes_info.append(transacoes_info_text_one,transacoes_info_value,transacoes_info_text_two,transacoes_info_valuefinal);
    transacoes.append(transacoes_info,del);
    document.querySelector("#transacoes").appendChild(transacoes);
    adicionarevento()
    
}

async function criarEntrada(){
    let valor = document.querySelector("#valor").value;
    let saldo = Number(await carregarSaldo());
    if (valor != "") {
        let objeto = {
            "valor": Number(valor),
            "saldoFinal": saldo + Number(valor)
        }
        const envio = await fetch("http://localhost:3000/transacoes",{
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(objeto)
        })
        const transacaoSalva = await envio.json();
        mostrarTransacoes(transacaoSalva);
    }else{
        console.log("Linha 72");
    }
    somarSaldo(Number(valor)); // Funcionando
    document.getElementById('valor').value = "";
}

async function criarSaida() {
    let valor = document.getElementById("valor").value;
    let saldo = Number(await carregarSaldo());
    if (valor != "") {
        let objeto = {
            "valor": -Number(valor),
            "saldoFinal": saldo - Number(valor)
        }
        
        const envio = await fetch("http://localhost:3000/transacoes",{
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(objeto)
        })
        const transacaoSalva = await envio.json();
        mostrarTransacoes(transacaoSalva);
        somarSaldo(-Number(valor)); // Funcionando
    }else{
        return
    }
    document.getElementById('valor').value = "";

}

//Adiciona o evento de remover no final da renderização de transferencia
function adicionarevento() {
    document.querySelectorAll(".delete").forEach((botao) => {
        botao.addEventListener('click', (e) => deletarTransacao(e));
    })
}

async function deletarTransacao(e) {
    const elemento = e.target;
    let transacao = elemento.closest('.transacoes');
    if(transacao){
        let transacaoId = transacao.getAttribute("data-id")
        let transacaoValor = await(await fetch(`http://localhost:3000/transacoes/${transacaoId}`)).json();
        somarSaldo(-(transacaoValor.valor))
        
        transacao.remove();
        await fetch(`http://localhost:3000/transacoes/${transacaoId}`,{
            method: "DELETE"
        })
    }
}

async function carregarSaldo() {
    const data = await(await fetch("http://localhost:3000/banco")).json();
    const valorFormatado = new Intl.NumberFormat("pt-BR", {style: 'currency', currency: 'BRL'}).format(data.saldo)
    document.querySelector("#saldoValor").textContent = valorFormatado;
    return Number(data.saldo);
}

async function somarSaldo(valor) {
    let saldo = await carregarSaldo();
    let novoSaldo = saldo + (valor);
    console.log(novoSaldo);

    const envio = await fetch("http://localhost:3000/banco", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({saldo: novoSaldo})
    });
    carregarSaldo();
}

async function init() {
    await CarregarDB();

    //Eventos de Botões
    document.querySelector("#depositar").addEventListener('click',criarEntrada);
    document.querySelector("#transferir").addEventListener('click',criarSaida);
    carregarSaldo();    

}

//inicializador geral
document.addEventListener("DOMContentLoaded", init());

////Falta implementar -------------------------/-__-/ZZZZZZzzzzz



////Área de Testes-----------------------------------------------------------XD


