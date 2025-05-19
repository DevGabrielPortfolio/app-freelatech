// Hora e data com as saudações
/* const definirSaudacao = () => {
    const header = document.querySelector('#saudacaoHeader');
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
            saudacao = 'Boa tarde!'
        }else{
            saudacao = 'Boa noite!'
        }

        header.innerHTML = <span>${saudacao}</span> <span>${dataAtual} ${horas}:${minutos}:${segundos}</span>;

    }, 1000);
} */

    
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
const carregarTarefas = () =>{
    const taskList = document.querySelector('#taskList');
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas.forEach(tarefa => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if(tarefa.concluida){
            taskItem.classList.add('concluida');
        }
        taskItem.innerHTML = tarefa.html;
        taskList.appendChild(taskItem);
        // Adicionando eventListers aos botões da tarefa.
        taskItem.querySelector('.complete-btn').addEventListener('click',function(){
            marcarComoConcluida(this);
        });
        taskItem.querySelector('.edit-btn').addEventListener('click', function(){
            editarTarefas(this);
        });
        taskItem.querySelector('.delete-btn').addEventListener('click', function(){
            excluirTarefa(this);
        })
    });
}
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

        const dataFormada = new Date(taskDate).toLocaleDateString('pt-BR', {
            day:'2-digit',  
            month:'2-digit',
            year: '2-digit'
        });

        const taskHTML = `
        <h3>${taskName}</h3>
        <p>${taskDescription}</p>
        <p><strong>Vencimento:</strong> ${dataFormada} às ${taskTime}</p>
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
        alert('Tarefa adicionada com sucesso!');
        // Limpar campos dos formulario
        document.querySelector('#taskForm').reset();

    }else{
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}

window.onload = function(){
    definirSaudacao();
    carregarTarefas();

    // Adicionando event listeners para os botões
    document.querySelector('#adicionarTarefaBtn').addEventListener('click', function(e){
        e.preventDefault();
        adicionarTarefa();
    });
};

const marcarComoComcluida = (button) => {}

const editarTarefas = (button) => {}

const excluirTarefa = (button) => {}

// Funções para filtrar tarefas

const filtrarTarefas = (filtro) => {}

const ordenarTarefas = (ordem) => {}