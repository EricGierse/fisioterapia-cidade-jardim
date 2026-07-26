# Fisioterapia e Pilates Cidade Jardim — Landing Page

Landing page estática da clínica **Fisioterapia e Pilates Cidade Jardim** (Jardim Paulistano, São Paulo).
Sem dependências, sem build — só HTML, CSS e JS puros. Pronta para hospedar no **GitHub Pages**.

## Estrutura

```
index.html            → página completa (única página)
assets/css/styles.css → estilos
assets/js/main.js     → menu mobile, animações, ano do rodapé
assets/img/           → logo (lotus.svg), favicon
```

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
| URL final do site no JSON-LD | `<head>` |
