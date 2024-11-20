import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();
oracledb.initOracleClient(); // Opcional, caso precise configurar manualmente o cliente Oracle

const dbConfig = {
    user: "senhas.env.BD-USER",
    password: "senhas.env.BD-PASSWORD", // Substitua pela senha real do usuário
    connectString: "senhas.env.BD-CONNECTSTRING" // Substitua pelo endereço e instância do Oracle
};

export const connectToDB = async () => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log("Conexão com o banco de dados estabelecida.");
        return connection;
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw error;
    }
};
