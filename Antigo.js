async function recoverInfo(){
    let responseNoJson = await fetch("http://localhost:3000/trasacoes")
    response = await responseNoJson.json()
    response.forEach((transation) =>{
        renderTrasation(transation)
    })
}

async function saldo() {
    const response = await(await fetch("http://localhost:3000/banco")).json()
    let saldo = response.saldo
    document.getElementById("saldoValor").innerHTML = saldo
}

document.addEventListener("DOMContentLoaded", ()=>{
    recoverInfo();
    saldo(); // quando for usar algo que mude o saldo, implemente essa função
})

function renderTrasation(info) {
    const trasacoesAba = document.querySelector("#transacoes");

    const div = document.createElement("div");
    div.classList.add("transacoes");

    const spanMovimento = document.createElement("span");
    spanMovimento.classList.add("transacoes_entry");
    spanMovimento.classList.add(verificarTrasation(info.movimentacao))
    spanMovimento.textContent = info.movimentacao == "+"? "ENTRADA":"SAÍDA";

    const trasationsInfo = document.createElement("div");
    trasationsInfo.classList.add("transacoes_info");

    const spanText = document.createElement("span");
    spanText.textContent = "Valor:";

    const transacoes_info_value = document.createElement("span");
    transacoes_info_value.classList.add("transacoes_info_value");
    transacoes_info_value.textContent = info.valor;
    
    const spanTextFinal = document.createElement("span");
    spanTextFinal.textContent = "Saldo Final:";

    const saldoInfo = document.createElement("span");
    saldoInfo.textContent = info.saldo;

    const del = document.createElement("span");
    del.classList.add("delete");
    del.textContent = "X";

    trasationsInfo.append(spanText,transacoes_info_value,spanTextFinal,saldoInfo);
    div.append(spanMovimento,trasationsInfo,del);
    trasacoesAba.append(div);
}

function verificarTrasation(transation) {
    if (transation == "+") {
        return "positivo";
    }
    else if (transation == "-") {
        return "negativo";
    }
}

//Removedor de transações
// implementar a função que apaga do database -----------------------
document.querySelectorAll('.transacoes').forEach(item => {
    item.addEventListener('click', (e) => {
        elemento = e.target;
        if (elemento.classList.contains('delete')) {
            elemento.parentNode.remove();
        }
    })
})

//Falta implementar o contador
async function novoMovimento(sinalMovimento) {
    const response = await(await fetch("http://localhost:3000/banco")).json()

    const valor = document.querySelector("#valor").value;
    await countTrasaction("+");
    let contador = Number(response.contador);
    //tenho que fazer o contador ser enviado pro banco de dados
    if (valor != ""){
        let movimentacao =  {
            id: (contador).toString(),
            valor: (valor).toString(),
            movimentacao: (sinalMovimento).toString(),
            saldo: (response.saldo).toString()
        }
        const envio = await fetch("http://localhost:3000/trasacoes",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movimentacao),
        })
        const movimentacaoSalva = await envio.json()
        renderTrasation(movimentacaoSalva)
        document.querySelector("#valor").value = "";
    } else{
        console.log("Deu erro aqui linha 90");
    }
}
// countTrasaction()
async function countTrasaction(entrada){
    const response = await(await fetch('http://localhost:3000/banco')).json()
    let contador;
    if (entrada == "+"){
        contador = Number(response.contador) + 1;
    }else{
        contador = Number(response.contador) - 1;
    }

    const envio = await fetch('http://localhost:3000/banco',{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contador)
    })
       const novoContador = await envio.json();
       console.log(novoContador);
}

document.querySelector('#depositar').addEventListener('click',() => {novoMovimento("+")});
document.querySelector('#transferir').addEventListener('click',() => {novoMovimento("-")});
