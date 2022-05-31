const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "secret";
const scrapeIt = require("scrape-it");// se relaciona con la busqueda de articulos
const server = express();
const expressWs= require("express-ws")(server);//esto nos permite entrar a websocket
server.use(express.json());
/*
// para pedir nombre, apellido y notas=> 
  server.post("/subjects/:subject/grades", verifyToken, (request,response)=>{
  const requestBody= request.body;  
  console.log(request.body) 
  const name = requestBody.name;
  const surname = requestBody.surname;
  const notes = requestBody.notes;
  */
    
// comuni. bidireccional
server.ws('/', function (ws, req) {
  ws.send('Hola! Buen dia')
   ws.on('message', function (msg) {
       console.log(msg);
       ws.send(JSON.stringify({hola: msg}));
   });
   console.log('socket', req.testing)
 });


 
 //me ingreso
  server.post( "/login", (request, response) =>{
    const requestBody= request.body;
    const email= requestBody.email;
    const password= requestBody.password;

    if(email === "trabajoapis@gmail.com" && password === "apis1234"){
        const user={
            email: email,
        }; 
        
        jwt.sign(user, secretKey,(err, token)=>{
            response.json(token);
        })
    } 
    else{
        response.sendStatus(401);
    }
})
  /**
 * Verifies a given token from a request
 * @param req This is the incoming request
 * @param res This is the response to send
 * @param next next function
 */
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
  
    // In case token exists, and the header is present:
    if (token) {
      // We split the token because it contains 'Bearer <token>'
      const bearerHeader = token.split(' ');
  
      // This is the actual <token>
      const bearerToken = bearerHeader[1];
      jwt.verify(bearerToken, secretKey, (error, authData) => {
        // There's an error verifying the token is correct
        if (error) {
          console.log('There was an error verifying token');
          res.sendStatus(403);
        } else {
          // Everything is correct
          console.log('We made it!');
          req.token = bearerToken;
          next();
        }
      })
    } else {
      // There's no header present
      res.sendStatus(403);
    }
  }
 
  // ejemplo en slack + datos que se repiten por el intervalo cada 1mn 
  // Promise interface
  setInterval (()=>{
scrapeIt("https://infobae.com", {
  articles: {
      listItem: ".cst_ctn"
  }
}).then(({ data, response }) => {
  console.log(`Status Code: ${response.statusCode}`)
  console.log(data)
})
  },30000);
  server.listen(3000);
