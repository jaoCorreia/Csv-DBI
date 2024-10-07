const mysql = require('mysql2');
const connectionController = {

    conn: mysql.createConnection({
        host: process.env.HOST, 
        user: process.env.USER, 
        database: process.env.DATABASE,
        password: process.env.PASS,      
    }),

    getConnection(){
        this.conn.connect((err, res)=>{
            if(err){
                console.log(err);
            }else{
                console.log("conectado ao banco de dados ");
            }
        });
    }, 
    
    endConnection(){
        this.conn.end();
    }
}

module.exports = connectionController;