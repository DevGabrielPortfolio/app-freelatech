const definirSaudacao = () => {
    const header = document.querySelector('#saudacaoHeader');
    if (!header) {
        console.error("Elemento com id 'saudacaoHeader' não encontrado.");
        return;
    }

    setInterval(() => {
        const now = new Date();
        const horas = now.getHours();
        const minutos = now.getMinutes().toString().padStart(2,'0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const dataAtual = now.toLocaleDateString('pt-BR');

        let saudacao;

        if(horas >= 6 && horas < 12 ){
            saudacao = 'Bom dia!';
        }else if(horas >= 12 && horas <= 18){
            saudacao = 'Boa tarde!';
        }else{
            saudacao = 'Boa noite!';
        }

        header.innerHTML = `<span>${saudacao}</span> <span>${dataAtual} ${horas}:${minutos}:${segundos}</span>`;

    }, 1000);
};

document.addEventListener('DOMContentLoaded', definirSaudacao);

// Carregar tarefas do localStorange ao iniciar
const carregarTarefas = () => {
const taskList = document.querySelector('#taskList');
const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

taskList.innerHTML = ''; // Limpa a lista atual antes de adicionar novamente

tarefas.forEach(tarefa => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    if (tarefa.concluida) {
        taskItem.classList.add('concluida');
    }
    taskItem.innerHTML = tarefa.html;
    taskList.appendChild(taskItem);

    // Adicionando event listeners aos botões da tarefa
    taskItem.querySelector('.complete-btn').addEventListener('click', function () {
        marcarComoConcluida(this);
    });
    taskItem.querySelector('.edit-btn').addEventListener('click', function () {
        editarTarefas(this);
    });
    taskItem.querySelector('.delete-btn').addEventListener('click', function () {
        excluirTarefa(this);
    });
});
};

// Função para adicionar uma nova tarefa
const adicionarTarefa = () =>{
const taskName = document.querySelector('#taskName').value;
const taskDescription = document.querySelector('#taskDescription').value;
const taskDate = document.querySelector('#taskDate').value;
const taskTime = document.querySelector('#taskTime').value;

if(taskName && taskDate && taskTime){
    const taskList = document.querySelector('#taskList');

    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');

    const dataInput = taskDate.split('-');


    const dataFormatada = `${dataInput[2]}/${dataInput[1]}/${dataInput[0]}`;

    const taskHTML = `
    <h3>${taskName}</h3>
    <p>${taskDescription}</p>
    <p><strong>Vencimento:</strong> ${dataFormatada} às ${taskTime}</p>
        <div class="task-actions">
            <button class="complete-btn">Concluir</button>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
        </div>
    `;

    taskItem.innerHTML= taskHTML;
    taskList.appendChild(taskItem);

    taskItem.querySelector('.complete-btn').addEventListener('click',function(){
        marcarComoConcluida(this);
    });
    taskItem.querySelector('.edit-btn').addEventListener('click', function(){
        editarTarefas(this);
    });
    taskItem.querySelector('.delete-btn').addEventListener('click', function(){
        excluirTarefa(this);
    })

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({
        nome:taskName,
        descricao: taskDescription,
        data: taskDate,
        hora: taskTime,
        html: taskHTML
    });

    // Conversão do objeto para string
    localStorage.setItem('tarefas',JSON.stringify(tarefas));
    // Informação para o usuário
    Swal.fire({
        title: "Tarefa adicionada com sucesso!",
        icon: "success",
        draggable: true
    });
    // Limpar campos dos formulario
    document.querySelector('#taskForm').reset();

}else{
    Swal.fire({
        title: "Por favor, preencha todos os campos obrigatórios!",
        icon: "info",
        draggable: true
    });
}
}

window.onload = function(){
definirSaudacao();
carregarTarefas();

// Adicionando event listeners para os botões
document.querySelector('#adicionarTarefaBtn').addEventListener('click', function (e) {
e.preventDefault();
adicionarTarefa();
});

// Event listeners para os botões de filtro
document.querySelector('#filtrarTodasBtn').addEventListener('click', function() {
filtrarTarefas('todas');
});

document.querySelector('#lixeiraBtn').addEventListener('click', function() {
mostrarTarefasExcluidas();
})

document.querySelector('#filtrarPendentesBtn').addEventListener('click', function() {
filtrarTarefas('pendentes');
});

document.querySelector('#filtrarConcluidasBtn').addEventListener('click', function() {
filtrarTarefas('concluidas');
});

// Event listeners para os botões de ordenação
document.querySelector('#ordenarRecentesBtn').addEventListener('click', function() {
ordenarTarefas('recentes');
});

document.querySelector('#ordenarAntigasBtn').addEventListener('click', function() {
ordenarTarefas('antigas');
});
};

