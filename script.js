// Função para salvar dados no Local Storage e carregar os dados salvos
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Função para exibir detalhes diretamente na página ao invés de alert
function showDetails(data, containerId, index) {
    const detailsContainer = document.getElementById(containerId + 'Details' + index);

    // Verifica se o contêiner de detalhes existe
    if (!detailsContainer) {
        console.error(`O contêiner de detalhes para ${containerId} não foi encontrado.`);
        return;
    }

    // Limpar o conteúdo anterior
    detailsContainer.innerHTML = '';

    // Criar um div para exibir os detalhes do item
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('item-details');

    // Percorrer os dados e exibi-los
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[key]}`;
            detailsDiv.appendChild(p);
        }
    }

    // Exibir o div de detalhes
    detailsContainer.appendChild(detailsDiv);
}

// Função para adicionar ou editar um novo botão à lista e salvar no Local Storage
function addButton(containerId, form, storageKey, editIndex = null) {
    const formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name) {
            formData[form.elements[i].name] = form.elements[i].value;
        }
    }

    const dataList = loadFromLocalStorage(storageKey);
    
    // Verifica se estamos adicionando ou editando
    if (editIndex === null) {
        dataList.push(formData); // Adiciona um novo item se não houver índice de edição
    } else {
        dataList[editIndex] = formData; // Atualiza o item no índice especificado
    }
    
    saveToLocalStorage(storageKey, dataList);
    
    updateButtons(containerId, storageKey); // Atualiza os botões
    form.reset(); // Reseta o formulário após adicionar ou editar
    form.removeAttribute('data-edit-index'); // Remove o índice de edição após salvar

    // Oculta o botão "Confirmar Alteração" após a edição
    const confirmButton = document.getElementById(`alterar${containerId.replace('Container', '')}`);
    if (confirmButton) {
        confirmButton.style.display = 'none';
    }
}

// Função para atualizar os botões no contêiner com os dados salvos
function updateButtons(containerId, storageKey) {
    const container = document.getElementById(containerId);
    const dataList = loadFromLocalStorage(storageKey);
    
    container.innerHTML = ''; // Limpa o contêiner

    dataList.forEach((data, index) => {
        const button = document.createElement('button');
        button.classList.add('data-button');
        button.textContent = data[Object.keys(data)[0]]; // Usa o primeiro campo como rótulo do botão
        button.onclick = () => toggleDetails(containerId, index); // Alterna a exibição de detalhes

        // Botões de ação (Editar e Excluir)
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('actions');

        // Botão Editar
        const editButton = document.createElement('button');
        editButton.classList.add('button-edit');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editItem(containerId, storageKey, index); // Função de editar
        actionContainer.appendChild(editButton);

        // Botão Excluir
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('button-delete');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteItem(containerId, storageKey, index); // Função de excluir
        actionContainer.appendChild(deleteButton);

        container.appendChild(button);
        container.appendChild(actionContainer);

        // Adiciona o contêiner de detalhes
        const detailsContainer = document.createElement('div');
        detailsContainer.id = containerId + 'Details' + index;
        detailsContainer.classList.add('details-container');
        detailsContainer.style.display = 'none'; // Inicialmente oculto
        container.appendChild(detailsContainer);
    });
}

// Função para alternar a exibição de detalhes
function toggleDetails(containerId, index) {
    const detailsContainer = document.getElementById(containerId + 'Details' + index);
    const dataList = loadFromLocalStorage(containerId.replace('Container', ''));

    // Se o contêiner estiver oculto, exibe os detalhes e os botões de "Editar" e "Excluir"
    if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '') {
        showDetails(dataList[index], containerId, index); // Exibe detalhes ao clicar no botão
        detailsContainer.style.display = 'block'; // Mostra o contêiner de detalhes
    } else {
        // Caso contrário, oculta os detalhes
        detailsContainer.innerHTML = ''; // Limpa o conteúdo ao esconder
        detailsContainer.style.display = 'none'; // Esconde o contêiner de detalhes
    }
}

// Função para editar um item existente
function editItem(containerId, storageKey, index) {
    const dataList = loadFromLocalStorage(storageKey);
    const form = document.querySelector(`#${containerId.replace('Container', 'Form')}`);
    const data = dataList[index];

    // Preenche o formulário com os dados existentes para edição
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key];
        }
    });

    // Define o índice de edição no formulário
    form.setAttribute('data-edit-index', index);
    
    // Exibe o botão "Confirmar Alteração" ao iniciar a edição
    const confirmButton = document.getElementById(`alterar${containerId.replace('Container', '')}`);
    if (confirmButton) {
        confirmButton.style.display = 'inline';
    }
}

// Função para excluir um item existente
function deleteItem(containerId, storageKey, index) {
    const dataList = loadFromLocalStorage(storageKey);
    dataList.splice(index, 1); // Remove o item selecionado
    saveToLocalStorage(storageKey, dataList);
    updateButtons(containerId, storageKey); // Atualiza a lista de botões após exclusão
}

// Função para buscar entre os botões
function searchInButtons(containerId, searchInputId) {
    const input = document.getElementById(searchInputId);
    const filter = input.value.toLowerCase();
    const container = document.getElementById(containerId);
    const buttons = container.querySelectorAll('.data-button');

    buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        button.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Função para confirmar busca ao clicar no botão "Confirmar"
function confirmSearch(containerId, searchInputId) {
    searchInButtons(containerId, searchInputId);
}

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch((error) => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}

// Função para carregar os botões com os dados salvos ao carregar a página
window.onload = function() {
    updateButtons('maquinasContainer', 'maquinas');
    updateButtons('recebimentosContainer', 'recebimentos');
    updateButtons('contratosContainer', 'contratos');
    updateButtons('contasContainer', 'contas');
    updateButtons('empresasContainer', 'empresas');
};

// Configuração dos eventos de envio de formulário para cada seção
document.getElementById('maquinaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const editIndex = this.getAttribute('data-edit-index');
    addButton('maquinasContainer', this, 'maquinas', editIndex !== null ? Number(editIndex) : null);
    this.removeAttribute('data-edit-index'); // Remove o índice de edição após a edição ser confirmada
});

document.getElementById('recebimentoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const editIndex = this.getAttribute('data-edit-index');
    addButton('recebimentosContainer', this, 'recebimentos', editIndex !== null ? Number(editIndex) : null);
});

document.getElementById('contratoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const editIndex = this.getAttribute('data-edit-index');
    addButton('contratosContainer', this, 'contratos', editIndex !== null ? Number(editIndex) : null);
});

document.getElementById('contaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const editIndex = this.getAttribute('data-edit-index');
    addButton('contasContainer', this, 'contas', editIndex !== null ? Number(editIndex) : null);
});

document.getElementById('empresaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const editIndex = this.getAttribute('data-edit-index');
    addButton('empresasContainer', this, 'empresas', editIndex !== null ? Number(editIndex) : null);
});