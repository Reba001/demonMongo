const express = require('express');
//const sqlserver = require('../sqlserver');
const router = express.Router();
//const { query } = require('express');
const sql = require('mssql');
const Title = require('../models/title');


let tiempo = 20;
let timeout = setInterval(getQuery, tiempo *1000);

function establecerIntervalo(){
    clearInterval(timeout);
    timeout = setInterval(getQuery, tiempo * 1000);
}

async function insert(documento){
    let titulo = title.findOne({titulo: documento.titulo});
    if(!titulo){


    }
}


 async function getQuery(){
     //varios episodios, generos y directores y temporada
     try{
        await sql.connect('Server=35.239.71.33,1433;Database=NETFLIX;User Id=sa;Password=BranDoncito123;Encrypt=false')
        const result = await sql.query`
        SELECT t.id, 
                tt.name as tipo_titulo, 
                t.primaryTitle as titulo, 
                t.originalTitle as titulo_original, 
                t.isAdult as es_adulto, 
                t.startYeard as anio, 
                t.endYear as anio_fin, 
                t.runtime as duracion, 
                g.name as genero, 
                n.primeryName as director, 
                e.episode as episodio, 
                e.season as temporada 
            FROM Title t
            INNER JOIN TitleGenre tg 
            ON tg.titleId = t.id
            INNER JOIN Genre g
            ON g.id = tg.genreId
            INNER JOIN Director d 
            ON d.titleId = t.id
            INNER JOIN [dbo].Name n
            ON n.id = d.nameId
            INNER JOIN TitleType tt 
            ON tt.id = t.titleTypeId
            INNER JOIN Episode e
            ON e.titleId = t.id;
        `
         /*let pool = await sql.connect(sqlConfig);
         let result = await pool.request().query(stringQuery);*/
         //console.log(result.recordset);

         console.log(result.recordset);
         result.recordset.forEach(element => {
            console.log(element.titulo);
            var titulo = await Title.findOne({primaryTitle: element.titulo});
            console.log(titulo);
            if(!titulo){
                let setTitulo = new Title();
                setTitulo.primaryTitle = element.titulo;
                setTitulo.originalTitle = element.titulo_original;
                setTitulo.isAdult = element.es_adulto === '1';
                setTitulo.startYear = element.anio;
                setTitulo.endYear = element.anio_fin ? result.recordset.anio_fin : 0;
                setTitulo.runtime = element.runtime;
                let genant = null;
                let generos = result.recordset.map(genero =>{
                    
                    if(genero.id === element.id && genant !== genero.genero){
                        return genero.genero;
                    }
                    genant = genero.genero;
                });

                setTitulo.genders = generos;
                setTitulo.titleType = element.tipo_titulo;
                let dirant = null;
                let directores = result.recordset.map(director =>{
                    if(director.id === element.id && dirant !== director.director){
                        return director.director;
                    }
                    dirant = director.director;
                });
                setTitulo.directors = directores;
                let epant = null;
                let tempant = null;
                let episodios = result.recordset.map(episodio =>{
                    if(episodio.id === element.id 
                        && epant !== episodio.episodio 
                        && tempant !== episodio.temporada){
                            return{
                                season:episodio.temporada,
                                episode: episodio.episodio
                            };

                    }
                    epant = episodio.episodio;
                    tempant = episodio.temporada;

                });
                setTitulo.episodes = episodios;
                setTitulo.save();


            }
                
         });
         
         return result.recordset;
     }catch(err){
         console.log(err);
         return err;

     }
}


router.get('/', (req, res, next) => {
    
    res.render('index', {intervalo:tiempo})
});

router.post('/', async (req, res, next)=>{
    console.log(req.body.tiempo); 
    tiempo = req.body.tiempo;
    establecerIntervalo();
    res.render('index');

});




module.exports = router;



