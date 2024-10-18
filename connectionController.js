const mysql = require('mysql2');
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB);
console.log(process.env.DB_PASS);
const connectionController = {
    conn: mysql.createConnection({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        database: process.env.DB,
        password: process.env.DB_PASS,   
        connectTimeout: 10000   
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

connectionController.getConnection();

module.exports = connectionController;