const marcarComoConcluida = (button) => {
const taskItem = button.closest('.task-item')

if (taskItem.classList.contains('concluida')){
    Swal.fire({
        title: "Esta tarefa já foi concluida!",
        icon: "info",
        draggable: true
    });
    return
}

taskItem.classList.add('concluida')

const editBtn = taskItem.querySelector('.edit-btn');
const deleteBtn = taskItem.querySelector('.delete-btn')

editBtn.disabled=true
deleteBtn.disabled=true

const taskName = taskItem.querySelector('h3').textContent
let tarefas = JSON.parse(localStorage.getItem('tarefas'))||[]
const tarefaIndex = tarefas.findIndex (t => t.nome === taskName)

if (tarefaIndex !== -1){
    tarefas [tarefaIndex].concluida = true
    tarefas[tarefaIndex].html = taskItem.innerHTML

    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

setTimeout(()=>{
    Swal.fire({
        title: "Tarefa marcada como concluída!",
        icon: "success",
        draggable: true
    });
}, 200)
}

const editarTarefas = (button) => {
const taskItem = button.closest('.task-item')

const newName = prompt('Edite o nome da tarefa: ', taskItem.querySelector('h3').textContent())
const newDescription = prompt('Edite a descrição da tarefa: ', taskItem.querySelector('p').textContent())



}

const excluirTarefa = (button) => {

    Swal.fire({
        title: "Deseja realmente excluir esta tarefa?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar"
      }).then((result) => {
        if (result.isConfirmed) {

            // pego o elemento pai com a classe task-item
            const taskItem = button.closest('.task-item');
            // pego o valor do h3 dentro do elemento pai
            const taskName = taskItem.querySelector('h3').textContent;

            // pego o array de tarefas do localStorage
            let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
            // Pego o array de tarefas ecluídas de dentro do localStorage
            let tarefasLixeira = JSON.parse(localStorage.getItem('tarefasLixeira')) || [];

            // Encontro a tarefa que vai ser excluída
            const tarefaIndex = tarefas.findIndex(t => t.nome === taskName);

            // se essa tarefa for encontrada
            if (tarefaIndex !== -1) {
                // Removo a tarefa da lista de tarefas incial
                const tarefaExcluida = tarefas.splice(tarefaIndex, 1)[0];

                // Coloco a tarefa que foi removida dentro da lista de tarefas excluídas
                tarefasLixeira.push(tarefaExcluida);

                // Atualiza o localStorage co as novas tarefas
                localStorage.setItem('tarefas', JSON.stringify(tarefas));
                localStorage.setItem('tarefasLixeira', JSON.stringify(tarefasLixeira));

                // atualizo a interface
                taskItem.remove();

                // retorno para o usuário
                Swal.fire({
                    title: "Tarefa movida para a lixeira!",
                    icon: "success",
                    draggable: true
                });
            }


          Swal.fire({
            title: "Tarefa movida para a lixeira!",
            icon: "success"
          });

        }
      });

    // // Faço a confirmação de exclusão para o usuário
    // if (confirm('Deseja realmente excluir esta tarefa?')) {
    //     // pego o elemento pai com a classe task-item
    //     const taskItem = button.closest('.task-item');
    //     // pego o valor do h3 dentro do elemento pai
    //     const taskName = taskItem.querySelector('h3').textContent;

    //     // pego o array de tarefas do localStorage
    //     let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    //     // Pego o array de tarefas ecluídas de dentro do localStorage
    //     let tarefasLixeira = JSON.parse(localStorage.getItem('tarefasLixeira')) || [];

    //     // Encontro a tarefa que vai ser excluída
    //     const tarefaIndex = tarefas.findIndex(t => t.nome === taskName);

    //     // se essa tarefa for encontrada
    //     if (tarefaIndex !== -1) {
    //         // Removo a tarefa da lista de tarefas incial
    //         const tarefaExcluida = tarefas.splice(tarefaIndex, 1)[0];

    //         // Coloco a tarefa que foi removida dentro da lista de tarefas excluídas
    //         tarefasLixeira.push(tarefaExcluida);

    //         // Atualiza o localStorage co as novas tarefas
    //         localStorage.setItem('tarefas', JSON.stringify(tarefas));
    //         localStorage.setItem('tarefasLixeira', JSON.stringify(tarefasLixeira));

    //         // atualizo a interface
    //         taskItem.remove();

    //         // retorno para o usuário
    //         Swal.fire({
    //             title: "Tarefa movida para a lixeira!",
    //             icon: "success",
    //             draggable: true
    //         });
    //     }
    // }
};

// const excluirTarefa = (button) =>{
//     if (confirm('Deseja realmente exluir esta tarefa?')){
//         const taskItem = button.closest('.task-item');
//         const taskName = taskItem.querySelector('h3').textContent;

//         let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

//         tarefas = tarefas.filter(t => t.nome !== taskName);
//         localStorage.setItem('tarefas', JSON.stringify(tarefas));

//         taskItem.remove();

//         alert('Tarefa Excluída.');
//     }
// }




// Funções para filtrar tarefas

const filtrarTarefas = (filtro) => {
const tarefas = document.querySelectorAll('.task-item')
console.log(tarefas)

tarefas.forEach(tarefa => {
    switch(filtro){
        case'todas':
            tarefa.style.display = 'block';

            break;
    
        case 'pendentes':

            tarefa.style.display = tarefa.classList.contains('concluida') ? 'none' : 'block'

            break;

        case 'concluidas':
            tarefa.style.display = tarefa.classList.contains('concluida') ? 'block' : 'none'

            break;
        }


})
}

// const ordenarTarefas = (ordem) => {



//     const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

//     const hoje = new Date();

//     // Filtra tarefas com base no tipo de 'ordem'
//     const tarefasFiltradas = tarefas.filter(tarefa => {

//         const dataVencimento = new Date(tarefa.data);

//         const diasDeDiferenca = (dataVencimento - hoje) / (1000 * 3600 * 24); // Diferença em dias

//         return (ordem === 'recentes' && diasDeDiferenca >= 0 && diasDeDiferenca <= 30) ||

//                (ordem === 'antigas' && diasDeDiferenca < 0 && diasDeDiferenca >= -30);

//     });

//     // Atualiza a lista de tarefas no HTML
//     const taskList = document.querySelector('#taskList');

//     taskList.innerHTML = ''; // Limpa a lista existente

//     tarefasFiltradas.forEach(tarefa => {

//         const taskItem = document.createElement('div');

//         taskItem.classList.add('task-item');

//         if (tarefa.concluida) taskItem.classList.add('concluida');

//         taskItem.innerHTML = tarefa.html;

//         taskList.appendChild(taskItem);

//         // Adiciona os event listeners diretamente
//         taskItem.querySelector('.complete-btn').onclick = () => marcarComoConcluida(tarefa);

//         taskItem.querySelector('.edit-btn').onclick = () => editarTarefas(tarefa);

//         taskItem.querySelector('.delete-btn').onclick = () => excluirTarefa(tarefa);

//     });

// }


// Event listeners para os botões de ordenação


const ordenarTarefas = (ordem) => {
const taskList = document.querySelector('#taskList');
const tarefas = Array.from(document.querySelectorAll('.task-item'));
const dadosTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

tarefas.sort((a, b) => {
    const nomeA = a.querySelector('h3').textContent;
    const nomeB = b.querySelector('h3').textContent;

    const tarefaA = dadosTarefas.find(t => t.nome === nomeA);
    const tarefaB = dadosTarefas.find(t => t.nome === nomeB);

    const dataA = new Date(`${tarefaA.data}T${tarefaA.hora}`);
    const dataB = new Date(`${tarefaB.data}T${tarefaB.hora}`);

    return ordem === 'antigas' ? dataA - dataB : dataB - dataA;
});

taskList.innerHTML = '<h2>Suas Tarefas</h2>';
tarefas.forEach(tarefa => taskList.appendChild(tarefa));


// 👉 Agora sim, atualiza o HTML
// taskList.innerHTML = ''; // Limpa a lista

// tarefas.forEach(taskItem => {
//     taskList.appendChild(taskItem); // Reinsere na nova ordem

//     // Reatribui event listeners (opcional, se forem perdidos)
//     taskItem.querySelector('.complete-btn').onclick = () => marcarComoConcluida(taskItem.querySelector('.complete-btn'));
//     taskItem.querySelector('.edit-btn').onclick = () => editarTarefas(taskItem.querySelector('.edit-btn'));
//     taskItem.querySelector('.delete-btn').onclick = () => excluirTarefa(taskItem.querySelector('.delete-btn'));
// });
};

// document.querySelector('#ordenarRecentesBtn').addEventListener('click', function () {
//     ordenarTarefas('recentes');
// });

// document.querySelector('#ordenarAntigasBtn').addEventListener('click', function () {
//     ordenarTarefas('antigas');
// });

const mostrarTarefasExcluidas = () =>{
    const tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasLixeira')) || [];

    const tarefasValidas = tarefasExcluidas.filter(tarefa => tarefa && tarefa.nome);

    if(tarefasValidas.length === 0){
        Swal.fire({
            icon: "error",
            title: "Não há tarefas na lixeira!"
        });
        return;
    }

    let mensagem = 'Tarefas na Lixeira:\n\n';

    tarefasValidas.forEach((tarefa, index) =>{
        mensagem += `${index + 1}. ${tarefa.nome}\n`
    })

    const resposta = prompt(mensagem + '\nDigite o número da tarefa que deseja restaurar (ou cancele para sair: ');

    if(resposta && !isNaN(resposta)){
        const index = parseInt(resposta) -1
        if(index >= 0 && index < tarefasValidas.length){
            restaurarTarefa(tarefasValidas[index]);
        }else{
            Swal.fire({
                icon: "error",
                title: "Número inválido!"
            });
        }
    }
}

const restaurarTarefa = (tarefaExcluida) =>{
    const tarefas = JSON.parse(localStorage.getItem('tarefa')) || [];
    tarefas.push(tarefaExcluida);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasLixeira')) || [];
    tarefasExcluidas = tarefasExcluidas.filter(t => t.nome !== tarefaExcluida.nome);
    localStorage.setItem('tarefasLixeira', JSON.stringify(tarefasExcluidas));

    location.reload();
}