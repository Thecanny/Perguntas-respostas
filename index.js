const express = require("express");
const app = express();
const bodyParser = require("body-parser");


// DATABASE
const connection = require('./database/database');
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
  .authenticate()
  .then(() => {
    console.log('conexão feita com o banco de dados')
  })
  .catch( erro => {
    console.log(erro);
  })

// ============================
app.set('view engine','ejs');//diz pro express quam engine de vizualização vamos usar
app.use(express.static('public'));//diz pro express onde ficam os arquivos estaticos

// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());


// =========================={{ROTAS}}===========================================

app.get('/', (req, res) =>{
  Pergunta.findAll({raw: true, order: [
      ['id','DESC']//ASC = Crescente, DESC decrescente
  ]}).then(perguntas =>{
    console.log(perguntas)
    res.render("index",{
      perguntas: perguntas
    });
  });
});

app.get('/perguntar', (req, res) =>{
  res.render("perguntar") 
});

// ENVIANDO INFORMAÇÃO DO FORM PARA O BANCO DE DADOS
app.post('/salvarpergunta', (req, res) =>{
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(()=>{
    res.redirect("/")
  });
});

app.get('/pergunta/:id', (req, res) =>{
  const id = req.params.id;
  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta =>{
    if(pergunta != undefined){

      Resposta.findAll({
        where: {perguntaId: pergunta.id },
        order: [['id','DESC']]
      }).then(respostas =>{
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas
        })
      });

    }else{
      res.redirect("/")
    }
  })
});

app.post('/resposta', (req, res) =>{
  const corpo = req.body.corpo;
  const perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(()=>{
    res.redirect(`/pergunta/${perguntaId}`);
  });
});

// ============================================================================

app.listen(8080,() =>{
  console.log('Servidor rodando');
})