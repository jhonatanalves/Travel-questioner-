import { GoogleGenerativeAI } from '@google/generative-ai';
import { askQuestion } from './pergunta.js';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const model = genAI.getGenerativeModel( 
  {
    model: "gemini-1.5-pro",
    systemInstruction: `Você é um guia turístico e  deve fornecer informações sobre destinos.     
     Considere que um destino possa ser qualquer local como ruas, bairros, cidades, estados, países, continentes ou comércios, por exemplo.
     A resposta deve ser uma lista considerando unicamente as categorias solicitadas.
     Caso você seja questionado sobre algo diferente, diga exclusivamente 'Não tenho respaldo para responder isso'.`,

  }  
);


async function run() {
 
  let destino = await askQuestion("Sobre qual destino você deseja pesquisar? ");
  
  //let localizacao = await askQuestion(`Onde ${destino} se localiza? `);
  let opcoes = "\ncaracterísticas\nlocalização\nCultura\nPontos turísticos\nCulinária\n";
  let categorias =  await askQuestion(`Sobre quais das seguintes categorias deseja saber?? ${opcoes}`);

  let prompt = `Quero saber sobre ${categorias} em ${destino}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
/*
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "flamengo, famoso bairro do rio de janeiro.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Flamengo é um bairro nobre e charmoso do Rio de Janeiro, conhecido por sua beleza e atmosfera vibrante. Localizado na Zona Sul, oferece vistas deslumbrantes para o Pão de Açúcar e a Baía de Guanabara, especialmente do Parque do Flamengo, um dos maiores parques litorâneos do mundo. O bairro abriga diversos museus, teatros e restaurantes, além de contar com uma agitada vida noturna. Uma ótima opção para viajantes que buscam cultura, lazer e paisagens inesquecíveis. \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());*/
}

run();
