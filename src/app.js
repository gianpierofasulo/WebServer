const path = require('path')
// modulo per gestire le route lato server
const express = require('express')
// files per le API geocode e meteo
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
// handlebars module... serve per i partials template files
const hbs = require('hbs')

var http = require('http');
var fs = require('fs');
var formidable = require('formidable');

// 
const PORT = process.env.PORT || 3000;


// path della directory e del file... completi ad es. C:\xampp\htdocs\node-course
// console.log(__dirname)
// console.log(__filename)


// definisco la path degli assets 
// console.log(path.join(__dirname,'../public') )

const app = express()

// DEFINIZIONI DELLE PATH PER EXPRESS (express viene usato per la gestione delle route/rotte delle pagine)************
// configuro la cartella public come static directory della WebApp
const publicDirectoryPath = path.join(__dirname,'../public')

// di default express usa la cartella views per ricercare i template files
// in questo modo invece diciamo ad express di cercare i file template nella nostra cartella templates
const viewsPath = path.join(__dirname,'../templates/views')
// path alla cartella partials
const partialsPath = path.join(__dirname,'../templates/partials')
// configuro la cartella partials per farla usare a hbs
hbs.registerPartials(partialsPath)

// Setto express sulle views
app.set('views',viewsPath)

// Questo è il default di express per le view e per l'engine, quindi se si usa solo questo come configurazione
// epress si aspetta di trovare i fie template nella cartella views
// ** Per installare il Template engine con express-> installare - npm hbs 
// stiamo dicendo a express di iusare come view engine hbs (handlebars) 
app.set('view engine','hbs')

// Confugra una cartella statica dove poter mettere i files html
app.use( express.static( publicDirectoryPath) )

// ROOT della APP non serve se dichiarato publicpath
// req = analizza la richiesta - res = invia la risposta al client
/* app.get('', (req, res)=> {
    res.send('<h1>CIAO - CIAO</h1>')
}) */

/* app.get('/help', (req, res)=> {
    
}) */

/* app.get('/about', (req, res)=> {
    res.send('<title>TITOLO ABOUT</title><h1>PAGINA ABOUT</h1>')
}) */

 // richiamo la index.hbs STESSO NOME DEL FILE passiamo 2 parametri il primo è il nome del file il secondo è un oggetto con le variabili
app.get('', (req, res)=> {
   
   res.render('index', {
      
       title: 'METEO APP',
       name: 'Gianpiero Fasulo'
   })
})

app.get('/about', (req, res)=> {
   
    res.render('about', {
       
        title: 'ABOUT PAGE',
        name: 'Gianpiero Fasulo'
    })
 })

 app.get('/help', (req, res)=> {
   
    res.render('help', {
       
        title: 'HELP PAGE',
        name: 'Gianpiero Fasulo'
    })
 })

app.get('/weather', (req, res)=> {
    
    if (!req.query.address || req.query.address == '') {
        // con return si interrompe l'esecuziona altrimenti andrebbe avanti 
        // e darebbe errore perchè verrebbero fatte 2 richieste send in un sol colpo 
        // e ciò non è possibile. Si potrebbe mettere il resto in una else.... sarebbe la stessa cosa
       /*  return res.send ({
            error: 'Devi inserire un indirizzo'
        }) */

        // in questo caso faccio il render della view
      /*   return res.render('weather', {
            title: 'IM METEO DI....',
            error: 'Devi inserire un indirizzo'
        }) */

        return res.send({
            error: 'Devi inserire un indirizzo/città'
        })
    }
    geocode(req.query.address, (error, data) => {
        if (error != undefined) {
            // uso return per inviare una sola volta i dati al client altrimenti proseguirebbe e darebbe undefined
            return res.send({
                error: 'Devi inserire un indirizzo/città o città non trovata'
            })
        }
           // console.log('DATI ', data)
            const lat = data.latitudine
            const long = data.longitudine
            const citta = data.citta
    
            // Prendo i dati meteo
            forecast( lat, long, (error, data) => {
                data.citta = citta
                data.latitudine = lat
                data.longitudine = long
                    if (error != undefined) {

                        console.log('ERRORE ', error)
                    }
                    // così restituisco i dati ricevuti in JSON di ritorno
                        res.send({
                             data
                        })


                   /*      return res.render('weather', {
                            title: "METEO DELLA TUA CITTA'",
                            temperatura_attuale: data.temperatura_attuale,
                            citta: data.citta,
                            latitudine: data.latitudine,
                            longitudine: data.longitudine,
                            velocita_vento:  data.velocita_vento
                        }) */

                       // console.log('DATI ', data)
                }
                )
    
    })

 
})

// intercetto tutte le richieste dopo /help
app.get('/help/*', (req, res)=> {
    res.render('help', {
       
        title: 'PAGINA DI HELP NON TROVATA',
        name: 'Gianpiero Fasulo'
    })
})


app.get('/upload', (req, res)=> {
    res.render('upload', {
       
        title: 'PAGINA DI UPLOAD',
        name: 'Gianpiero Fasulo'
    })
})

app.post('/fileupload', (req, res, next) => {
    

    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          var oldpath = files.filetoupload.filepath;
          var newpath = 'C:/xampp74/htdocs/node-course/web-server/' + files.filetoupload.originalFilename;
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!' + newpath );
            res.end();
          });
     });
    }
  
  /*    const form = formidable({ multiples: true }); 
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ fields, files });
    }); */

  });


// Gestione di tutte le url non definite, si usa l'asterisco come path per prendere tutte le URL non esistenti
app.get('*', (req, res)=> {
    res.render('404', {
       
        title: 'PAGINA NON TROVATA',
        name: 'Gianpiero Fasulo'
    })
})





// listen su porta 3000
app.listen(PORT, () => {
    console.log('Server listen on port 3000')
})

