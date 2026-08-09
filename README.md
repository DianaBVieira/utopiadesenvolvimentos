# Utopia Desenvolvimentos

Site institucional da Utopia Desenvolvimentos, com páginas de apresentação dos serviços e projetos publicados. O repositório contém arquivos estáticos em HTML, imagens e estilos gerados com Tailwind CSS.

## Memorial Eterno

O Memorial Eterno é uma homenagem digital personalizada, acessada por QR Code em uma placa física de ACM. A página comercial apresenta dois planos:

| Plano | Valor | Fotografias | Itens principais |
| --- | ---: | ---: | --- |
| Memorial Essencial | R$ 599,00 | Até 12 | Site personalizado, texto de homenagem, placa com QR Code e envio incluído |
| Memorial Legado | R$ 999,00 | Até 50 | Site personalizado, texto de homenagem, placa com QR Code e envio incluído |

Os valores são cobrados uma única vez. Não há mensalidade enquanto o memorial permanecer hospedado nas plataformas gratuitas utilizadas, conforme a condição apresentada na página.

### Complemento: Lembrança para o Lar

O **Azulejo Memorial 20 × 20 cm com suporte de mesa** é oferecido como complemento de um plano Memorial Eterno por **R$ 89,90**. A peça inclui foto personalizada e o QR Code de acesso ao memorial.

A página possui uma seção própria com a arte real do produto, características, preço e um botão `Escolher plano e adicionar`. Ao usar esse caminho, o complemento fica pré-selecionado no checkout. Ele também pode ser marcado ou desmarcado diretamente no formulário, que atualiza o total antes de seguir ao Mercado Pago.

As funções implantadas foram recuperadas e atualizadas diretamente no Firebase, mas seu código interno permanece fora deste repositório público. A função `createCheckoutPreference` recebe apenas a escolha booleana do complemento e aplica no servidor o preço fixo de R$ 89,90, acrescentando o azulejo como um segundo item da preferência. O frete adicional permanece em R$ 0,00. O pedido pendente registra os itens e o valor total.

O webhook preserva a validação de assinatura existente e agora também compara o valor aprovado com o total calculado pelo servidor. Após a aprovação, a informação `adicionarAzulejo` e os itens comprados são gravados no CRM do memorial.

**Motivo:** cobrar o plano e o azulejo juntos sem confiar em preços enviados pelo navegador, mantendo rastreabilidade no pedido e evitando que um pagamento de valor divergente seja processado automaticamente.

O arquivo visual utilizado na seção é `assets/memorial-lar-20x20.png`.

## Revisão do fluxo de compra

O fluxo público do Memorial Eterno passou por uma auditoria em modo somente leitura antes das alterações. Foram inspecionados:

- entrada pelo site institucional e acesso à página do produto;
- planos, preços e botões de compra;
- abertura do formulário anterior ao pagamento;
- campos obrigatórios e validações disponíveis no navegador;
- uso de HTTPS e redirecionamento de HTTP para HTTPS;
- mensagens do console durante a navegação;
- código público do frontend e possíveis credenciais expostas;
- integração aparente com o Mercado Pago;
- política de privacidade e páginas públicas de pagamento aprovado, pendente e não concluído.

Nenhum formulário foi enviado e nenhuma preferência de pagamento foi criada durante a auditoria ou durante os testes locais.

## Alterações realizadas no checkout

### 1. Envio incluído no valor

Os dois planos agora informam de forma direta que o envio da placa está incluído no valor apresentado. O mesmo texto foi aplicado ao resumo da compra, à confirmação do formulário e à mensagem preparada para atendimento pelo WhatsApp.

**Motivo:** evitar que o cliente espere uma cobrança adicional de frete e manter a oferta consistente em todos os pontos do fluxo. A operação logística utilizada para enviar a placa não é exposta ao cliente, pois não altera o produto ou o valor contratado.

### 2. Resumo antes do pagamento

Ao clicar em `Comprar agora`, o modal exibe:

- nome do plano selecionado;
- preço total;
- limite de fotografias;
- pagamento único e sem mensalidade;
- site memorial, placa com QR Code e envio ao endereço informado.

**Motivo:** permitir que o cliente confira o que está comprando antes de preencher dados pessoais e ser redirecionado ao gateway de pagamento.

### 3. Confirmação do cliente

Foi incluída uma caixa obrigatória na qual o cliente confirma que revisou o plano, o valor total e o endereço de entrega, além de reconhecer que o envio está incluído.

