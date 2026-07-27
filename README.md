# Fisioterapia e Pilates Cidade Jardim — Landing Page

Landing page estática da clínica **Fisioterapia e Pilates Cidade Jardim** (Jardim Paulistano, São Paulo).
Sem dependências, sem build — só HTML, CSS e JS puros. Pronta para hospedar no **GitHub Pages**.

## Estrutura

```
index.html            → página completa + sprite de ícones SVG (inline)
assets/css/styles.css → estilos e responsividade
assets/js/main.js     → módulos de interação
assets/img/           → favicon, logo
assets/img/fotos/     → onde entram as fotos (ver LEIA-ME.md de lá)
```

## Interações implementadas

Cada módulo do `main.js` é independente e sai sem erro se seus elementos
não existirem, então mexer no HTML nunca derruba o resto da página.

| Módulo | O que faz |
| --- | --- |
| `reveal` | entrada das seções ao rolar, com escalonamento |
| `progress` | barra de leitura no topo |
| `header` | sombra do cabeçalho ao descolar do topo |
| `topbar` | aviso de endereço dispensável (lembra na sessão) |
| `menu` | drawer lateral com backdrop, trava de rolagem, foco preso e Esc |
| `spy` | destaca a seção atual no menu com indicador deslizante |
| `counter` | contagem animada dos números |
| `parallax` | leve profundidade nos cartões do hero (só desktop) |
| `filter` | filtra serviços por categoria |
| `carousel` | depoimentos com autoplay, setas, pontos, arraste e teclado |
| `faq` | sanfona com uma resposta aberta por vez |
| `form` | monta a mensagem e abre o WhatsApp (nada sai do aparelho) |
| `copy` | copia o endereço com aviso de confirmação |
| `floating` | voltar ao topo e barra fixa do celular |

### Decisões de robustez

- **Sem JavaScript** a página continua legível: nada fica invisível, as
  respostas do FAQ abrem e os depoimentos empilham.
- **Reveal e contadores** têm varredura direta e rede de segurança por
  tempo, então nunca ficam em branco nem travados num número parcial.
- **`prefers-reduced-motion`** desliga animações, parallax e autoplay.
- **Ícones** são um sprite SVG inline: sem requisição extra, herdam a cor
  do contexto e ficam nítidos em qualquer tela.

## Rodando localmente

Qualquer servidor estático serve. Exemplo:

```bash
python3 -m http.server 4173
```

E abra http://localhost:4173

## Site publicado

**https://ericgierse.github.io/fisioterapia-cidade-jardim/**

Servido pelo GitHub Pages a partir da branch `main`, pasta raiz. Todo push na `main`
republica o site automaticamente.

## Informações já confirmadas (via Instagram)

- **Nome:** Fisioterapia e Pilates Cidade Jardim
- **Endereço (novo, desde 01/06/2026):** Av. Cidade Jardim, 427 – 2º andar, sala 21 — em cima do Restaurante Encontro Paulistano, Jardim Paulistano, São Paulo – SP
- **WhatsApp:** (11) 98805-8005 — [wa.me/5511988058005](https://wa.me/5511988058005)
- **Serviços:** Fisioterapia Ortopédica, Fisioterapia Pélvica, Pilates, RPG, Quiropraxia, Liberação Miofascial, Massagem, Drenagem Linfática, Atendimento Domiciliar
- **Passes aceitos:** Wellhub/Gympass (Gold+), ClassPass, Namu Pass
- **Instagram:** [@fisioterapiacidadejardim](https://www.instagram.com/fisioterapiacidadejardim/)

## Pendências (placeholders a substituir)

Procure por `TODO` no `index.html`. Falta preencher:

| Item | Onde está |
| --- | --- |
| Nomes, fotos, CREFITO e bio da equipe | seção `#equipe` |
| Números de suporte / telefone fixo / e-mail | seção `#localizacao` e rodapé |
| Horários de atendimento | seção `#localizacao` |
| Depoimentos reais (com autorização) | seção `#depoimentos` |
| Fotos reais da clínica e do estúdio | hero e seção `#pilates` |
| Razão social e CNPJ | rodapé |
| Convênios/planos de saúde além dos passes | seção `#parcerias` |
| Perguntas extras do FAQ (valores, pagamento, cancelamento) | seção `#faq` |
| Imagem Open Graph (`og:image`) | `<head>` |

Os textos entre colchetes (`[Nome do profissional]`, `[horário a confirmar]`)
são os pontos que aparecem na tela e precisam ser trocados.
