const dadosProducao = {
  "linha20k": {
    produtos: {
      "pppi": { label: "PP e PI", validade: 50, retirada: 35, envio: 10 },
      "artesanos": { label: "Artesanos", validade: 35, retirada: 23, envio: 09 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12, envio: 00 }
    }
  },
  "linha3": {
    produtos: {
      "paesEspeciais": { label: "Pães Especiais", validade: 35, retirada: 23, envio: 10 }, 
      "paesintegraise12graos": { label: "Pão Integral Zero e 12 Grãos 350g", validade: 28, retirada: 19, envio: 10 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12, envio: 00 }
    }
  },
  "bolleria": {
    produtos: {
      "brioche": { label: "Brioche", validade: 60, retirada: 45, envio: 15 }, 
      "artesanos": { label: "Artesanos", validade: 35, retirada: 23, envio: 09 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12, envio: 00 }
    }
  }
};

const seletorLinha = document.getElementById("seletorLinha");
const seletorProduto = document.getElementById("seletorProduto");
let diaMemoria = new Date().getDate();

document.addEventListener("DOMContentLoaded", () => {
  popularProdutos();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registrado!', reg.scope))
      .catch(err => console.log('Erro ao registrar Service Worker:', err));
  }
  
  setInterval(() => {
    const agora = new Date();
    document.getElementById("horaDigital").textContent = agora.toLocaleTimeString('pt-BR');
    
    if (agora.getDate() !== diaMemoria) {
      diaMemoria = agora.getDate();
      executarCalculos();
    }
  }, 1000);

  seletorLinha.addEventListener("change", popularProdutos);
  seletorProduto.addEventListener("change", executarCalculos);
  
  document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
});

function popularProdutos() {
  const linha = seletorLinha.value;
  const prods = dadosProducao[linha].produtos;
  seletorProduto.innerHTML = "";
  for (let chave in prods) {
    let opt = document.createElement("option");
    opt.value = chave;
    opt.textContent = prods[chave].label;
    seletorProduto.appendChild(opt);
  }
  executarCalculos();
}

function calcularSemanaCustomizada(dataAlvo) {
  const ano = dataAlvo.getFullYear();
  const primeiroDiaAno = new Date(ano, 0, 1);
  
  let diaSemanaPrimeiroDia = primeiroDiaAno.getDay(); 
  let diasAtePrimeiraQuarta = (3 - diaSemanaPrimeiroDia + 7) % 7;
  let primeiraQuartaFeira = new Date(ano, 0, 1 + diasAtePrimeiraQuarta);
  
  if (dataAlvo < primeiraQuartaFeira) {
    return 1;
  }
  
  const diffTempo = dataAlvo - primeiraQuartaFeira;
  const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
  
  return Math.floor(diffDias / 7) + 2;
}

function executarCalculos() {
  const hoje = new Date();
  const linhaVal = seletorLinha.value;
  const prodVal = seletorProduto.value;
  
  if (!dadosProducao[linhaVal]?.produtos[prodVal]) return;
  const info = dadosProducao[linhaVal].produtos[prodVal];

  document.getElementById("dataAtual").textContent = hoje.toLocaleDateString("pt-BR");

  const inicio = new Date(hoje.getFullYear(), 0, 0);
  const diff = hoje - inicio;
  const diaJuliano = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("dataJuliana").textContent = diaJuliano.toString().padStart(3, '0');

  const semanaCalculada = calcularSemanaCustomizada(hoje);
  document.getElementById("semanaProducao").textContent = semanaCalculada.toString().padStart(2, '0');

  const dVal = new Date(hoje); dVal.setDate(hoje.getDate() + info.validade);
  const dRet = new Date(hoje); dRet.setDate(hoje.getDate() + info.retirada);
  const dEnv = new Date(hoje); dEnv.setDate(hoje.getDate() + info.envio);

  document.getElementById("dataValidade").textContent = dVal.toLocaleDateString("pt-BR");
  document.getElementById("dataRetirada").textContent = dRet.getDate().toString().padStart(2, '0') + "/" + (dRet.getMonth() + 1).toString().padStart(2, '0');
  document.getElementById("dataEnvio").textContent = dEnv.getDate().toString().padStart(2, '0') + "/" + (dEnv.getMonth() + 1).toString().padStart(2, '0');
}