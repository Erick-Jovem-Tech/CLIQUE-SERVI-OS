document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const servicosContainer = document.getElementById('servicosContainer');
    const servicoTemplate = document.getElementById('servicoTemplate');
    const formNovoServico = document.getElementById('formNovoServico');
    const btnSalvarServico = document.getElementById('btnSalvarServico');
    const modalDetalhes = new bootstrap.Modal(document.getElementById('modalDetalhesServico'));
    
    // Dados de exemplo (simulando "banco de dados")
    let servicos = [
        {
            id: 1,
            titulo: "Eletricista Residencial",
            categoria: "especializada",
            categoriaTexto: "Mão de Obra Especializada",
            descricao: "Realizo instalações elétricas residenciais, manutenção, troca de disjuntores, tomadas e interruptores. Atendo emergências 24h.",
            localizacao: "São Paulo - SP",
            preco: "80,00",
            prestador: "Carlos Silva",
            disponibilidade: "Segunda a Sábado, 8h às 18h",
            contato: "(11) 98765-4321"
        },
        {
            id: 2,
            titulo: "Limpeza Pós-Obra",
            categoria: "limpeza",
            categoriaTexto: "Limpeza e Conservação",
            descricao: "Serviço especializado de limpeza após reformas e construções. Remoção de resíduos, limpeza de pisos, paredes e vidros.",
            localizacao: "Osasco - SP",
            preco: "45,00",
            prestador: "Limpeza Total",
            disponibilidade: "Todos os dias, 7h às 19h",
            contato: "(11) 91234-5678"
        }
    ];
    
    // Carregar serviços na página
    function carregarServicos() {
        // Limpar container (exceto o template)
        while (servicosContainer.firstChild) {
            if (servicosContainer.firstChild.id !== 'servicoTemplate') {
                servicosContainer.removeChild(servicosContainer.firstChild);
            } else {
                break;
            }
        }
        
        // Adicionar cada serviço
        // biome-ignore lint/complexity/noForEach: <explanation>
                        servicos.forEach(servico => {
            const novoCard = servicoTemplate.cloneNode(true);
            novoCard.classList.remove('d-none');
            novoCard.setAttribute('data-id', servico.id);
            
            novoCard.querySelector('.badge').textContent = servico.categoriaTexto;
            novoCard.querySelector('.badge').className = `badge bg-${getBadgeColor(servico.categoria)}`;
            novoCard.querySelector('small.text-muted').textContent = servico.localizacao;
            novoCard.querySelector('.card-title').textContent = servico.titulo;
            // biome-ignore lint/style/useTemplate: <explanation>
            novoCard.querySelector('.card-text').textContent = servico.descricao.substring(0, 80) + '...';
            novoCard.querySelector('.text-primary').textContent = `R$ ${servico.preco}`;
            
            servicosContainer.appendChild(novoCard);
        });
        
        // Adicionar eventos aos cards
        // biome-ignore lint/complexity/noForEach: <explanation>
                        document.querySelectorAll('.servico-card').forEach(card => {
            // Clique simples - abrir modal com detalhes
            card.addEventListener('click', function(e) {
                // Evitar abrir modal se o clique foi em um botão dentro do card
                if (!e.target.classList.contains('btn-detalhes') && e.target.tagName !== 'BUTTON') {
                    // biome-ignore lint/style/useNumberNamespace: <explanation>
                    const servicoId = parseInt(this.closest('[data-id]').getAttribute('data-id'));
                    const servico = servicos.find(s => s.id === servicoId);
                    abrirModalDetalhes(servico);
                }
            });
            
            // Clique duplo - deletar (apenas para demonstração)
            card.addEventListener('dblclick', function() {
                this.classList.add('double-click');
                setTimeout(() => {
                    this.classList.remove('double-click');
                    if (confirm('Tem certeza que deseja remover este serviço?')) {
                        // biome-ignore lint/style/useNumberNamespace: <explanation>
                        const servicoId = parseInt(this.closest('[data-id]').getAttribute('data-id'));
                        servicos = servicos.filter(s => s.id !== servicoId);
                        servicosContainer.innerHTML = "";
                        carregarServicos();
                    }
                }, 500);
            });
        });
    }
    
    // Abrir modal com detalhes do serviço
    function abrirModalDetalhes(servico) {
        document.getElementById('servicoTitulo').textContent = servico.titulo;
        document.getElementById('servicoDescricao').textContent = servico.descricao;
        document.getElementById('servicoPrestador').textContent = servico.prestador;
        document.getElementById('servicoCategoria').textContent = servico.categoriaTexto;
        document.getElementById('servicoLocalizacao').textContent = servico.localizacao;
        document.getElementById('servicoPreco').textContent = `R$ ${servico.preco}`;
        document.getElementById('servicoDisponibilidade').textContent = servico.disponibilidade;
        
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
    
    // Adicionar novo serviço
    btnSalvarServico.addEventListener('click', () => {
        if (formNovoServico.checkValidity()) {
            const novoId = servicos.length > 0 ? Math.max(...servicos.map(s => s.id)) + 1 : 1;
            
            const novoServico = {
                id: novoId,
                titulo: document.getElementById('novoServicoTitulo').value,
                categoria: document.getElementById('novoServicoCategoria').value,
                categoriaTexto: document.getElementById('novoServicoCategoria').options[document.getElementById('novoServicoCategoria').selectedIndex].text,
                descricao: document.getElementById('novoServicoDescricao').value,
                localizacao: document.getElementById('novoServicoLocalizacao').value,
                preco: document.getElementById('novoPrestadorPreco').value,
                prestador: 'Você',
                disponibilidade: 'A combinar',
                contato: document.getElementById('novoServicoContato').value
            };
            
            servicos.unshift(novoServico);
            servicosContainer.innerHTML = "";
            carregarServicos();
            
            // Limpar formulário
            formNovoServico.reset();
            
            // Fechar modal
            bootstrap.Modal.getInstance(document.getElementById('modalNovoServico')).hide();
        } else {
            formNovoServico.reportValidity();
        }
    });
    
    // Inicializar
    carregarServicos();
});