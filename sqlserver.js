//const { query } = require('express');
const sql = require('mssql');

const sqlConfig = {
    user: 'sa',
    password: 'BranDoncito123',
    database: 'NETFLIX',
    server: '34.69.214.50'
};

 async function getQuery(stringQuery){
     try{
         let pool = await sql.connect(sqlConfig);
         let result = await pool.request().query(stringQuery);
         console.log(result);
         return result;
     }catch(err){
         console.log(err);
         return err;

     }

}
module.exports = sql;
