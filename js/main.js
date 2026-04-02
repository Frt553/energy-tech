/**
 * ENERGY TECH TECNOLOGIA - JavaScript Principal
 * Versão 2.0 - SEO Nacional e Alta Conversão
 * Funcionalidades: Menu mobile, scroll suave, header fixo, formulários, animações
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // MENU MOBILE
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('ativo');
            navMobile.classList.toggle('ativo');
            document.body.classList.toggle('menu-aberto');
        });
        
        // Fechar menu ao clicar em link
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('ativo');
                navMobile.classList.remove('ativo');
                document.body.classList.remove('menu-aberto');
            });
        });
    }
    
    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar estado inicial
    
    // ========================================
    // SCROLL SUAVE
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // ANIMAÇÃO AO SCROLL
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.servico-card, .diferencial-item, .valor-card, .blog-card, .problema-item, .numero-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // ========================================
    // MÁSCARA DE TELEFONE
    // ========================================
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }
            
            if (valor.length > 0) {
                if (valor.length <= 10) {
                    // Telefone fixo: (XX) XXXX-XXXX
                    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
                    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    // Celular: (XX) XXXXX-XXXX
                    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
                    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
                }
            }
            
            e.target.value = valor;
        });
    });
    
    // ========================================
    // VALIDAÇÃO DE FORMULÁRIOS
    // ========================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let valido = true;
            const camposObrigatorios = form.querySelectorAll('[required]');
            
            camposObrigatorios.forEach(campo => {
                if (!campo.value.trim()) {
                    valido = false;
                    campo.classList.add('erro');
                } else {
                    campo.classList.remove('erro');
                }
            });
            
            // Validar email
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    valido = false;
                    emailInput.classList.add('erro');
                }
            }
            
            if (valido) {
                // Simular envio
                const btnSubmit = form.querySelector('button[type="submit"]');
                const textoOriginal = btnSubmit ? btnSubmit.textContent : 'Enviar';
                
                if (btnSubmit) {
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'Enviando...';
                }
                
                setTimeout(() => {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    form.reset();
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.textContent = textoOriginal;
                    }
                }, 1500);
            } else {
                alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            }
        });
    });
    
    // ========================================
    // CONTADOR ANIMADO (STATS)
    // ========================================
    function animarContador(elemento, valorFinal, duracao = 2000) {
        let inicio = 0;
        const incremento = valorFinal / (duracao / 16);
        
        function atualizar() {
            inicio += incremento;
            if (inicio < valorFinal) {
                elemento.textContent = Math.floor(inicio);
                requestAnimationFrame(atualizar);
            } else {
                elemento.textContent = valorFinal;
            }
        }
        
        atualizar();
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numero = entry.target;
                const valor = parseInt(numero.dataset.valor);
                if (valor) {
                    animarContador(numero, valor);
                }
                statsObserver.unobserve(numero);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.hero-stat-numero[data-valor]').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ========================================
    // SLIDER DE DEPOIMENTOS (SIMPLES)
    // ========================================
    const depoimentos = document.querySelectorAll('.depoimento-card');
    let depoimentoAtual = 0;
    
    if (depoimentos.length > 1) {
        // Esconder todos exceto o primeiro
        depoimentos.forEach((dep, index) => {
            if (index !== 0) {
                dep.style.display = 'none';
            }
        });
        
        // Trocar a cada 5 segundos
        setInterval(() => {
            depoimentos[depoimentoAtual].style.display = 'none';
            depoimentoAtual = (depoimentoAtual + 1) % depoimentos.length;
            depoimentos[depoimentoAtual].style.display = 'block';
            depoimentos[depoimentoAtual].classList.add('fade-in');
        }, 5000);
    }
    
    // ========================================
    // LAZY LOADING DE IMAGENS
    // ========================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========================================
    // COOKIES BANNER (LGPD)
    // ========================================
    function criarCookieBanner() {
        if (localStorage.getItem('cookiesAceitos')) return;
        
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-conteudo">
                <p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="politica-privacidade.html">Política de Privacidade</a>.</p>
                <button class="btn btn-primario btn-cookie">Aceitar</button>
            </div>
        `;
        
        // Estilos inline para o banner
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--cor-preto-claro);
            border-top: 1px solid var(--cor-cinza-escuro);
            padding: 1rem;
            z-index: 10000;
        `;
        
        const cookieConteudo = banner.querySelector('.cookie-conteudo');
        cookieConteudo.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        `;
        
        document.body.appendChild(banner);
        
        banner.querySelector('.btn-cookie').addEventListener('click', () => {
            localStorage.setItem('cookiesAceitos', 'true');
            banner.remove();
        });
    }
    
    // Ativar banner de cookies após 3 segundos
    setTimeout(criarCookieBanner, 3000);
    
});

// ========================================
// FUNÇÕES GLOBAIS
// ========================================

/**
 * Abre modal
 */
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Fecha modal
 */
function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Formata preço para Real brasileiro
 */
function formatarPreco(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/**
 * Debounce para otimizar eventos de scroll/resize
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Rastreamento de cliques no WhatsApp (Google Analytics)
 */
function rastrearWhatsApp(origem) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click_whatsapp', {
            'event_category': 'engagement',
            'event_label': origem
        });
    }
}

// Adicionar rastreamento aos botões de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappBotoes = document.querySelectorAll('a[href*="wa.me"]');
    whatsappBotoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const origem = this.closest('section')?.className || 'header';
            rastrearWhatsApp(origem);
        });
    });
});
