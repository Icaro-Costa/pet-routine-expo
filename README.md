# Pet Routine

Aplicativo de rotina pet em Expo e TypeScript, com identidade cyberpunk, autenticação e integração com a API fornecida pela disciplina Desenvolvimento Mobile — CESAR School.

## Executar

Use Node 22.13 ou superior (o backend usa `node:sqlite`). Na raiz:

```sh
npm ci --legacy-peer-deps
```

Configure `.env` a partir de `.env.example`, com `EXPO_PUBLIC_API_URL` apontando para a API. Use `http://localhost:3000` no simulador iOS, `http://10.0.2.2:3000` no emulador Android ou o IP local do computador no aparelho físico. Aparelho e computador devem estar na mesma rede.

Em um terminal:

```sh
cd backend
npm ci
npm run dev
```

Em outro, na raiz:

```sh
npm start
```

Conta de demonstração: `tutor@cesar.school` / `123456`, com 20 pets. Novas contas começam sem pets. Os controles de `@expo/ui` e a validação completa dos recursos nativos precisam de uma build compatível; o bundle JavaScript sozinho não comprova o funcionamento em aparelho.

## Funcionalidades

- Login, cadastro, sessão persistida e logout.
- Lista agrupada por status, busca por nome e cadastro de pets.
- Detalhes, alteração do status, exclusão e foto com câmera/galeria.
- Registro de passeio com localização e imagem opcionais.
- Cronômetro com limpeza do intervalo e histórico local em SQLite.
- Notificação de teste em cinco segundos, com navegação para o pet ao tocar.
- Perfil, estatísticas, tema claro/escuro persistido e controles nativos de preferências.
- Consulta de OTA com bloqueio explícito em desenvolvimento.

## Arquitetura

`src/app/` contém as rotas do Expo Router. Componentes ficam em `src/components/`, as stores Zustand em `src/store/`, o contexto de tema em `src/context/` e a integração HTTP, SQLite e notificações em `src/services/`. A API Express/SQLite/JWT permanece em `backend/`.

A URL da API é configurável. O cliente adiciona o token Bearer e encerra sessões rejeitadas com 401/403. Datas recebidas pela API são strings ISO. O histórico de duração pertence ao dispositivo; os pets pertencem à conta no servidor. A API armazena a URI da foto, não faz upload do arquivo: fotos locais não são portáveis entre aparelhos e podem desaparecer se o cache for apagado.

## Reformulação de UI/UX

A interface utiliza fundos azul-escuros, acentos ciano e magenta, bordas iluminadas e cartões com hierarquia clara. O tema claro usa tons mais escuros nos acentos para manter o contraste. Status têm rótulo textual além de cor. Busca, cadastro, carregamento, estados vazios e erros oferecem feedback, e ações usam `onPress` com estado `pressed`.

O sistema visual usa tokens em `src/theme.ts`, componentes locais, NativeWind 4 e primitivas headless GlueStack. `GluestackUIProvider` fornece os contextos de overlay e toast; os botões compartilhados são construídos com `createButton`. O layout respeita a Safe Area.

Antes, o aplicativo tinha uma tela em `App.tsx`, dados mockados e troca condicional para registrar passeios. Agora usa rotas, sessão, API e telas de autenticação, lista, detalhes e perfil.

**Evidência visual pendente:** capturar as telas da versão inicial (commit `32ced9d`) e da versão atual em aparelho/emulador e anexar aqui o comparativo antes/depois. Nenhuma captura simulada é apresentada como teste real.

## Build e OTA

`eas.json` define development, preview (APK Android/simulador iOS) e production. A URL de preview está configurada para o emulador Android; ajuste para um servidor acessível ao dispositivo antes de construir. Para distribuição real, configure uma API HTTPS e vincule o projeto à sua conta EAS. O identificador EAS e a URL de atualização precisam ser configurados na conta do responsável; não foram inventados neste repositório.

## Validação e entrega

```sh
npm run typecheck
cd backend
npm run typecheck
```

Na raiz, `npx expo export --platform android` valida o empacotamento Android. Teste em aparelho: login/cadastro/logout, CRUD, permissões de câmera/galeria/GPS, cronômetro, histórico e toque na notificação. OTA exige uma build vinculada a EAS Update. A entrega ainda requer os nomes da equipe em `sobre.tsx`, capturas reais e revisão/assinatura do [relatório de uso de IA](docs/relatorio-uso-ia.md).
