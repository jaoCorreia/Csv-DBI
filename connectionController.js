const mysql = require('mysql2');

const connectionController = {
    conn: mysql.createConnection({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        database: process.env.DB,
        password: process.env.DB_PASS,  
    }),
    
    getConnection(){ 
        this.conn.connect((err, res)=>{
            if(err) throw new Error (err);
            console.log("Connected");
        });
    }, 
    
    endConnection(){
        this.conn.end((err,res)=> {
            if(err) throw new Error (err);
            console.log("Disconnected");
        });
    }
}



module.exports = connectionController;