import { useState } from 'react'
import './App.css'


function calcularCurvaELV() {
const xL =[]; // Array para armazenar os valores de xL - fração molar do componente mais volátil na fase líquida
const yV = []; // Array para armazenar os valores de yV - fração molar do componente mais volátil na fase vapor
  const alpha = Math.random() * 10 + 1; // Gerar um valor aleatório para alpha entre 1 e 10

  for (let x = 0; x <= 1; x += 0.01) {
    const y = (alpha * x) / (1 + (alpha - 1) * x); // Cálculo da fração molar do componente mais volátil na fase vapor usando a relação de equilíbrio
    xL.push(x); // Armazenar o valor de xL no array
    yV.push(y); // Armazenar o valor de yV no array

    console.log(`xL: ${x.toFixed(2)}, yV: ${y.toFixed(2)}`); // Exibir os valores de xL e yV no console para verificação
  }
} 

function App() {
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

<div className="curva_elv">
        <h1>Curva de Equilíbrio Líquido-Vapor (ELV)</h1>
        <button onClick={calcularCurvaELV}>Calcular Curva ELV</button>
      </div>

      <div className="tabela_variaveis">
        <h1>Insira os valores das variáveis</h1>

<form>

<input placeholder='Valor de xF' type="number" name="xF" id="xF"/>
<input placeholder='Valor de xD' type="number" name="xD" id="xD"/>
<input placeholder='Valor de xB' type="number" name="xB" id="xB"/>
<input placeholder='Valor de R' type="number" name="R" id="R"/>
<button type='submit'>Calcular</button> 

</form>
      </div>

<div className="resultado">
        <h1>Resultado</h1>
        <p>Número de pratos teóricos necessários: </p>
      </div>

    </div>
  )
}

export default App
