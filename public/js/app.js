console.log('javascript file');




const weatherForm = document.querySelector('form')
const ricerca = document.querySelector('input')
const message1 = document.querySelector('#message1')
const message2 = document.querySelector('#message2')

// message1.textContent = ''


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    message2.textContent = 'Attendi.....'
    const localita = ricerca.value;
    console.clear();
//    if (localita) {
                    fetch('http://localhost:3000/weather?address=' + localita).then( (response) => {
                        response.json().then( (dati) => {

                            if (dati.error) {
                                message1.textContent = ''
                                message2.textContent = dati.error;
                                } else {
                                    message2.textContent = ''
                               /*  console.log(dati.data.latitudine);
                                console.log(dati.data.longitudine); */
                                message1.innerHTML = 'Città;  ' + dati.data.citta + '<br />';
                                message1.innerHTML += 'latitudine;  ' + dati.data.latitudine  + '<br />';
                                message1.innerHTML += 'longitudine;  ' + dati.data.longitudine + '<br />';
                                message1.innerHTML += 'temperatura;  ' + dati.data.temperatura_attuale + '<br />';
                            }
                    
                        })
                    });
    /*               } else {
                    console.log('Non hai inserito nessuna località')
                  } */
})