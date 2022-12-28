const request = require('request')

const geocode = (address, callback) => {

    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiZmdpYW5waWVybyIsImEiOiJjbDlvZXE1MmkwZTN0M29rNGg2ZmZzamIxIn0.Hw7BgBBkliQKhub1j9OKWQ&limit=1'

    request( { url: url, json: true}, (error, response) => {
            if (error) {
                callback('Problemi di connessione', undefined)
            } else if (response.body.features.length === 0){
                callback('Città non trovata', undefined)
            } else{
                let long  = response.body.features[0].geometry.coordinates[0]
                let lat = response.body.features[0].geometry.coordinates[1]
                let place_name = response.body.features[0].place_name
                
                callback(undefined, { 
                                    latitudine:  lat, 
                                    longitudine: long,
                                    citta: place_name
                    })

            }
           
    })

}

module.exports = geocode