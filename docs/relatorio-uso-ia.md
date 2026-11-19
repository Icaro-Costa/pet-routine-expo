# Registro de uso de inteligência artificial

Projeto: Pet Routine — Desenvolvimento Mobile, CESAR School.

Data de implementação: 18/11/2026.

Este documento é um registro técnico preliminar. O estudante deve preencher sua identificação, conferir a ferramenta/modelo com o catálogo da instituição e revisar a declaração antes de entregar. Ele não constitui assinatura nem declaração de revisão pessoal do estudante.

## Uso nesta implementação

Foi utilizado o assistente Codex para inspecionar o repositório e o enunciado, implementar código, ajustar a interface cyberpunk e executar verificações. A versão exata do modelo deve ser conferida no histórico da sessão. Não foi verificado o enquadramento da ferramenta no catálogo institucional.

| Etapa | Apoio utilizado | Aproveitamento e verificação |
| --- | --- | --- |
| 1 — Rotas e fotos | Migração para Expo Router e captura/galeria | Rotas e tratamento de cancelamento; revisão dos estados de erro |
| 2 — Navegação e notificações | Abas, detalhe e lembrete local | Listeners com cleanup e notificação em cinco segundos; teste em aparelho pendente |
| 3 — Estado e persistência | Tema, Zustand, cronômetro e SQLite | Tipagem e cleanup revisados; persistência nativa precisa de teste em aparelho |
| 4 — Backend e sessão | Cliente HTTP, autenticação e CRUD | Contrato comparado com o backend e TypeScript verificado |
| 5 — UI e build | Estilo cyberpunk, controles nativos e configurações | Interface e configurações implementadas; build de distribuição e OTA dependem da conta EAS |
| Reformulação visual | Tokens, cartões, botões e estados de tela | Temas claro/escuro; capturas reais antes/depois pendentes |

## Curadoria técnica observada

1. O código inicialmente gerado usou `StyleSheet.absoluteFillObject`. O TypeScript da versão instalada de React Native rejeitou essa propriedade e indicou `absoluteFill`; a implementação foi corrigida em `src/components/cyber-ui.tsx`.
2. A primeira versão do botão compartilhado envolvia qualquer conteúdo em `Text`, incluindo uma composição com `View`. A revisão identificou o problema de composição e separou conteúdo textual de conteúdo composto.
3. A primeira versão da tela de foto apresentava erros de rede ao salvar como “galeria bloqueada”. A revisão separou erros operacionais dos estados de permissão, corrigindo a orientação ao usuário.

Esses casos descrevem ocorrências desta implementação. Não se atribuem ao assistente exemplos hipotéticos de APIs depreciadas que não apareceram no código gerado.

## Declaração a revisar pelo estudante

Identificação dos integrantes: a preencher pelo grupo.

Ferramenta/modelo conforme o catálogo institucional: a conferir pelo grupo.

Após revisar o código e os testes, o estudante deve redigir/confirmar a declaração narrativa exigida pelo enunciado, incluindo finalidade, curadoria e responsabilidade pela entrega. A confirmação sobre dados pessoais e compreensão integral do código deve ser feita pelo próprio estudante; o assistente não a atesta em seu nome.

- [ ] Conferi a ferramenta e sua versão no catálogo institucional.
- [ ] Revisei o uso de dados nos prompts e completei a declaração de proteção de dados.
- [ ] Revisei o código, executei os testes em aparelho e compreendo os arquivos entregues.
- [ ] Preenchi a identificação e assinei a declaração final.
