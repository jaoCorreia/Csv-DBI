
const parser = require('csv-parser');
const fs = require('fs');
const connectionController = require('./connectionController');


connectionController.getConnection();

const query = {
    atualizar: "UPDATE tb_uc SET uc_dataInstalacao= ?, uc_nio= ?, uc_status = 1 WHERE uc_numero = ?;",
    buscar: "SELECT * FROM tb_uc WHERE uc_numero = ?"
}

const migracaoUc = {
    
    inserirLatLong(data){
        return new Promise((resolve, reject)=>{

            try{
                let date = new Date(data.DATA).toISOString().slice(0,10);
                connectionController.conn.query(query.atualizar,[date,data.NIO,data.UC],(err,res)=>{
                    if(err){
                        console.log(err);
                    }   
                    console.log(data);
                    resolve(true);
                })
            }catch(err){
                reject(err);
            }

        })
    }, 
}


async function dadosLista(){

    let i = 0

fs.createReadStream('dadosL.csv').pipe(parser({separator: ';',skipLines: 1})).on('data', async (dadoLinha) => {      

            console.log(dadoLinha);
            let inserir = await migracaoUc.inserirLatLong(dadoLinha);    
     
            if(inserir){
                console.log("inserido "+i);
                i++
            }       

}).on('error', error =>{
    console.error("ERRO AO LER CSV: ", error);
}).on('end', ()=>{
    console.log("fim")
})


}

dadosLista();
