import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react';
import './App.css'
import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip} from "recharts";

// const alpha = Math.random() * 10+1; // Gerar um valor aleatório para alpha entre 0 e 10


function App() {

const [logtexto, setlogtexto] = useState([]); // Estado para armazenar o log dos passos do cálculo
const logRef = useRef(null); // Referência para o elemento do log dos passos do cálculo
const [calculando, setCalculando] = useState(false); // Estado para controlar se o cálculo está em andamento ou não

const [yD, setyD] = useState([]); // Array para armazenar os valores da reta diagonal
  
const [xL, setxL] = useState([]); // Array para armazenar os valores de xL - fração molar do componente mais volátil na fase líquida
const [yV, setyV] = useState([]); // Array para armazenar os valores de yV - fração molar do componente mais volátil na fase vapor

let p=0; // Variável para controlar o índice do array
const m = useRef(0); // Variável para armazenar o valor de m - coeficiente angular da reta de esgotamento

const [xF, setxF] = useState(0); // Fração molar do componente mais volátil na alimentação
const [xD, setxD] = useState(0); // Fração molar do componente mais volátil no destilado
const [xB, setxB] = useState(0); // Fração molar do componente mais volátil no resíduo
const [R, setR] = useState(0); // Razão de refluxo
const [q, setq] = useState(0); // Razão de alimentação
const [alpha, setAlpha] = useState(0); // Razão de volatilidade

const [xR, setxR] = useState([]); // Array para armazenar os valores de xR - fração molar do componente mais volátil na fase líquida em cada prato para a curva de retificação
const [yR, setyR] = useState([]); // Array para armazenar os valores de yR - fração molar do componente mais volátil na fase vapor em cada prato para a curva de retificação  
const [yA, setyA] = useState([]); // Array para armazenar os valores de yA - fração molar do componente mais volátil na fase vapor em cada prato para a curva de alimentação
const [xA, setxA] = useState([]); // Array para armazenar os valores de xA - fração molar do componente mais volátil na fase líquida em cada prato para a curva de alimentação
const [yE, setyE] = useState([]); // Array para armazenar os valores de yE - fração molar do componente mais volátil na fase vapor em cada prato para a curva de esgotamento
const xEncontro = useRef(0); // Variável para armazenar o valor de x no ponto de encontro entre as curvas de retificação e alimentação

const [xP, setxP] = useState([]); // Array para armazenar os valores de xP - fração molar do componente mais volátil na fase líquida em cada prato
const [yP, setyP] = useState([]); // Array para armazenar os valores de yP - fração molar do componente mais volátil na fase vapor em cada prato

let numeroPratos = 0; // Variável para armazenar o número de pratos teóricos necessários para a separação
let marcadorPratos=0; // Variável para controlar o índice do array dos pratos teóricos
let cruzaPrato=-1; // Variável para controlar o cruzamento entre a curva de alimentacao e o prato ideal
let confirmar=0;

const [etapa, setEtapa] =  useState(0);

useEffect(() => {  if (logRef.current) {    logRef.current.scrollTop = logRef.current.scrollHeight;  }}, [logtexto]); // Efeito para rolar o log dos passos do cálculo para o final a cada atualização do estado logtexto


function executarMetodo() { // Função para executar o método de McCabe-Thiele, alternando entre as etapas do cálculo a cada clique no botão "Próximo Passo"
console.log(etapa);
  switch(etapa) {

    case 0:
      passo2();
      break;

    case 1:
      passo3();
      break;

    case 2:
      passo4();
      break;

    case 3:
      passo5();
      break;

    case 4:
      passo6();
      break;

  
  }

  setEtapa((etapa + 1));
}


function passo1() {

  setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 1:</strong> Neste passo vamos inserir uma curva teorica de equilíbrio líquido-vapor (ELV) com base no valor de alpha gerado por um modelo ramdomico.</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Durante os calculos das curvas sempre vamos considerar que y é a fração molar do componente mais volátil na fase vapor e x é a fração molar do componente mais volátil na fase líquida</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Utilizamos a equação: y = (α * x) / (1 + (α - 1) * x) onde α é a razão de volatilidade. Em sistemas de separação, essa curva é essencial para entender o comportamento das fases líquida e vapor em equilíbrio. Quando consideramos sistemas reais esta curva é gerada pela mistura dos componentes.</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Neste calculo, foi utilizado o valor de α = {alpha.toFixed(2)}.</>]);
  setlogtexto((anteriores) => [    ...anteriores,<>Em sistemas de separação, essa curva é essencial para entender o comportamento das fases líquida e vapor em equilíbrio. Quando consideramos sistemas reais esta curva é gerada pela mistura dos componentes.</>]); // Atualizar o log dos passos do cálculo

  const novoXL = [];
  const novoYV = [];
  const novoXD = [];
  const novoYD = [];

  for (let x = 0; x <= 1; x += 0.01) {
    const y =  (alpha * x) /  (1 + (alpha - 1) * x);

    novoXL.push(x);
    novoYV.push(y);
 console.log(alpha, x, y);
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


function passo2() {

  setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 2:</strong> Neste passo vamos calcular a curva de retificação com base na razão de refluxo (R) e na fração molar no destilado (xD). Esta curva tem a função de representar o comportamento da fase vapor em relação à fase líquida durante o processo de retificação.</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Para calcular esta curva, utilizamos a equação: y = (R / (R + 1)) * x + (xD / (R + 1)), onde R é a razão de refluxo e xD a fração molar no destilado.</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Nesta curva, quanto maior a razão de refluxo (R), menos inclinada será a curva, e mais elevada será a temperatura de ebulição do líquido na coluna de retificação.</>]); // Atualizar o log dos passos do cálculo

  //calcular a curva de retificação


  //calcular a curva de retificação
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
 console.log(alpha, R, x, y);
  }
