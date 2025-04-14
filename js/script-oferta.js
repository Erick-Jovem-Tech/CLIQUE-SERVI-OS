document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const prestadoresContainer = document.getElementById('prestadoresContainer');
    const prestadorTemplate = document.getElementById('prestadorTemplate');
    const formNovoPrestador = document.getElementById('formNovoPrestador');
    const btnSalvarPrestador = document.getElementById('btnSalvarPrestador');
    const modalDetalhes = new bootstrap.Modal(document.getElementById('modalDetalhesPrestador'));
    let servicoAtual = null;
    
    // Dados de exemplo (simulando "banco de dados")
    let meusServicos = [
        {
            id: 1,
            nome: "João da Silva",
            titulo: "Encanador Profissional",
            categoria: "especializada",
            categoriaTexto: "Mão de Obra Especializada",
            descricao: "Serviços de encanamento residencial e comercial. Conserto de vazamentos, troca de registros, instalação de torneiras, sifões e vasos sanitários. Atendo emergências 24 horas.",
            localizacao: "São Paulo - Zona Leste",
            preco: "90,00",
            contato: "(11) 91234-5678",
            disponibilidade: "Segunda a Sábado, 7h às 19h"
        },
        {
            id: 2,
            nome: "João da Silva",
            titulo: "Pintura Residencial",
            categoria: "especializada",
            categoriaTexto: "Mão de Obra Especializada",
            descricao: "Pintura interna e externa de residências. Preparo de superfícies, aplicação de massa corrida, selador e tinta de qualidade. Orçamento sem compromisso.",
            localizacao: "São Paulo - Zona Leste",
            preco: "60,00",
            contato: "(11) 91234-5678",
            disponibilidade: "Segunda a Sexta, 8h às 17h"
        },
        {
            id: 3,
            nome: "Jão Grilo",
            titulo: "Pintura Residencial",
            categoria: "especializada",
            categoriaTexto: "Mão de Obra Especializada",
            descricao: "Pintura interna e externa de residências. Preparo de superfícies, aplicação de massa corrida, selador e tinta de qualidade. Orçamento sem compromisso.",
            localizacao: "São Paulo - Zona Leste",
            preco: "60,00",
            contato: "(11) 91234-5678",
            disponibilidade: "Segunda a Sexta, 8h às 17h"
        }
    ];
    
    // Carregar serviços na página
    function carregarMeusServicos() {
        // Limpar container (exceto o template)
        while (prestadoresContainer.firstChild) {
            if (prestadoresContainer.firstChild.id !== 'prestadorTemplate') {
                prestadoresContainer.removeChild(prestadoresContainer.firstChild);
            } else {
                break;
            }
        }
        
        // Adicionar cada serviço
        // biome-ignore lint/complexity/noForEach: <explanation>
                        meusServicos.forEach(servico => {
            const novoCard = prestadorTemplate.cloneNode(true);
            novoCard.classList.remove('d-none');
            novoCard.setAttribute('data-id', servico.id);
            
            novoCard.querySelector('.badge').textContent = servico.categoriaTexto;
            novoCard.querySelector('.badge').className = `badge bg-${getBadgeColor(servico.categoria)}`;
            novoCard.querySelector('small.text-muted').textContent = servico.localizacao;
            novoCard.querySelector('.card-title').textContent = servico.titulo;
            novoCard.querySelector('.card-text').textContent = `${servico.descricao.substring(0, 80)}...`;
            novoCard.querySelector('.text-primary').textContent = `R$ ${servico.preco}`;
            
            prestadoresContainer.appendChild(novoCard);
        });
        
        // Adicionar eventos aos cards
        // biome-ignore lint/complexity/noForEach: <explanation>
                        document.querySelectorAll('.prestador-card').forEach(card => {
            // Clique simples - abrir modal com detalhes
            card.addEventListener('click', function(e) {
                // Evitar abrir modal se o clique foi em um botão dentro do card
                if (!e.target.classList.contains('btn-detalhes') && e.target.tagName !== 'BUTTON') {
                    // biome-ignore lint/style/useNumberNamespace: <explanation>
                    const servicoId = parseInt(this.closest('[data-id]').getAttribute('data-id'));
                    const servico = meusServicos.find(s => s.id === servicoId);
                    abrirModalDetalhes(servico);
                }
            });
            
            // Clique duplo - deletar
            card.addEventListener('dblclick', function() {
                this.classList.add('double-click');
                setTimeout(() => {
                    this.classList.remove('double-click');
                    if (confirm('Tem certeza que deseja remover este serviço?')) {
                        // biome-ignore lint/style/useNumberNamespace: <explanation>
                        const servicoId = parseInt(this.closest('[data-id]').getAttribute('data-id'));
                        meusServicos = meusServicos.filter(s => s.id !== servicoId);
                        carregarMeusServicos();
                    }
                }, 500);
            });
        });
    }
    
    // Abrir modal com detalhes do serviço
    function abrirModalDetalhes(servico) {
        servicoAtual = servico;
        
        document.getElementById('prestadorTitulo').textContent = servico.titulo;
        document.getElementById('prestadorDescricao').textContent = servico.descricao;
        document.getElementById('prestadorNome').textContent = servico.nome;
        document.getElementById('prestadorContato').innerHTML = `<i class="fas fa-phone me-1"></i> ${servico.contato}`;
        document.getElementById('prestadorCategoria').textContent = servico.categoriaTexto;
        document.getElementById('prestadorLocalizacao').textContent = servico.localizacao;
        document.getElementById('prestadorPreco').textContent = `R$ ${servico.preco}`;
        document.getElementById('prestadorDisponibilidade').textContent = servico.disponibilidade;
        
        modalDetalhes.show();
    }
    
    // Cor do badge baseado na categoria
    function getBadgeColor(categoria) {
        const cores = {
            'administrativo': 'info',
            'limpeza': 'success',
            'logistica': 'warning',
            'industrial': 'secondary',
            'especializada': 'primary',
            'obra': 'danger'
        };
        return cores[categoria] || 'primary';
    }
    
    // Configurar botão de excluir no modal
    document.querySelector('.btn-excluir')?.addEventListener('click', () => {
        if (servicoAtual && confirm('Tem certeza que deseja excluir este serviço permanentemente?')) {
            meusServicos = meusServicos.filter(s => s.id !== servicoAtual.id);
            prestadoresContainer.innerHTML = ""
            carregarMeusServicos();
            modalDetalhes.hide();
        }
    });
    
    // Adicionar novo serviço
    btnSalvarPrestador.addEventListener('click', () => {
        if (formNovoPrestador.checkValidity()) {
            const novoId = meusServicos.length > 0 ? Math.max(...meusServicos.map(s => s.id)) + 1 : 1;
            
            const novoServico = {
                id: novoId,
                nome: document.getElementById('novoPrestadorNome').value,
                titulo: document.getElementById('novoPrestadorTitulo').value,
                categoria: document.getElementById('novoPrestadorCategoria').value,
                categoriaTexto: document.getElementById('novoPrestadorCategoria').options[document.getElementById('novoPrestadorCategoria').selectedIndex].text,
                descricao: document.getElementById('novoPrestadorDescricao').value,
                localizacao: document.getElementById('novoPrestadorLocalizacao').value,
                preco: document.getElementById('novoPrestadorPreco').value,
                contato: document.getElementById('novoPrestadorContato').value,
                disponibilidade: document.getElementById('novoPrestadorDisponibilidade').value
            };
            
            meusServicos.unshift(novoServico);
            prestadoresContainer.innerHTML = ""
            carregarMeusServicos();
            
            // Limpar formulário
            formNovoPrestador.reset();
            
            // Fechar modal
            bootstrap.Modal.getInstance(document.getElementById('modalNovoPrestador')).hide();
        } else {
            formNovoPrestador.reportValidity();
        }
    });
    
    // Inicializar
    carregarMeusServicos();
});