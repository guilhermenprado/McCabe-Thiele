
//colocar os pontos dos pratos teóricos no padrao do grafico
  const ajustadoYP = [];
p=0;
for(let x=0; x<=1; x+=0.01){

  for(let i=0; i<=100; i+=1){

if(novoXP[100-i]!==null){

p1=i;

}

  }

  if(Math.abs(novoXP[100-p1] - xL[p]) < 0.01){
ajustadoYP.push(novoYP[100-p1]);
  }
console.log(x, p,  p1, ajustadoYP[p],novoXP[p],xL[p],novoYP[100-p1]);
p=p+1;
}