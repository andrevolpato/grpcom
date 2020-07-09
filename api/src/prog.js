const express = require('express')
const rp = require('request-promise');
const app = express();
const timeout = require('connect-timeout');
const cors = require('cors');

// Middlewares
app.use(timeout('5s'))
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}
app.use(cors());

app.get('/v1/programacao', function (req, res) {
    if (req) {
        dia = req.query.dia;
        if (! dia.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
            res.status(404).end();
            return;
        }
        
        const url = 'https://epg-api.video.globo.com/programmes/1337?date=' + dia;
        rp(url).then(body => {
            res.status(200).send( JSON.parse(body) );
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        });

    } else {
        res.send( {msg: 'Data inválida'} );
    }
})

app.listen(8081);