p=p+1;
  setyR(novoYR);
  setxR(novoXR);

}

function passo3() {

    setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 3:</strong> Neste passo, vamos calcular a curva de alimentação com base na razão de alimentação (q) e na fração molar na alimentação (xF).</>]); // Atualizar o log dos passos do cálculo
setlogtexto((anteriores) => [    ...anteriores,<>Para calcular esta curva, utilizamos a equação: y = (q / (q - 1)) * x + (xF / (1 - q)), onde q é a razão de alimentação e xF é a fração molar na alimentação.</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Nesta curva, a inclinação depende da razão de alimentação (q). Quanto maior a razão de alimentação, mais inclinada será a curva. Para os valores de q=1, a curva se torna vertical e para q=0, a curva se torna horizontal.</>]); // Atualizar o log dos passos do cálculo


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
     console.log(alpha, R, q, x, y);
  }

  setyA(novoYA);
  setxA(novoXA);

}

function passo4() {

  setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 4:</strong> Nesta etapa, vamos calcular a curva de esgotamento com base na razão de refluxo (R) e na fração molar no destilado (xD).</>]); // Atualizar o log dos passos do cálculo
setlogtexto((anteriores) => [    ...anteriores,<>Para calcular esta curva, utilizamos a equação: y = m * (x - xB) + xB, onde m é o coeficiente angular da reta de esgotamento e xB é a fração molar no fundo da coluna. </>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<>Desta forma, precisamos inicialmente calcular o valor de m que é obtido por meio da regressão linear considerando os pontos de xB e da interseção das curvas de alimentação e retificação. </>]); // Atualizar o log dos passos do cálculo

  //calcular a curva de esgotamento

  // Calcular o valor de m - coeficiente angular da reta de esgotamento
  p=0;
  for (let x = 0; x <= 1; x += 0.01) { 
    if (Math.abs(yR[p] - yA[p]) < 0.01) {
      m.current=(yR[p]-xB)/(x-xB);
      x=1;
    }
p=p+1

  }

