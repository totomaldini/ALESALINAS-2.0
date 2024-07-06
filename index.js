//Referencias a objetos
const ruleta = document.getElementById("ruleta");
let opcionesContainer;
let opciones = Array.from(document.getElementsByClassName("opcion"));
const root = document.documentElement;
const formContainer = document.getElementById("formContainer");
const modal = document.querySelector("dialog");
const ganadorTextoElement = document.getElementById("ganadorTexto");


/** Texto de la opción ganadora */
let ganador = "";
/** Para el setInterval que hace que el cartel de ganador anime los "..." */
let animacionCarga;
/** Estado actual de la ruleta true => Bloquea el mouse; */
let sorteando = false;
/** Contiene la lista de colores posibles para el gráfico */
const colores=[
	"5b0672","8a0bd2","af50e5","5D9B9B","8673A1","100000","4C9141","8E402A","231A24","424632","1F3438","025669","008F39","763C28"
];

/** Cambia la escala para hacer la herramienta pseudo responsive (faltaría un event listener al cambio de width para que sea bien responsive) */
let escala = screen.width < 550 ? screen.width * 0.7 : 400;
root.style.setProperty("--escala",escala+"px");

/** Contiene la suma actual de probabilidades en base 100 */
let suma = 0;



/** Instancias de conceptos que se cargan al iniciar la app */
const uno = {
	nombre: "Verdad",
	probabilidad: 33
}
const dos = {
	nombre: "Reto",
	probabilidad: 34
}
const tres = {
	nombre: "Shot",
	probabilidad: 33
}

let conceptos = [uno,dos,tres];


/** Pone a girar la ruleta y hace el sorteo del resultado */
function sortear(){

	console.log("puto")

	sorteando = true;
	ganadorTextoElement.textContent = ".";
	animacionCarga = setInterval(()=>{
		switch( ganadorTextoElement.textContent){
			case ".":
				ganadorTextoElement.textContent = ".."
				break;
			case "..":
				ganadorTextoElement.textContent = "..."
				break;
			default:
				ganadorTextoElement.textContent = "."
				break;
		}
	} ,500)
	/** Numero del 0 al 1 que contiene al ganador del sorteo */
	const nSorteo = Math.random();
	/** Cantidad de grados que debe girar la ruleta */
	const giroRuleta = (1-nSorteo)*360 + 360*10; //10 vueltas + lo aleatorio;
	root.style.setProperty('--giroRuleta', giroRuleta + "deg");
	ruleta.classList.toggle("girar",true)
	/** Acumulador de probabilidad para calcular cuando una probabilidad fue ganadora */
	let pAcumulada = 0;
	conceptos.forEach(concepto => {
		if(nSorteo*100 > pAcumulada && nSorteo*100 <= pAcumulada+concepto.probabilidad){
			ganador = concepto.nombre;
			//console.log("Ganador", nSorteo*100, concepto.nombre, "porque está entre ",pAcumulada, "y",pAcumulada+concepto.probabilidad)
		};
		pAcumulada +=concepto.probabilidad;
	})
}

/** Desacopla lo que ocurre al terminar de girar la ruleta de la función girar */
ruleta.addEventListener("animationend", ()=>{
	ruleta.style.transform = "rotate("+getCurrentRotation(ruleta)+"deg)";
		ruleta.classList.toggle("girar",false)
		sorteando=false;
		//ganadorTextoElement.textContent = ganador;

		if (ganador === uno.nombre) {
			const mensajesGanador  = [
				'¿Hace cuánto no tenes sexo?',
				'¿Máximos besos que diste en una noche?',
				'¿Tu mejor chamuyo?',
				'¿Cuantas veces chamuyaste con ropa?',
				'¿Con cuantas personas te acostaste en toda tu vida?',
				'¿Cuál es tu imperio romano? Xd',
				'¿Cual es tu fantasía sexual?',
				'¿Cuál es tu peor cita?',
				'¿Cuál es el lugar más raro donde tuve relaciones?',
				'¿Cuánto fue lo maximo que gastaste en una cita?',
				'¿Cuál fue el peor chamuyo que te dijeron?',
				'¿Cuál fue tu máximo en una noche?',
				'¿Cuál fue la experiencia más bizarra que tuvisteen una cita?',
                                '¿Cuál fue la peor excusa que diste para cancelar una cita?',
                                '¿Cuál fue el mejor chamuyo que te hicieron?',
                                '¿Te arrepentis de alguna relación o cita?',
                                '¿Estuviste con algún amigo/a?',
                                '¿Alguna vez le revisaste el celu a tu pareja?',
                                '¿Estar de novio/a o soltero/a?',
			];
			const mensajeAleatorioGanador = mensajesGanador[Math.floor(Math.random() * mensajesGanador.length)];
			ganadorTextoElement.textContent = mensajeAleatorioGanador;
		}
		if(ganador === dos.nombre){
			/*ganadorTextoElement.textContent = 'reto'*/
			const mensajesPerdedor  = [
				'Dale el vaso al que peor te cae',
				'Dale el vaso al más lind@',
				'Dale el vaso al más chamuyero', 
				'Dale de tomar al más alto',
				'TOMAS O MULTIPLICAS LOS TRAGOS AL PRÓXIMO',
				'Decí un trabalenguas',
				'Dale el vaso al amigo con la mama más linda',
				'Elegí uno/a para darle un pico (o shot)',
				'Dale el vaso al más pajón',
				'Toma si estuviste con alguien que esté en este momento',
				'Toma si estuviste con algún/a amigo/a',
				'Toma si te estarias con alguien que esté en la previa.',
				'Decí la primer letra de la persona que más te guste.',
			];
			const mensajeAleatorioPerdedor= mensajesPerdedor[Math.floor(Math.random() * mensajesPerdedor.length)];
			ganadorTextoElement.textContent = mensajeAleatorioPerdedor;
		}

		if(ganador === tres.nombre){
			const mensajesPerdedor1  = [
				'Toma un Shot',
				'Toma dos Shot',
				'Toma tres Shot',
                        ];
			const mensajeAleatorioPerdedor1= mensajesPerdedor1[Math.floor(Math.random() * mensajesPerdedor1.length)];
			ganadorTextoElement.textContent = mensajeAleatorioPerdedor1;
			/*ganadorTextoElement.textContent = 'Toma un Shot cagon..'*/
		}

		clearInterval(animacionCarga);
})


