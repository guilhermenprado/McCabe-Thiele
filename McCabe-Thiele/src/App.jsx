import { useState } from 'react'
import './App.css'
import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip} from "recharts";

const alpha = Math.random() * 8; // Gerar um valor aleatório para alpha entre 0 e 10
function App() {


const [yD, setyD] = useState([]); // Array para armazenar os valores da reta diagonal
  
const [xL, setxL] = useState([]); // Array para armazenar os valores de xL - fração molar do componente mais volátil na fase líquida
const [yV, setyV] = useState([]); // Array para armazenar os valores de yV - fração molar do componente mais volátil na fase vapor

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

const [nPratos, setnPratos] = useState(0); // Estado para armazenar o número de pratos teóricos necessários para a separação
let numeroPratos = 0; // Variável para armazenar o número de pratos teóricos necessários para a separação
let marcadorPratos=0; // Variável para controlar o índice do array dos pratos teóricos
let confirmar=0;


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

    let a=0;
      for (let x = 0; x <= 1; x += 0.01) {
    const y =  x;

    novoXD.push(x);
    novoYD.push(y);

    a=a+1;
    //console.log(a, x);

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
if(yV[p] < novoYA[p]){
      novoYA[p-1] = null;
  
  }

  if(novoYR[p] < novoYA[p]){
     xEncontro = novoXA[p]; // Armazenar o valor de x no ponto de encontro entre as curvas de retificação e alimentação
  }

  else {
    marcador=1;
  }

    // limpar a curva de esgotamento
if(marcador==1){
      novoYE[p+1] = null;
}
  }

// Definir os pontos para os pratos teóricos
  const novoXP = [];
  const novoYP = [];
p=0;
for(let x=0; x<=1; x+=0.01){

  
if(marcadorPratos==2){ //Atribui os pontos quando o gráfico anda na vertical


  if(novoXP[p-1] > xEncontro){ //Calcula x quando está na linha de retificação
novoXP.push(novoXP[p-1]);
const y= R /  (R + 1) * novoXP[p] +  xD /  (R + 1);
novoYP.push(y);
marcadorPratos=1;
  }

  if(novoXP[p-1] < xEncontro){ //Calcula x quando está na linha de esgotamento

if(novoXP[p-1] < xB ){ 
 novoXP.push(novoXP[p-1]);
 novoYP.push(novoXP[p-1]);
  marcadorPratos=0;

}

else{
  novoXP.push(novoXP[p-1]);

  const y=m * (novoXP[p] - xB) + xB;

novoYP.push(y);
marcadorPratos=1;
}

  }

}

else if(marcadorPratos==1){ //Atribui os pontos quando o gráfico anda na horizontal
  novoYP.push(novoYP[p-1]);


  const x=novoYP[p] /(alpha-novoYP[p]*(alpha-1));// Calcula x quando está na linha de equilíbrio líquido-vapor
  
  novoXP.push(x);
  marcadorPratos=2;
  numeroPratos=numeroPratos+1; // Incrementa o número de pratos teóricos a cada iteração
}

else if(Math.abs(novoXR[98-p]-xD)<=0.001){ //Atribui o primeiro ponto dos pratos teóricos como o ponto de destilado (xD, xD)
  novoXP.push(xD);
  novoYP.push(xD);
  marcadorPratos=1;

}

if(marcadorPratos==0 ){ // Atribui null para os pontos dos pratos teóricos antes do primeiro ponto (xD, xD)
  novoXP.push(null);
  novoYP.push(null);

}

if(novoXP[p-1] < xB && marcadorPratos==2){ // Atribui null para os pontos dos pratos teóricos antes do primeiro ponto (xD, xD)
  novoXP.push(null);
  novoYP.push(null);
  marcadorPratos=0;

}



//console.log(p, novoXP[p],novoYP[p]);
//console.log(p, numeroPratos);
p=p+1;
}

setnPratos(numeroPratos); // Atualiza o estado com o número de pratos teóricos necessários para a separação


//colocar os pontos dos pratos teóricos no padrao do grafico
  const ajustadoYP = [];
p=0;
let i=0;
let p1=0;
for(let x=1; x>=0; x-=0.01){
  
if(i==0){ //Encontra o primeiro ponto dos pratos teóricos a partir do ponto de destilado (xD, xD) e armazena o índice desse ponto em p1
  for(i=0; i<=100; i+=1){

    if(novoXP[i]!==null){
   //console.log(novoXP[i], p1,i);
    p1=i;
    i=100;
    }

  }
}

  if(Math.abs(novoXP[p1] - x) < 0.01){ //Ajusta os pontos dos pratos, atribuindo os calores calculados
    //console.log(novoXP[p1]);
    ajustadoYP[100-p]=novoYP[p1]
    p1=p1+1;
  }

  else if(i==101 && xD - x >= 0.01){ //Ajusta as curvas horizontais do grafico
  
  ajustadoYP[100-p]=novoYP[p1]
  }


//console.log(x, p,  p1,i, ajustadoYP[p],novoXP[p1],novoYP[p1],Math.abs(novoXP[p1] - x));
p=p+1;
}

setyP(ajustadoYP);
  
}

  return (

    <div className="App">
  
        <h1>Aplicação do Método de McCabe-Thiele</h1>
        <br></br>


      <div className="explicacao">
        <p>
          O método de McCabe-Thiele é uma técnica comumente empregada na área de
          engenharia química para modelar a separação de duas substâncias por uma
          coluna de destilação. Ele utiliza o fato de que a composição em cada
          prato teórico é completamente determinada pela fração molar de um dos
          dois componentes. Este método baseia-se nas premissas de que a coluna
          de destilação é isobárica — ou seja, a pressão permanece constante — e
          que as vazões de líquido e vapor não se alteram ao longo da coluna
          (ou seja, transbordamento molar constante).
        </p>
        <br></br>
                <p>
          Instruções: <br>
           </br> 1. Clique no botão 'Calcular Curva ELV' para gerar a curva de Equilibrio Líquido Vapor<br>
           </br>  2. Insira os valores das variáveis: xF, xD, xB e R. <br>
           </br>  3. Clique no botão 'Calcular' para obter o número de pratos teóricos
            necessários para a separação. <br>
           </br>  4. Os resultados serão exibidos na tela, indicando o número de pratos
            teóricos necessários para alcançar a separação desejada.
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

      <div className="resultado_cabecalho"> {/* Seção para exibir o resultado do número de pratos teóricos necessários para a separação */}
        <h1>Resultado</h1>
        <p>Número de pratos teóricos necessários para a separação: {nPratos}</p>
      </div>

<div className="resultado">
       
        <div className="log_dos_passos"> {/* Seção para exibir o log dos passos do cálculo */}
        <h2>Log dos Passos do Cálculo</h2>
        <p>1. Curva de retificação calculada com base na razão de refluxo (R) e na fração molar no destilado (xD).</p>
        <p>2. Curva de alimentação calculada com base na razão de alimentação (q) e na fração molar na alimentação (xF).</p>
        <p>3. Curva de esgotamento calculada com base no coeficiente angular (m) da reta de esgotamento, determinado pelo ponto de encontro entre as curvas de retificação e alimentação.</p>
        <p>4. Limpeza das curvas para garantir que apenas os pontos relevantes sejam exibidos no gráfico.</p>
        <p>5. Determinação dos pontos para os pratos teóricos, alternando entre as curvas de retificação e esgotamento, e contando o número de pratos necessários para alcançar a separação desejada.</p>
      </div>


<div className="grafico"> {/* Seção para o gráfico da curva de equilíbrio líquido-vapor */}
<LineChart margin={{ left: 10, right: 10, top: 10, bottom: 20 }} width={600} height={500} data={xL.map((x, index) => ({ xL: x, yD: yD[index], yV: yV[index], yR: yR[index], yA: yA[index] , yE: yE[index],yP: yP[index]}))}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="number" dataKey="xL" domain={[0, 1]}   ticks={[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]} tickFormatter={(value) => value.toFixed(2)} label={{ value: 'Fração Molar na Fase Líquida (xL)', position: 'insideBottom', offset: -10 }} />
  <YAxis ticks={[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]}label={{ value: 'Fração Molar na Fase Vapor (yV)', angle: -90, position: 'insideLeft', dy: 120}} />
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
  
  {/*Curva de pratos teóricos*/}
  <Line type="monotone" dataKey="yP" stroke="#ff0000" dot={false} />
</LineChart>
</div>

</div>

  </div>
  )
}

export default App
