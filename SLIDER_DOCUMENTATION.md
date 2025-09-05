# Documentação do Slider de Imagens - Instituto Life

## Visão Geral
Foi implementado um sistema de slider de imagens para os cards dos projetos de Futebol e Judô no site do Instituto Life. O slider permite navegar entre múltiplas fotos de cada projeto de forma interativa e responsiva.

## Funcionalidades Implementadas

### 1. Estrutura HTML
- **Slider Container**: Cada card de projeto agora possui um container `.image-slider` com ID único
- **Imagens**: Todas as imagens das pastas `Fotos-Futebol` e `Fotos-Judo` foram integradas
- **Controles**: Botões de navegação (anterior/próximo) e indicadores de posição (dots)
- **Acessibilidade**: Suporte a navegação por teclado e atributos ARIA

### 2. Estilos CSS
- **Design Responsivo**: Adaptado para desktop, tablet e mobile
- **Transições Suaves**: Animações de fade entre imagens
- **Controles Interativos**: Botões e dots com hover effects
- **Tema Consistente**: Cores e estilos alinhados com a identidade visual do Instituto Life

### 3. Funcionalidades JavaScript
- **Navegação Manual**: Botões anterior/próximo e dots
- **Autoplay**: Troca automática de imagens a cada 5 segundos
- **Touch/Swipe**: Suporte completo para dispositivos móveis
- **Teclado**: Navegação com setas esquerda/direita
- **Pause no Hover**: Autoplay pausa quando o mouse está sobre o slider
- **Loop Infinito**: Navegação contínua sem fim

## Estrutura dos Arquivos

### HTML (index.html)
```html
<div class="image-slider" id="futebol-slider">
    <div class="slider-container">
        <img src="images/futebol.jpg" class="slider-image active">
        <img src="images/Fotos-Futebol/IMG-20250905-WA0308.jpg" class="slider-image">
        <!-- Mais imagens... -->
    </div>
    <div class="slider-controls">
        <button class="slider-btn prev" onclick="changeSlide('futebol-slider', -1)">❮</button>
        <button class="slider-btn next" onclick="changeSlide('futebol-slider', 1)">❯</button>
    </div>
    <div class="slider-dots">
        <span class="dot active" onclick="currentSlide('futebol-slider', 1)"></span>
        <!-- Mais dots... -->
    </div>
</div>
```

### CSS (css/style.css)
- Estilos para `.image-slider`, `.slider-container`, `.slider-image`
- Controles `.slider-btn` e `.slider-dots`
- Media queries para responsividade
- Animações e transições

### JavaScript (js/script.js)
- Objeto `SliderManager` para gerenciar todos os sliders
- Funções `changeSlide()` e `currentSlide()` para compatibilidade
- Suporte a touch events e navegação por teclado
- Sistema de autoplay configurável

## Imagens Incluídas

### Futebol (8 imagens)
- `images/futebol.jpg` (imagem principal)
- `images/Fotos-Futebol/IMG-20250905-WA0308.jpg`
- `images/Fotos-Futebol/IMG-20250905-WA0309.jpg`
- `images/Fotos-Futebol/IMG-20250905-WA0310.jpg`
- `images/Fotos-Futebol/IMG-20250905-WA0318.jpg`
- `images/Fotos-Futebol/IMG-20250905-WA0319.jpg`
- `images/Fotos-Futebol/IMG-20250905-WA0320.jpg`
- `images/Fotos-Futebol/WhatsApp Image 2025-09-05 at 14.27.17_c1e09c6f.jpg`

### Judô (10 imagens)
- `images/judo.jpg` (imagem principal)
- `images/Fotos-Judo/IMG-20250905-WA0136.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0307.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0311.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0312.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0313.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0314.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0315.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0316.jpg`
- `images/Fotos-Judo/IMG-20250905-WA0317.jpg`

## Como Usar

### Navegação Manual
- **Botões**: Clique nas setas ❮ e ❯ para navegar
- **Dots**: Clique nos pontos na parte inferior para ir diretamente a uma imagem
- **Teclado**: Use as setas esquerda/direita do teclado
- **Touch**: Deslize para esquerda/direita em dispositivos móveis

### Autoplay
- As imagens mudam automaticamente a cada 5 segundos
- Pausa quando o mouse está sobre o slider
- Retoma quando o mouse sai do slider

## Personalização

### Alterar Velocidade do Autoplay
No arquivo `js/script.js`, modifique a propriedade `autoPlayDelay`:
```javascript
autoPlayDelay: 5000 // 5 segundos (em milissegundos)
```

### Adicionar Mais Imagens
1. Adicione as imagens na pasta correspondente
2. Inclua uma tag `<img>` no HTML com a classe `slider-image`
3. Adicione um `<span class="dot">` correspondente

### Desabilitar Autoplay
Comente ou remova a linha que inicia o autoplay:
```javascript
// this.startAutoPlay(sliderId);
```

## Compatibilidade
- ✅ Chrome, Firefox, Safari, Edge (versões modernas)
- ✅ Dispositivos móveis (iOS, Android)
- ✅ Tablets
- ✅ Navegação por teclado
- ✅ Leitores de tela (acessibilidade)

## Performance
- Otimizado para carregamento rápido
- Lazy loading das imagens
- Debounce nos eventos de touch
- RequestAnimationFrame para animações suaves

## Manutenção
- Para adicionar novos sliders, siga o mesmo padrão HTML
- O JavaScript detecta automaticamente novos sliders
- CSS é responsivo e se adapta a diferentes tamanhos de tela
