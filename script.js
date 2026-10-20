const produtos = [
    {
        id: 1,
        nome: "Coxinha",
        descricao: "Coxinha de frango com massa crocante.",
        preco: 6.00,
        categoria: "Salgados",
        imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500"
    },
    {
        id: 2,
        nome: "Pão de Queijo",
        descricao: "Pão de queijo quentinho e saboroso.",
        preco: 4.50,
        categoria: "Salgados",
        imagem: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
    },
    {
        id: 3,
        nome: "Sanduíche Natural",
        descricao: "Sanduíche leve e fresquinho.",
        preco: 9.00,
        categoria: "Salgados",
        imagem: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: 4,
        nome: "Refrigerante",
        descricao: "Refrigerante gelado de 350 ml.",
        preco: 5.50,
        categoria: "Bebidas",
        imagem: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"
    },
    {
        id: 5,
        nome: "Suco Natural",
        descricao: "Suco natural de frutas.",
        preco: 7.00,
        categoria: "Bebidas",
        imagem: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"
    },
    {
        id: 6,
        nome: "Água Mineral",
        descricao: "Garrafa de água mineral de 500 ml.",
        preco: 3.00,
        categoria: "Bebidas",
        imagem: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=500"
    },
    {
        id: 7,
        nome: "Brownie",
        descricao: "Brownie de chocolate delicioso.",
        preco: 6.50,
        categoria: "Doces",
        imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500"
    },
    {
        id: 8,
        nome: "Bolo de Chocolate",
        descricao: "Fatia de bolo com cobertura.",
        preco: 7.50,
        categoria: "Doces",
        imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    }
];

let usuarioLogado = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
) || null;

let carrinho = [];

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function mostrarPagina(pagina) {
    document.querySelectorAll(".pagina").forEach(secao => {
        secao.classList.add("oculto");
    });

    document.getElementById(pagina).classList.remove("oculto");

    window.scrollTo(0, 0);

    if (pagina === "carrinho") {
        mostrarCarrinho();
    }
}

function atualizarUsuario() {
    const nome = document.getElementById("nomeUsuario");
    const btnLogin = document.getElementById("btnLogin");
    const btnSair = document.getElementById("btnSair");

    if (usuarioLogado) {
        nome.textContent = "Olá, " + usuarioLogado.nome.split(" ")[0];
        btnLogin.classList.add("oculto");
        btnSair.classList.remove("oculto");
    } else {
        nome.textContent = "";
        btnLogin.classList.remove("oculto");
        btnSair.classList.add("oculto");
    }
}

document.getElementById("formCadastro").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim().toLowerCase();
    const senha = document.getElementById("senhaCadastro").value;
    const confirmar = document.getElementById("confirmarSenha").value;

    if (senha !== confirmar) {
        alert("As senhas não são iguais!");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.some(usuario => usuario.email === email);

    if (existe) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    usuarios.push({
        nome: nome,
        email: email,
        senha: senha
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");

    document.getElementById("formCadastro").reset();

    mostrarPagina("login");
});

document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(item =>
        item.email === email && item.senha === senha
    );

    if (!usuario) {
        alert("E-mail ou senha incorretos!");
        return;
    }

    usuarioLogado = {
        nome: usuario.nome,
        email: usuario.email
    };

    sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    document.getElementById("formLogin").reset();

    carrinho = [];
    atualizarUsuario();
    atualizarQuantidade();
    mostrarPagina("cardapio");
    mostrarProdutos();

    alert("Bem-vindo à Cantina Digital, " + usuario.nome + "!");
});

function sair() {
    usuarioLogado = null;
    carrinho = [];

    sessionStorage.removeItem("usuarioLogado");

    atualizarUsuario();
    atualizarQuantidade();
    mostrarPagina("inicio");
}

function abrirCardapio() {
    if (!usuarioLogado) {
        alert("Faça login ou cadastre-se para acessar o cardápio!");
        mostrarPagina("login");
        return;
    }

    mostrarPagina("cardapio");
    mostrarProdutos();
}

function mostrarProdutos(categoria = "Todos") {
    const lista = document.getElementById("listaProdutos");

    lista.innerHTML = "";

    const filtrados = produtos.filter(produto =>
        categoria === "Todos" || produto.categoria === categoria
    );

    filtrados.forEach(produto => {
        lista.innerHTML += `
            <div class="produto-card">
                <img src="${produto.imagem}" alt="${produto.nome}">

                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>

                    <div class="preco">
                        ${formatarPreco(produto.preco)}
                    </div>

                    <button onclick="adicionarCarrinho(${produto.id})">
                        + Adicionar ao carrinho
                    </button>
                </div>
            </div>
        `;
    });
}

function filtrarProdutos(categoria, botao) {
    document.querySelectorAll(".categoria").forEach(item => {
        item.classList.remove("ativo");
    });

    botao.classList.add("ativo");

    mostrarProdutos(categoria);
}

function adicionarCarrinho(id) {
    if (!usuarioLogado) {
        mostrarPagina("login");
        return;
    }

    const produto = produtos.find(item => item.id === id);

    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    atualizarQuantidade();

    alert(produto.nome + " adicionado ao carrinho!");
}

function atualizarQuantidade() {
    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade, 0
    );

    document.getElementById("quantidadeCarrinho").textContent = quantidade;
}

function mostrarCarrinho() {
    const container = document.getElementById("itensCarrinho");

    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        container.innerHTML += `
            <div class="item-carrinho">
                <div>
                    <h3>${item.nome}</h3>
                    <p>${formatarPreco(item.preco)} cada</p>
                </div>

                <div>
                    <button onclick="alterarQuantidade(${item.id}, -1)">−</button>
                    <strong> ${item.quantidade} </strong>
                    <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
                </div>

                <div>
                    <strong>${formatarPreco(subtotal)}</strong>
                </div>

                <button onclick="removerProduto(${item.id})">
                    Remover
                </button>
            </div>
        `;
    });

    document.getElementById("totalCarrinho").textContent = formatarPreco(total);
}

function alterarQuantidade(id, valor) {
    const item = carrinho.find(produto => produto.id === id);

    if (!item) return;

    item.quantidade += valor;

    if (item.quantidade <= 0) {
        removerProduto(id);
        return;
    }

    mostrarCarrinho();
    atualizarQuantidade();
}

function removerProduto(id) {
    carrinho = carrinho.filter(item => item.id !== id);

    mostrarCarrinho();
    atualizarQuantidade();
}

function finalizarPedido() {
    if (!usuarioLogado) {
        mostrarPagina("login");
        return;
    }

    if (carrinho.length === 0) {
        alert("Adicione produtos antes de finalizar!");
        return;
    }

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade, 0
    );

    const numeroPedido = Math.floor(Math.random() * 90000) + 10000;

    const resumo = carrinho.map(item =>
        `${item.quantidade}x ${item.nome}`
    ).join("\n");

    alert(
        "PEDIDO REALIZADO!\n\n" +
        "Pedido nº: " + numeroPedido + "\n" +
        "Cliente: " + usuarioLogado.nome + "\n\n" +
        resumo + "\n\n" +
        "Total: " + formatarPreco(total) + "\n\n" +
        "Este é um pedido de demonstração.\n" +
        "Nenhuma compra ou pagamento real foi realizado."
    );

    carrinho = [];

    atualizarQuantidade();
    mostrarPagina("cardapio");
    mostrarProdutos();
}

atualizarUsuario();
mostrarProdutos();
