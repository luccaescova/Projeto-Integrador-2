import {Request, RequestHandler, Response} from "express";

/*
    Nampespace que contém tudo sobre "contas de usuários"
*/
export namespace AccountsHandler {
    
    /**
     * Tipo UserAccount
     */
    export type UserAccount = {
        name:string;
        email:string;
        password:string;
        birthdate:string; 
    };

    // Array que representa uma coleção de contas. 
    let accountsDatabase: UserAccount[] = [];

    /**
     * Salva uma conta no banco de dados. 
     * @param ua conta de usuário do tipo @type {UserAccount}
     * @returns @type { number } o código da conta cadastrada como posição no array.
     */
    export function saveNewAccount(ua: UserAccount) : number{
        accountsDatabase.push(ua);
        return accountsDatabase.length;
    }
     
//verifica se a conta existe
    export function AccountExists(email: string):boolean{
        let exists:boolean = false;
        accountsDatabase.find(a => {
            if(a.email === email){
                exists = true;
                return
            }
        });
        return exists
    }

    /**
     * Função para tratar a rota HTTP /signUp. 
     * @param req Requisição http tratada pela classe @type { Request } do express
     * @param res Resposta http a ser enviada para o cliente @type { Response }
     */
    export const createAccountRoute: RequestHandler = (req: Request, res: Response) => {
        // Passo 1 - Receber os parametros para criar a conta
        const pName = req.get('name');
        const pEmail = req.get('email');
        const pPassword = req.get('password');
        const pBirthdate = req.get('birthdate');
        
        if(pName && pEmail && pPassword && pBirthdate){
            // prosseguir com o cadastro... 
            const newAccount: UserAccount = {
                name: pName,
                email: pEmail, 
                password: pPassword,
                birthdate: pBirthdate
            }
            const ID = saveNewAccount(newAccount);
            res.statusCode = 200; 
            res.send(`Nova conta adicionada. Código: ${ID}`);
        }else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    class CadastroService {
        private users: UserAccount[] = [];
      
        registerUser (name: string, email: string, password: string, birthdate: string) {
          const user: UserAccount = {
            name,
            email,
            password,
            birthdate
          };
          this.users.push(user);
          return user;
        }
      }
      export const login = (req: Request, res: Response) => {
        const { email, password } = req.body;
    
        // Verifica se o usuário existe
        const user = users.find(a => a.email === email && a.password === password);
    
        if (user) {
            return res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }
    };

}
