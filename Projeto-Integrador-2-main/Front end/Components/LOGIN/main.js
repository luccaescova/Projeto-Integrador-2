function isValid(email, password) {
    if (email && password) {
        return true;
    } else if (!email && !password) {
        showErrorMessage('Preencha os campos para fazer login');
    } else if (!email) {
        showErrorMessage('Preencha o email');
    } else {
        showErrorMessage('Preencha a senha');
    }
    return false; // Garantir um retorno booleano
}

function performLogin() {
    const email = document.getElementById("fieldEmail").value;
    const password = document.getElementById("fieldPassword").value;

    if (isValid(email, password)) {
        // Simulando verificação de usuário
        const validUser = "usuario@exemplo.com";
        const validPassword = "senha123";

        if (email === validUser && password === validPassword) {
            console.info("Login bem-sucedido!"); // Exemplo de sucesso
            showErrorMessage('Login bem-sucedido!'); // Pode substituir por redirecionamento
        } else {
            showErrorMessage('Usuário inexistente ou senha incorreta.');
        }
    }
}

function showErrorMessage(message) {
    console.info("Mostrando mensagem de erro...");
    var box = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    box.style.display = "block"; // Sempre mostrar a caixa de mensagem
}
