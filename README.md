# AppIfrete

## Descrição
Projeto desenvolvido como requisito para conclusão do curso de Análise e Desenvolvimentos de Sistemas. O trabalho foi desenvolvido em parceria com [Patrick Luiz](https://github.com/Patrick-Luiz-Silva) e orientação do [Alexandre Gomes](https://github.com/XandyGomes), e aprovado pela banca examinadora.<br>
A origem da ideia surgiu de um problema real enfrentado pelo pai e tio do Patrick que são caminhoneiros autonomos que relataram sua dificuldade para localizar serviços na cidade. A partir da identificação deste problema iniciamos o processo de construção desta aplicação mobile para motoristas de fretes.<br>
Deixamos disponível no diretório [documentacao](./documentacao) o arquivo docx da documentação final de todo o sistema para consulta.

## BPMN
![bpmn](https://drive.google.com/uc?id=1gOZCmEySltgr0MklfNMlGOwIMKwTCkis)

## Diagrama de Casos de Uso
![casosDeUso](https://drive.google.com/uc?id=1KKiF1oaSNK7y-Dp7JoclqrE35fJPrIU5)


## Funcionalidades
- **RF01 – Cadastro de motoristas:** Permitir que motoristas realizem seu registro no sistema, informando dados pessoais, contato e documentos necessários.

- **RF02 – Cadastro de cliente:** Permitir que clientes (pessoas físicas ou jurídicas) realizem o registro para solicitar serviços de frete.

- **RF03 – Publicação de frete:** O cliente poderá cadastrar uma nova solicitação de frete, informando detalhes como tipo de carga, origem e destino.

- **RF04 – Consultar frete:** Motoristas podem visualizar fretes disponíveis de acordo com seu perfil e localização.

- **RF05 – Alterar dados cadastrados:** Usuários (motoristas e clientes) poderão atualizar suas informações pessoais no sistema.

- **RF06 – Excluir conta:** Possibilidade de remover permanentemente a conta e seus dados associados.

- **RF07 – Canal de comunicação:** Integração com WhatsApp para facilitar a comunicação entre cliente e motorista.

- **RF08 – Validação de credenciais:** Autenticação de usuários por meio de login com e-mail/senha e validação de identidade.

- **RF09 – Geolocalização do motorista:** Permitir que clientes visualizem a localização aproximada do motorista em tempo real.

- **RF10 – Sistema de avaliação de motoristas:** Após a conclusão de um serviço, clientes poderão avaliar a experiência com o motorista.

- **RF11 – Consultar histórico de serviços:** Usuários podem visualizar a lista de fretes já realizados.

- **RF12 – Filtro de busca:** Filtros para facilitar a busca por status dos fretes [Todos, Aberto, Aceito, Em Andamento, Concluído, Cancelado].

- **RF13 – Notificações:** Envio de notificações em tempo real sobre novos fretes e atualizações de status.

- **RF14 – Confirmação de aceite:** Motorista deve confirmar a aceitação do frete antes da execução.

- **RF15 – Visualizar perfil do motorista:** Clientes podem acessar o perfil público do motorista, incluindo avaliações e documentos validados.

- **RF16 – Upload de documentos para motoristas:** Após motoristas realizarem o cadastro, no primeiro login é solicitado o envio de fotos da CNH frente, verso e uma selfie com o documento, para posterior validação.


## Tecnologias Utilizadas
- **NodeJS 22:** Plataforma base para o backend.
- **Framework Express:** Framework web para criação da API REST. 
- **MongoDB, MongoDB Compass e Lib Mongoose:** Banco de dados noSQL, cliente para visualização de dados do mongodb e ODM para manipulação de dados.
- **multer:** Biblioteca para upload de arquivos.
- **joi:** Biblioteca para validação de dados dos modelos criados.
- **bcrypt e jsonwebtoken:** Bibliotecas de segurança para autenticação e autorização de operações http.
- **socket.io:** Biblioteca para configuração de websocket para envio de notificações em tempo real.
- **Insomnia:** Serviço de testes de consumo de API backend.
- **React Native:** Framework para construção do frontend do aplicativo mobile.
- **ExpoGo:** Compilador e emulador de dispositivos mobile em tempo de execução.


## Como Usar
`Observação:` O sistema foi configurado com o ExpoGo uma ferramenta que auxilia testes de aplicativos mobile em ambientes de desenvolvimento. Os testes foram realizados apenas em dispositivos Android, então pode apresentar erros não validados na plataforma iOS. Além disso a versão do expo usada no projeto é a 53.0.7, a versão do ExpoGo instalada no seu dispositivo precisa ser compativel. 
1. Na raiz deste repositório tem o arquivo `ConfigAmbiente.txt` com as orientações necessárias para configurar o ambiente e iniciar o projeto.

