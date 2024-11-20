// Recuperar Informação do Banco de dados
//Criar movimentação e adicionar classe para mudar a core subir contador
//Apagar movimentação e apagar do contador

//Área do Funciona :3
async function CarregarDB() {
    const db = await(await fetch("http://localhost:3000/transacoes")).json();
    console.log(db);
    db.forEach((transacao) => {mostrarTransacoes(transacao)})
}

function mostrarTransacoes(transacao){
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
    transacoes_info_valuefinal.textContent = "5.9999"; //tem que arrumar isso
    
    const del = document.createElement("span");
    del.classList.add("delete");
    del.textContent = "X";
    
    const transacoes = document.createElement("div");
    transacoes.classList.add("transacoes");
    
    transacoes.setAttribute("data-id", transacao.id);
    // Parte que adiciona o saldo na tela
    // await atualizarSaldo()

    transacoes_info.append(transacoes_info_text_one,transacoes_info_value,transacoes_info_text_two,transacoes_info_valuefinal);
    transacoes.append(transacoes_info,del);
    document.querySelector("#transacoes").appendChild(transacoes);
    adicionarevento()
    
}

async function criarEntrada(){
    let valor = document.querySelector("#valor").value;
    if (valor != "") {
        let objeto = {
            "valor": (valor).toString(),
            "saldoFinal": ("5000").toString()
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
        console.log("Linha 74");
    }
    document.getElementById('valor').value = "";
}

async function criarSaida() {
    let valor = document.getElementById("valor").value;
    if (valor != "") {
        let objeto = {
            "valor": ("-" +( valor).toString()),
            "saldoFinal": ("5000").toString()
        }

        const envio = await fetch("http://localhost:3000/transacoes",{
            method: "POST",
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': "application/json"
            }
        })

        const transacaoSalva = await envio.json();
        mostrarTransacoes(transacaoSalva);
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
        transacao.remove();

        await fetch(`http://localhost:3000/transacoes/${transacaoId}`,{
            method: "DELETE"
        })
    }
}

async function init() {
    await CarregarDB();

    //Eventos de Botões
    //OBS: é passado sem parênteses pois não devem ser chamadas imediatamente
    document.querySelector("#depositar").addEventListener('click',criarEntrada);
    document.querySelector("#transferir").addEventListener('click',criarSaida);

    //Testes
    // const saldoAtualizado = testeApi();
    // console.log("Saldo atualizado:", saldoAtualizado);
}

//inicializador geral
document.addEventListener("DOMContentLoaded", init);

////Área de Testes-----------------------------------------------------------XD

// async function testeApi(valor) {
//     try {
//         // Faz a requisição GET para obter o saldo atual
//         const response = await fetch("http://localhost:3000/banco");

//         if (!response.ok) {
//             throw new Error('Falha ao carregar o saldo');
//         }
//         const data = await response.json();
        
//         // Suponha que o saldo esteja no campo 'valor'
//         const saldoAtual = data.saldo;
//         const novoSaldo = saldoAtual + 100;  // Exemplo: Adiciona 100 ao saldo atual

//         // Faz a requisição PUT para atualizar o saldo
//         const envio = await fetch("http://localhost:3000/banco/", {
//             method: "PUT",
//             body: JSON.stringify({ saldo: novoSaldo }),  // Atualiza com o novo saldo
//             // body: JSON.stringify({novoSaldo}),  // Atualiza com o novo saldo
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         if (!envio.ok) {
//             throw new Error('Falha ao atualizar o saldo');
//         }

//         // Lê a resposta da requisição PUT e retorna o saldo atualizado
//         const saldoAtualizado = await envio.json();
//         console.log(saldoAtualizado);  // Verifica o saldo após a atualização
//         return saldoAtualizado;  // Retorna o saldo atualizado ou qualquer outro dado
//     } catch (error) {
//         console.error('Erro na API:', error);
//     }
// }


// async atualizarSaldo() {

// }

function juntarValor(){
    console.log("Aqui")
}