/** Crea todas las partes del elemento ruleta según la lista de conceptos */
function ajustarRuleta (){
	// Primero borro la ruleta anterior y creo una nueva.
	if(opcionesContainer)	ruleta.removeChild(opcionesContainer)
	opcionesContainer = document.createElement("div");
	opcionesContainer.id = "opcionesContainer";
	ruleta.appendChild(opcionesContainer);
	let pAcumulada = 0
	conceptos.forEach((concepto, i) => {
		//Creo triangulos de colores
		const opcionElement = document.createElement("div");
		opcionElement.classList.toggle("opcion",true);
		opcionElement.style = `
			--color: #${colores[i%colores.length]};
			--deg:${probabilidadAGrados(pAcumulada)}deg;
			${getPosicionParaProbabilidad(concepto.probabilidad)}`
		opcionElement.addEventListener("click", ()=> onOpcionClicked(i))
		opcionesContainer.appendChild(opcionElement);
		//Creo textos
		const nombreElement = document.createElement("p");
		nombreElement.textContent = concepto.nombre;
		nombreElement.classList.add("nombre");
		nombreElement.style =`width : calc(${concepto.probabilidad} * var(--escala) * 1.5 / 80);
			transform: rotate(${probabilidadAGrados(concepto.probabilidad)/2+probabilidadAGrados(pAcumulada)}deg)`
		opcionesContainer.appendChild(nombreElement);
		//Creo separadores
		const separadorElement = document.createElement("div");
		separadorElement.style = `transform: rotate(${probabilidadAGrados(pAcumulada)}deg)`
		separadorElement.classList.add("separador");
		opcionesContainer.appendChild(separadorElement);
		pAcumulada += concepto.probabilidad;
		//Reseteo la posición y el cartel
		ruleta.style.transform = "rotate(0deg)";
		ganadorTextoElement.textContent = "¡Click en Girar para iniciar!";
	})
}


//Eventos de botones

document.getElementById("sortear").addEventListener("click", () => {
	if(!sorteando) sortear()
})



/** Revisa si  los porcentajes de probabilidades suman a 100% */
function verificarValidezFormulario(){
	suma=0;
	Array.from(formContainer.children).forEach(opcion =>{
		suma += parseFloat(opcion.children[1].value);
	})
	botonAceptar.disabled = suma !== 100; // Deshabilito el botón aceptar si la suma es distinto de 100
	totalElement.textContent = suma.toString();
	
}



/** Desde una probabilidad en % devuelve un clip-path que forma el ángulo correspondiente a esa probabilidad */
function getPosicionParaProbabilidad(probabilidad){
	if(probabilidad === 100){
		return ''
	}
	if(probabilidad >= 87.5){
		const x5 = Math.tan(probabilidadARadianes(probabilidad))*50+50;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${x5}% 0, 50% 50%)`
	}
	if(probabilidad >= 75){
		const y5 = 100 - (Math.tan(probabilidadARadianes(probabilidad-75))*50+50);
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 62.5){
		const y5 = 100 - (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 50){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 37.5){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 25){
		const y3 = Math.tan(probabilidadARadianes(probabilidad-25))*50+50;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 12.5){
		const y3 = (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 0){
		const x2 = Math.tan(probabilidadARadianes(probabilidad))*50 + 50;
		return `clip-path: polygon(50% 0, ${x2}% 0, 50% 50%)`
	}
}

ajustarRuleta();
