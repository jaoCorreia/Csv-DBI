const readline = require('readline');
const connectionController = require('./connectionController');
const parser = require('csv-parser');
const fs = require('fs');
const logo = `+--------------------------------------------------------+
|..%%%%....%%%%...%%..%%..........%%%%%...%%%%%...%%%%%%.|
|.%%..%%..%%......%%..%%..........%%..%%..%%..%%....%%...|
|.%%.......%%%%...%%..%%..%%%%%%..%%..%%..%%%%%.....%%...|
|.%%..%%......%%...%%%%...........%%..%%..%%..%%....%%...|
|..%%%%....%%%%.....%%............%%%%%...%%%%%...%%%%%%.|
|........................................................|
+--------------------------------------------------------+`;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const querys = {
    inserirRota: "INSERT INTO `eletroresolve`.`tb_rota_leitura` (`data_inicio`, `data_final`,`etapa`) VALUES (?,?,?);", 
    atualizarComOldNio: "UPDATE tb_uc SET uc_dataInstalacao= ?, old_nio=?, uc_nio= ?, uc_status = 1 WHERE uc_numero = ?;", 
    atualizarBaseUc: "UPDATE tb_uc SET etapa= ?, regiao= ?, disjuntor= ?,complemento= ?,referencia= ?, uc_bairro = ? WHERE uc_numero = ?;", 
    atualizarBaseUcSemDisjuntor: "UPDATE tb_uc SET etapa= ?, regiao= ?,complemento= ?,referencia= ?, uc_bairro = ? WHERE uc_numero = ?;", 
    inserirUC: "INSERT INTO tb_uc (uc_numero, uc_idpro, uc_lat, uc_long, uc_status, uc_nio, uc_tipo, uc_endereco, "+
               "uc_bairro, uc_cidade, old_nio, etapa, regiao, disjuntor, referencia, complemento) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
    inserirProprietario: "INSERT INTO tb_uc (pro_email, pro_telegon)",
    buscarUcPorNumero: "SELECT * FROM tb_uc where uc_numero = ?", 
    atualizarEtapa:"UPDATE tb_uc SET etapa = ? where uc_numero = ?"
}

const csvDbiDAO = {
    atualizarUc(data){
        return new Promise((resolve, reject)=>{
            let date = new Date(data.DATA).toISOString().slice(0,10);
            connectionController.conn.query(querys.atualizarComOldNio,[date,data.OLD_NIO,data.NEW_NIO,data.UC],(err,res)=>{
                if(err) throw reject(new Error(err));
                resolve(res);
            });
        });
    }, 

    inserirRota(data){
        return new Promise((resolve,reject)=> {
                let dateInicio = new Date(data.INICIO).toISOString().slice(0,10);
                let dateFinal = new Date(data.FINAL).toISOString().slice(0,10);
                connectionController.conn.query(querys.inserirRota,[dateInicio,dateFinal,data.ETAPA],(err,res)=>{
                    if(err) reject(new Error(err));
                    resolve(res);
                });
        });
    }, 

    atualizarEtapa(data){
        return new Promise((resolve,reject)=> {
            connectionController.conn.query(querys.atualizarEtapa,[data.ETAPA,data.UC],(err,res)=>{
                if(err) reject(new Error(err)); 
                resolve(res);
            });
        });
    },

    buscarUcPorNumero(uc){
        return new Promise((resolve,reject)=> {
            connectionController.conn.query(querys.buscarUcPorNumero,[uc],(err,res)=>{
                if(err) reject(new Error(err)); 
                resolve(res);
            });
        });
    },
    
    inserirProprietario(data){
        return new Promise((resolve,reject)=> {
            connectionController.conn.query(querys.buscarUcPorNumero,[uc],(err,res)=>{
                if(err) reject(new Error(err)); 
                resolve(res);
            });
        });
    },
  
    // inserirUC(data){
    //     return new Promise((resolve,reject)=> {
    //         connectionController.conn.query(querys.buscarUcPorNumero,[uc],(err,res)=>{
    //             if(err) reject(new Error(err)); 
    //             resolve(res);
    //         });
    //     });
    // },

    atualizarBase(data){
        return new Promise((resolve,reject)=> {
            if(data.DISJUNTOR == " "){
                console.log(data.DISJUNTOR);
                connectionController.conn.query(querys.atualizarBaseUc,[data.ETAPA, data.REGIAO, data.DISJUNTOR, 
                    data.COMPLEMENTO, data.REFERENCIA, data.BAIRRO, data.UC],(err,res)=>{
                    if(err) reject(new Error(err)); 
                    resolve(res);
                })
            }else{
                connectionController.conn.query(querys.atualizarBaseUcSemDisjuntor,[data.ETAPA, data.REGIAO, 
                    data.COMPLEMENTO, data.REFERENCIA, data.BAIRRO, data.UC],(err,res)=>{
                    if(err) reject(new Error(err)); 
                    resolve(res);
                })
            }
        })
    }
}

function mostrarLoader() {
    const frames = ['𓃉𓃉𓃉', '𓃉𓃉∘', '𓃉∘°', '∘°∘', '°∘𓃉', '∘𓃉𓃉'];
    let i = 0;
    return setInterval(() => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Aguarde ${frames[i++]}`);
      i %= frames.length;
    }, 200); 
}
  
 function csvDbiController(arquivo, op){
    let i = 1;
    let data = [];
    const opcao= op;
    fs.createReadStream(`${arquivo}.csv`)
    .pipe(parser({separator: ';',skipLines: 1}))
    .on('data', async (dadoLinha) => data.push(dadoLinha))
    .on('error',error=>{throw new Error (error)})
    .on('end',  ()=>{
        if(opcao == 1){
            let loader = mostrarLoader();
            let dataPromisse = data.map(d => csvDbiDAO.atualizarUc(d));
            Promise.all(dataPromisse).then((res) => {
                clearInterval(loader);
                readline.clearLine(process.stdout,0);
                console.log(`\n${res.length} UCs atualizadas`);
            });

        }else if(opcao == 2){
            let loader = mostrarLoader();
            let dataPromisse = data.map(d => csvDbiDAO.inserirRota(d));
            Promise.all(dataPromisse).then((res)=>{
                clearInterval(loader);
                readline.clearLine(process.stdout,0);
                console.log(`\n${res.length} Rotas inseridas`)
            });

        }else if(opcao == 3){
            let loader = mostrarLoader();
            let dataPromisse = data.map(d => csvDbiDAO.atualizarBase(d));
            Promise.all(dataPromisse).then((res)=>{
                clearInterval(loader);
                readline.clearLine(process.stdout,0);
                console.log(`\n${res.length} UCs atualizadas`)
            });

        // }else if(opcao == 4){
        //     let loader = mostrarLoader();
        //     let dataPromisse = data.map(d => csvDbiDAO.atualizarBase(d));
        //     Promise.all(dataPromisse).then((res)=>{
        //         clearInterval(loader);
        //         readline.clearLine(process.stdout,0);
        //         console.log(`\n${res.length} UCs atualizadas`)
        //     });
        }
        
    });
}


rl.question(logo+'\nMenu de opção Csv-DBI\n1.Atualizar status uc (com old_nio)\n2.Inserir rota de leitura\n3.Atualizar a base de UCs\n', (op) => {
    const opcao = op; 
    if(parseInt(opcao)){
        rl.question('Insira o nome do arquivo:\n',async (arquivo)=>{
            rl.close();   
            await connectionController.getConnection();
            csvDbiController(arquivo,opcao);
        });
    }else{
        throw new Error("Opção Invalida!");
    }
});