**Motivo:** reduzir erros de seleção e de entrega e criar uma última etapa clara de conferência antes do pagamento.

### 4. Proteção contra dados pessoais na URL

O formulário passou a declarar explicitamente `method="post"`.

**Motivo:** antes da alteração, o formulário usava o método GET por padrão. Caso o JavaScript falhasse, nomes, contato e endereço poderiam aparecer na URL e no histórico do navegador. O JavaScript continua interceptando o envio normal e encaminhando os dados ao serviço de checkout.

### 5. Validações dos campos

Foram adicionadas ou reforçadas as seguintes regras:

- nomes obrigatórios, com tamanho mínimo e máximo;
- e-mail obrigatório, com tipo e limite apropriados;
- WhatsApp com DDD, limite de caracteres e conferência de 10 ou 11 dígitos;
- CEP com oito dígitos e formatação automática;
- UF com duas letras e conversão automática para maiúsculas;
- limites para rua, número, complemento, bairro e cidade;
- atributos de preenchimento automático para dados de contato e endereço;
- teclado adequado em campos numéricos em dispositivos móveis.

Antes de enviar, o WhatsApp e o CEP são normalizados para conter somente dígitos, e a UF é enviada em letras maiúsculas.

**Motivo:** diminuir pedidos com telefone, CEP ou endereço inválidos e facilitar o preenchimento em computadores e celulares.

> O backend deve continuar validando todos os dados recebidos. Validações no navegador melhoram a experiência, mas não substituem regras no servidor.

### 6. Acessibilidade dos modais

O modal de checkout e o modal de informações da placa agora possuem semântica de diálogo. No checkout também foram implementados:

- `role="dialog"` e `aria-modal="true"`;
- associação do título e da descrição ao diálogo;
- foco levado ao modal quando ele abre;
- contenção da navegação por `Tab` dentro do modal;
- fechamento pela tecla `Esc`;
- devolução do foco ao botão que abriu o modal;
- área de erro anunciada por tecnologias assistivas;
- indicação de processamento no botão de pagamento.

**Motivo:** permitir que pessoas que usam teclado ou leitor de tela compreendam e operem o checkout com mais segurança.

### 7. Validação do redirecionamento

Antes de redirecionar o navegador, o frontend confirma que a URL retornada:

- usa HTTPS; e
- pertence ao domínio `mercadopago.com.br` ou a um subdomínio válido.

**Motivo:** impedir que uma resposta inesperada ou manipulada envie o cliente para um domínio diferente do gateway informado.

### 8. CSS recompilado

O arquivo `css/tailwind.css` foi recompilado após a inclusão das novas classes usadas no modal e no resumo da compra.

**Motivo:** este é um site estático e as classes utilizadas no HTML precisam estar presentes no CSS gerado que é publicado.

## O que foi validado após as alterações

- compilação do Tailwind CSS concluída;
- verificação de diferenças do Git sem erros de espaços ou formatação;
- carregamento local da página do Memorial Eterno;
- apresentação correta dos planos Essencial e Legado;
- correspondência entre plano, preço e quantidade de fotografias no modal;
- pré-seleção do azulejo ao usar o botão `Escolher plano e adicionar`;
- atualização imediata do total ao marcar ou desmarcar o complemento;
- total de R$ 688,90 para Memorial Essencial com azulejo;
- total de R$ 1.088,90 para Memorial Legado com azulejo;
- retorno ao preço original do plano quando o complemento é desmarcado;
- exibição do envio como incluído no valor;
- exibição de frete adicional de R$ 0,00 para o azulejo;
- bloqueio do formulário vazio antes de qualquer chamada externa;
- foco levado ao primeiro campo obrigatório após tentativa de envio vazio;
- fechamento do modal com `Esc` e retorno do foco ao botão de compra;
- ausência de erros e avisos no console durante os testes;
- ausência de rolagem horizontal no checkout;
- compilação e validação sintática da função atualizada;
- publicação das funções `createCheckoutPreference` e `mercadoPagoWebhook` no Firebase;
- estado `ACTIVE` confirmado para as duas funções após a publicação;
- resposta CORS `204` para o domínio oficial;
- rejeição `400` para uma solicitação vazia, sem criação de pedido ou preferência.

> **Teste seguro confirmado:** uma solicitação vazia enviada à função retornou HTTP `400`. A validação foi encerrada antes da gravação no banco e antes da criação de qualquer pedido ou preferência de pagamento no Mercado Pago.