console.log(m);
//calcular a curva de esgotamento
  const novoXE = [];
  const novoYE = [];

 
  for (let x = 0; x <= 1; x += 0.01) {
      console.log(alpha, R, q,m);
  const y =  m.current * (x - xB) + xB;

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
      console.log(alpha, R, q,m);
}

function passo5() {

    setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 5:</strong> Neste passo, para uma melhor visualização vamos fazer a remoção de pontos das curvas de retificação, alimentação e esgotamento de modo a deixar o gráfico mais claro.</>]); // Atualizar o log dos passos do cálculo

      console.log(alpha, R, q,m);
  //Limpar curvas anteriores
  let marcador=0; // Variável para controlar a limpeza das curvas
  for(let p=0; p<=100; p+=1){

    // Limpar a curva de retificação
if(yR[p] < yA[p]){
      yR[p-1] = null;
}

    // limpar a curva de alimentação
if(yV[p] < yA[p]){
      yA[p-1] = null;
  
  }

  if(yR[p] < yA[p]){
     xEncontro.current = xA[p]; // Armazenar o valor de x no ponto de encontro entre as curvas de retificação e alimentação
  }

  else {
    marcador=1;
  }

    // limpar a curva de esgotamento
if(marcador==1){
      yE[p+1] = null;
}

  }
    console.log(alpha, R, q,m, xEncontro);
}

function passo6() {

    setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 6:</strong> Neste passo, vamos calcular o número de pratos teóricos necessários para a separação, com base nas curvas de retificação, alimentação e esgotamento.</>]); // Atualizar o log dos passos do cálculo
  setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 6.1:</strong> Para isto iniciamos conectando o ponto xD por meio de uma curva horizontal com a curva de Equilibrio Líquido Vapor (ELV). </>]); 
  setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 6.2:</strong> A próxima etapa é conectar este ponto com a curva de retificação ou com a curva de esgotamento por meio de uma linha vertical. </>]); 
  setlogtexto((anteriores) => [    ...anteriores,<><strong>Passo 6.3:</strong> Realizando o processo de forma iterativa, retornamos ao passo 6.1 e 6.2 repetindo ambos até que o ponto encontrado após o item 6.2 tenha valor de x menor que xB.</>]); 
  setlogtexto((anteriores) => [    ...anteriores,<>Com o gráfico finalizado, podemos identificar a quantidade de pratos e visualizar o prato ideal de alimentação sendo o prato no qual a curva de Alimentação corta a linha horizontal do gráfico de pratos.</>]); 
  setlogtexto((anteriores) => [    ...anteriores,<>Neste calculo, temos que o Numero de Pratos é de <strong>{numeroPratos} Pratos</strong> e o prato ideal de alimentação é o prato numero <strong>{numeroPratos-cruzaPrato}</strong>.</>]); 
    console.log(alpha, R, q,m, xEncontro);
// Definir os pontos para os pratos teóricos
  const novoXP = [];
  const novoYP = [];
