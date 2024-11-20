import { connectToDB } from "../config/database";

export const executeQuery = async (query: string, params: any[] = []) => {
    try {
        const connection = await connectToDB();
        const result = await connection.execute(query, params, { autoCommit: true });
        await connection.close();
        return result.rows;
    } catch (error) {
        console.error("Erro ao executar consulta:", error);
        throw error;
    }
};
