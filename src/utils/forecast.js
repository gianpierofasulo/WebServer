const request = require('request')

const forecast = (lat, long, callback) => { 

        // TUTTA QUESTA PARTE E' LA FUNZIONE PASSATA COME TERZO PARAMETRO ALLA FUNZIONE FORECAST
        // ed è quì che svolto la logica applicativa di cosa restituire alla chiamata della funzione principale
        const url= 'http://api.weatherstack.com/current?access_key=096e28c4889dc90c7d0d983b99647dd7&query='+ lat  +',' +  long

        request( { url: url, json: true}, (error, response) =>{ 
        
            if (error) {
                callback('Problemi di connessione', undefined)
            } else if (response.body.error){
                callback('Coordinate non trovate', undefined)
            } else {
                
                let temperatura_attuale = response.body.current.temperature
                let velocita_vento = response.body.current.wind_speed
               
                // DATI RESTITUITI NELLA CALLBACK
                        callback(undefined, { 
                                            temperatura_attuale:  temperatura_attuale, 
                                            velocita_vento: velocita_vento
                                            })
                }    
            })
            } // END CALLBACK

    module.exports = forecast

