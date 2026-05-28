import { useState } from 'react'
import './App.css'
import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip} from "recharts";

const alphai = Math.random() * 10 + 1; // Gerar um valor aleatório para alpha entre 1 e 10
function App() {


const [yD, setyD] = useState([]); // Array para armazenar os valores da reta diagonal
  
const [xL, setxL] = useState([]); // Array para armazenar os valores de xL - fração molar do componente mais volátil na fase líquida
const [yV, setyV] = useState([]); // Array para armazenar os valores de yV - fração molar do componente mais volátil na fase vapor
const alpha = parseFloat(alphai.toFixed(2)); // Arredondar o valor de alpha para 2 casas decimais
let m=0; // Variável para armazenar o valor de m - coeficiente angular da reta de esgotamento
let p=0; // Variável para controlar o índice do array

const [xF, setxF] = useState(0); // Fração molar do componente mais volátil na alimentação
const [xD, setxD] = useState(0); // Fração molar do componente mais volátil no destilado
const [xB, setxB] = useState(0); // Fração molar do componente mais volátil no resíduo
const [R, setR] = useState(0); // Razão de refluxo
const [q, setq] = useState(0); // Razão de alimentação


const [yR, setyR] = useState([]); // Array para armazenar os valores de yR - fração molar do componente mais volátil na fase vapor em cada prato para a curva de retificação  
const [yA, setyA] = useState([]); // Array para armazenar os valores de yA - fração molar do componente mais volátil na fase vapor em cada prato para a curva de alimentação
const [xA, setxA] = useState([]); // Array para armazenar os valores de xA - fração molar do componente mais volátil na fase líquida em cada prato para a curva de alimentação
const [yE, setyE] = useState([]); // Array para armazenar os valores de yE - fração molar do componente mais volátil na fase vapor em cada prato para a curva de esgotamento
let xEncontro = 0; // Variável para armazenar o valor de x no ponto de encontro entre as curvas de retificação e alimentação

const [xP, setxP] = useState([]); // Array para armazenar os valores de xP - fração molar do componente mais volátil na fase líquida em cada prato
const [yP, setyP] = useState([]); // Array para armazenar os valores de yP - fração molar do componente mais volátil na fase vapor em cada prato
let numeroPratos = 0; // Variável para armazenar o número de pratos teóricos necessários para a separação
let marcadorPratos=0; // Variável para controlar o índice do array dos pratos teóricos

function calcularCurvaELV() {
  const novoXL = [];
  const novoYV = [];
  const novoXD = [];
  const novoYD = [];

  for (let x = 0; x <= 1; x += 0.01) {
    const y =  (alpha * x) /  (1 + (alpha - 1) * x);

    novoXL.push(x);
    novoYV.push(y);

    }

      for (let x = 0; x <= 1; x += 0.01) {
    const y =  x;

    novoXD.push(x);
    novoYD.push(y);

    }

  setxL(novoXL);
  setyV(novoYV);

  setyD(novoYD);

} 


function calcularPratosTeoricos() {

  //calcular a curva de retificação
  const novoXR = [];
  const novoYR = [];
p=0;
 
  for (let x = 0; x <= 1; x += 0.01) {
    const y =  R /  (R + 1) * x +  xD /  (R + 1);
    if(x<xD){
      novoXR.push(x);
    novoYR.push(y);
    }
    else{   
    novoXR.push(x);
      novoYR.push(null);
  }

  }
p=p+1;
  setyR(novoYR);



  //calcular a curva de alimentação
  const novoYA = [];
  const novoXA = [];
  p=0;
  
  for (let x = 0; x <= 1; x += 0.01) {

    const y =  q /  (q - 1) * x +  xF /  (1 - q);

    if (x <= xF+0.01) { 
      novoYA.push(y);
      novoXA.push(x);
    } else {
      novoYA.push(null);
      novoXA.push(null);
    }
    p = p + 1;
  }

  setyA(novoYA);
  setxA(novoXA);

  //calcular a curva de esgotamento

  // Calcular o valor de m - coeficiente angular da reta de esgotamento
  p=0;
  for (let x = 0; x <= 1; x += 0.01) { 
    if (Math.abs(novoYR[p] - novoYA[p]) < 0.01) {
      m=(novoYR[p]-xB)/(x-xB)
      x=1
    }
p=p+1
  }

//calcular a curva de esgotamento
  const novoXE = [];
  const novoYE = [];

 
  for (let x = 0; x <= 1; x += 0.01) {

  const y =  m * (x - xB) + xB;

    if(x<xB){
      novoXE.push(x);
      novoYE.push(null);
    }
    else{ 
    novoXE.push(x);
    novoYE.push(y);
    }
  }

  setyE(novoYE);

  //Limpar curvas anteriores
  let marcador=0; // Variável para controlar a limpeza das curvas
  for(let p=0; p<=100; p+=1){

    // Limpar a curva de retificação
if(novoYR[p] < novoYA[p]){
      novoYR[p-1] = null;
}

    // limpar a curva de alimentação
if(novoYR[p] < novoYA[p]){
      novoYA[p-1] = null;
     xEncontro = novoXA[p]; // Armazenar o valor de x no ponto de encontro entre as curvas de retificação e alimentação
  }
  else {
    marcador=1;
  }

    // limpar a curva de esgotamento
if(marcador==1){
      novoYE[p+1] = null;
}

// Desenhar no grafico os pratos teóricos
  const novoXP = [];
  const novoYP = [];
p=0;
for(let x=0; x<=1; x+=0.01){


if(marcadorPratos==2){ {/*Atribui os pontos quando o gráfico anda na vertical*/}

  if(novoXP[p-1] > xEncontro){ {/*Calcula x quando está na linha de retificação*/}
novoXP.push(novoXP[p-1]);
novoYP.push(R /  (R + 1) * novoXP[p] +  xD /  (R + 1));
marcadorPratos=1;
  }

  if(novoXP[p-1] < xEncontro){ {/*Calcula x quando está na linha de esgotamento*/}
novoXP.push(novoXP[p-1]);
novoYP.push(m * (novoXP[p] - xB) + xB);
marcadorPratos=1;
  }

}

if(marcadorPratos==1){ {/*Atribui os pontos quando o gráfico anda na horizontal*/}
  novoYP.push(novoYP[p-1]);

  const x=novoYP[p] /(alpha-novoYP[p]*(alpha-1));// Calcula x quando está na linha de equilíbrio líquido-vapor
  
  novoXP.push(x);
  marcadorPratos=2;
}

if(Math.abs(novoXR[98-p]-xD)<=0.001){ {/*Atribui o primeiro ponto dos pratos teóricos como o ponto de destilado (xD, xD)*/}
  novoXP.push(xD);
  novoYP.push(xD);
  marcadorPratos=1;

}

else{
  novoXP.push(null);
  novoYP.push(null);

}

numeroPratos=numeroPratos+1; // Incrementa o número de pratos teóricos a cada iteração
console.log(p, marcadorPratos, numeroPratos, novoXP[p], novoYP[p], xEncontro, alpha, novoYP[p] * (alpha - 1) / alpha);
p=p+1;
}

  }
}

  return (

    <div className="App">
  
        <h1>Aplicação do Método de McCabe-Thiele</h1>


      <div className="explicacao">
        <p>
          "O método de McCabe-Thiele é uma técnica comumente empregada na área de
          engenharia química para modelar a separação de duas substâncias por uma
          coluna de destilação. Ele utiliza o fato de que a composição em cada
          prato teórico é completamente determinada pela fração molar de um dos
          dois componentes. Este método baseia-se nas premissas de que a coluna
          de destilação é isobárica — ou seja, a pressão permanece constante — e
          que as vazões de líquido e vapor não se alteram ao longo da coluna
          (ou seja, transbordamento molar constante)."
        </p>
                <p>
          "Instruções: <br>
           </br> 1. Clique no botão 'Calcular Curva ELV' para gerar a curva de Equilibrio Líquido Vapor<br>
           </br>  2. Insira os valores das variáveis: xF, xD, xB e R. <br>
           </br>  3. Clique no botão 'Calcular' para obter o número de pratos teóricos
            necessários para a separação. <br>
           </br>  4. Os resultados serão exibidos na tela, indicando o número de pratos
            teóricos necessários para alcançar a separação desejada."
        </p>
      
            </div>

<div className="curva_elv"> {/* Seção para a curva de equilíbrio líquido-vapor */}
        <h1>Curva de Equilíbrio Líquido-Vapor (ELV)</h1>
        <button onClick={calcularCurvaELV}>Calcular Curva ELV</button>
      </div>

      <div className="tabela_variaveis">
        <h1>Insira os valores das variáveis</h1>

<form> {/* Formulário para entrada dos valores das variáveis*/}

<input placeholder='Valor de xF' type="number" name="xF" id="xF" onChange={(event) => setxF(parseFloat(event.target.value))}/>
<input placeholder='Valor de xD' type="number" name="xD" id="xD" onChange={(event) => setxD(parseFloat(event.target.value))}/>
<input placeholder='Valor de xB' type="number" name="xB" id="xB" onChange={(event) => setxB(parseFloat(event.target.value))}/>
<input placeholder='Valor de R' type="number" name="R" id="R" onChange={(event) => setR(parseFloat(event.target.value))}/>
<input placeholder='Valor de q' type="number" name="q" id="q" onChange={(event) => setq(parseFloat(event.target.value))}/>

<button type="button" onClick={calcularPratosTeoricos}>Iniciar Cálculo de Pratos Teóricos</button> 

</form>
      </div>

<div className="resultado">
        <h1>Resultado</h1>
        <p>Número de pratos teóricos necessários: </p>
</div>

<div className="grafico"> {/* Seção para o gráfico da curva de equilíbrio líquido-vapor */}
<LineChart width={600} height={300} data={xL.map((x, index) => ({ xL: x, yD: yD[index], yV: yV[index], yR: yR[index], yA: yA[index] , yE: yE[index] }))}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="xL" label={{ value: 'Fração Molar na Fase Líquida (xL)', position: 'insideBottom', offset: -5 }} />
  <YAxis label={{ value: 'Fração Molar na Fase Vapor (yV)', angle: -90, position: 'insideLeft' }} />
  <Tooltip />
 
  {/*Curva x=y*/}
  <Line type="monotone" dataKey="yD" stroke="#010101" dot={false} />
 
  {/*Curva de equilíbrio líquido-vapor*/}
  <Line type="monotone" dataKey="yV" stroke="#8884d8" dot={false} />

  {/*Curva de retificação*/}
  <Line type="monotone" dataKey="yR" stroke="#82ca9d" dot={false} />
  
  {/*Curva de equilíbrio líquido-vapor*/}
  <Line type="monotone" dataKey="yA" stroke="#ff7300" dot={false} />

  {/*Curva de esgotamento*/}
  <Line type="monotone" dataKey="yE" stroke="#0022ff" dot={false} />
</LineChart>
</div>

  </div>
  )
}

export default App