p=0;
for(let x=0; x<=1; x+=0.01){

  
if(marcadorPratos==2){ //Atribui os pontos quando o gráfico anda na vertical


  if(novoXP[p-1] > xEncontro.current){ //Calcula x quando está na linha de retificação
novoXP.push(novoXP[p-1]);
const y= R /  (R + 1) * novoXP[p] +  xD /  (R + 1);
novoYP.push(y);
marcadorPratos=1;
  }

  if(novoXP[p-1] < xEncontro.current){ //Calcula x quando está na linha de esgotamento

if(novoXP[p-1] < xB ){ 
 novoXP.push(novoXP[p-1]);
 novoYP.push(novoXP[p-1]);
  marcadorPratos=0;

}

else{
  novoXP.push(novoXP[p-1]);

  const y=m.current * (novoXP[p] - xB) + xB;

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

    if (novoXP[p] < xEncontro.current){ // Controla o cruzamento entre a curva de alimentação e o prato ideal
    cruzaPrato=cruzaPrato+1;
  }
  
  numeroPratos=numeroPratos+1; // Incrementa o número de pratos teóricos a cada iteração


}

else if(Math.abs(xR[98-p]-xD)<=0.001){ //Atribui o primeiro ponto dos pratos teóricos como o ponto de destilado (xD, xD)
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
      console.log(alpha, R, q,m);
p=p+1;
}




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
                   </br>  1. Insira os valores das variáveis: xF, xD, xB, R, q e α  <br>
           </br>  2. Clique no botão 'Iniciar Cálculo' para obter o número de pratos teóricos
            necessários para a separação. <br>
           </br>  3. O passo a passo dos resultados serão exibidos na tela, e ao final do processo será indicado o número de pratos
            teóricos necessários para alcançar a separação desejada.
        </p>
      
            </div>


      <div className="tabela_variaveis">
        <h1>Insira os valores das variáveis</h1>

<form className="formulario"> {/* Formulário para entrada dos valores das variáveis*/}

<div className="campo "> {/* Seção para os campos de entrada das variáveis */}
<label>Valor de xF</label>
<input placeholder='0 - 1' type="number"   min="0"  max="1" step="0.01" name="xF" id="xF" onChange={(event) => setxF(parseFloat(event.target.value))}/>
</div>

<div className="campo "> {/* Seção para os campos de entrada das variáveis */}
<label>Valor de xD</label>
<input placeholder='0 - 1' type="number"   min="0"  max="1" step="0.1" name="xD" id="xD" onChange={(event) => setxD(parseFloat(event.target.value))}/>
</div>

<div className="campo "> {/* Seção para os campos de entrada das variáveis */}
<label>Valor de xB</label>
<input placeholder='0 - 1' type="number"   min="0"  max="1" step="0.1" name="xB" id="xB" onChange={(event) => setxB(parseFloat(event.target.value))}/>
</div>

<div className="campo "> {/* Seção para os campos de entrada das variáveis */}
<label>Valor de R</label>
<input placeholder='0 - 5' type="number"   min="0"  max="5" step="0.1" name="R" id="R" onChange={(event) => setR(parseFloat(event.target.value))}/>
</div>

<div className="campo "> {/* Seção para os campos de entrada das variáveis */}
<label>Valor de q</label>
<input placeholder='0 - 1' type="number"   min="0"  max="1" step="0.1" name="q" id="q" onChange={(event) => setq(parseFloat(event.target.value))}/>
</div>

<div className="campo "> {/* Seção para os campos de entrada das variáveis */}
<label>Valor de α</label>
<input placeholder='2 - 10' type="number"   min="2"  max="10" step="0.1" name="alpha" id="alpha" onChange={(event) => setAlpha(parseFloat(event.target.value))}/>
</div>


</form>
      </div>

      <div  className="resultado_cabecalho" > {/* Seção para exibir o resultado do número de pratos teóricos necessários para a separação */}
        {!calculando && (  <button type="button" className="botao" disabled={!xF || !xD || !xB || !R || !q || !alpha} onClick={() => {setCalculando(true); passo1()}}>Iniciar Cálculo</button> )}
        {calculando && (
          <button type="button" className="botao" onClick={executarMetodo}>Próximo Passo</button>
        )}
        <h1>Resultado</h1>
      </div>

<div className="resultado">
       
        <div className="log_dos_passos" ref={logRef}> {/* Seção para exibir o log dos passos do cálculo */}
        <h2>Log dos Passos do Cálculo</h2>
    {logtexto.map((msg, index) => (      <div key={index} style={{ marginBottom: "15px" }}>{msg}</div>
    ))}
              </div>


<div className="grafico"> {/* Seção para o gráfico da curva de equilíbrio líquido-vapor */}
<LineChart margin={{ left: 10, right: 10, top: 10, bottom: 20 }} width={550} height={450} data={xL.map((x, index) => ({ xL: x, yD: yD[index], yV: yV[index], yR: yR[index], yA: yA[index] , yE: yE[index],yP: yP[index]}))}>
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