## Proteções da integração do azulejo

- O navegador envia somente `adicionarAzulejo: true` ou `false`.
- O preço de R$ 89,90 é definido exclusivamente no servidor.
- O azulejo é enviado ao Mercado Pago como um item separado do plano.
- O pedido pendente registra plano, complemento, itens e total esperado.
- O webhook continua validando a assinatura enviada pelo Mercado Pago.
- O webhook compara o valor aprovado com o total calculado pelo servidor antes de criar o memorial e o registro no CRM.
- Pagamentos com valor divergente recebem o estado `valor_divergente` e não são promovidos automaticamente.
- As chaves do Mercado Pago continuam armazenadas como segredos do Firebase e não foram incluídas no HTML, no JavaScript público ou no GitHub.
- O código interno das funções foi mantido fora deste repositório porque ele é público.

### Aviso para futuras publicações das funções

A cópia local atualizada e combinada está em `site-repo/functions/index.js`. Ela contém, no mesmo arquivo, a cobrança do Azulejo Memorial, a validação contra valor divergente, o registro dos itens no CRM e a notificação `payment_paid` para o painel central.

O Claude ou qualquer outra sessão de desenvolvimento **não deve publicar novamente uma cópia antiga das funções**. Antes de executar um deploy, deve usar `site-repo/functions/index.js` como fonte atual, validar sua sintaxe e confirmar a presença de `HOME_MEMORIAL`, `valor_divergente`, `INGEST_SHARED_SECRET` e `notifyCentralPanel`. Esse arquivo permanece ignorado pelo Git e fora do repositório público para não expor a implementação interna do pagamento.

## Limites da validação

Para manter os testes sem efeitos financeiros e sem gerar pedidos fictícios, não foram executados:

- criação real de preferência no Mercado Pago;
- pagamento com Pix, cartão ou boleto;
- confirmação de parcelamento e meios habilitados;
- retorno real de pagamento aprovado, pendente ou recusado;
- recebimento de um webhook real do Mercado Pago;
- gravação de um pedido real no banco de dados;
- criação real do memorial e do registro no CRM após pagamento.

As regras de preço, assinatura, idempotência e gravação foram inspecionadas no código implantado. A confirmação completa do ciclo deve ser feita posteriormente com uma compra controlada de baixo risco ou com credenciais de teste do Mercado Pago.

## Estrutura relevante

- `index.html`: página institucional.
- `memorial-eterno.html`: oferta, planos, formulário e integração pública do checkout.
- `pagamento-sucesso.html`: orientação exibida após retorno de pagamento aprovado.
- `pagamento-pendente.html`: orientação para pagamentos ainda em processamento.
- `pagamento-erro.html`: orientação para pagamento recusado ou cancelado.
- `privacidade.html`: política de privacidade.
- `projetos/memorial-eterno/`: demonstração do memorial publicado.
- `src/tailwind-input.css`: origem dos estilos do Tailwind.
- `css/tailwind.css`: CSS compilado usado pelo site.

## Desenvolvimento local

Instale as dependências declaradas no projeto e gere o CSS:

```bash
npm install
npm run build:css
```

Depois, sirva os arquivos por um servidor HTTP local. Abrir os arquivos diretamente pelo protocolo `file://` pode apresentar comportamento diferente do site publicado.

Para testar o checkout localmente, use `http://127.0.0.1:4173` ou `http://localhost:4173`. Essas origens estão autorizadas no CORS da função. O protocolo `file://` envia origem `null` e é recusado intencionalmente; a página agora mostra uma orientação clara em vez de tentar iniciar o pagamento nesse modo.

O atributo `pattern` do campo de WhatsApp foi removido porque versões atuais do Chrome passaram a interpretar padrões HTML com regras mais restritas. A validação permanece no JavaScript, que aceita somente 10 ou 11 dígitos após remover espaços e sinais de formatação.

## Publicação

O domínio público configurado no repositório é `www.utopiadesenvolvimentos.com.br`, conforme o arquivo `CNAME`. Antes de publicar mudanças relacionadas ao checkout:

1. confira visualmente os dois planos;
2. gere novamente o CSS;
3. teste as validações sem concluir uma compra;
4. confirme que nenhuma chave secreta foi incluída no frontend;
5. valide o backend e os retornos do Mercado Pago em ambiente apropriado.
