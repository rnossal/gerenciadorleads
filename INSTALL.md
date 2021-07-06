# Requerimentos
- Servidor Linux (Testado com Ubuntu 20.04 LTS)
- NodeJS
- Docker (Opcional para o servidor de banco)
- Docker Compose (Opcional para o servidor de banco)

# Preparação do ambiente

*Todos comandos estão levando em consideração que o usuário esteja em um diretório com as pastas de **web**, **api**, **ambient** e **compiler** dentro.*

### Execução do ambiente de imagens
A pasta ***ambient*** contém os arquivos necessários para instanciar as imagens de API do compilador e banco via Docker Compose. Configurações como usuário (DB_USER), senha (DB_PASSWORD) e onde os arquivos do banco são salvos (DB_LOCATION) podem ser ajustados no arquivo ***.env***.

> Comando para iniciar o ambiente das imagens do container
```
docker-compose -f ambient/docker-compose.yml --env-file ambient/.env up -d
```

# Preparação da API base

A API base se encontra na pasta ***api*** e é responsável por basicamente todo o backend do projeto.

A configuração da API de encontra no arquivo ***api/.env***, onde é possível realizar as configurações de string de conexão do banco, portas HTTP e HTTPS, SSL, entre outras.

## Instalação de dependências

Para instalar as dependências da API é necessário somente executar o comando ```npm --prefix ./api/ install ./api/``` dentro da pasta e com isso a API já está pronta para o setup inicial e execução.

A API por padrão não dispôe de um serviço que a mantenha rodando, sendo assim necessário algum sistema de gerenciador de processos. Um exemplo de gerenciador de processos que pode ser usado é o PM2, que pode ser instalado com o comando ```npm install -g pm2```.

## Setup e inicialização da API

O ambiente inicial precisa ser configurado pelo menos com um usuário padrão para que posteriormente seja possível acessar o a interface do gerenciador. Para isso é possível executar o arquivo ***api/setup.js*** que será responsável por criar esse usuário padrão. A senha padrão pode ser vista em ***api/.env*** na variável ***ADMIN_PASSWORD***.

### Setup do usuário padrão

A execução do setup se dá pela execução do comando ```npm --prefix ./api/ run setup``` que ao final exebirá a mensagem de que o usuário foi criado com sucesso ou não.

### Execução da API

A execução da API pode ser feita pelo comando ```npm --prefix ./api/ run serve```, mas nesse caso o servidor estará executando enquanto o console estiver aberto. Esse caso é mais indicado para testes rápido, sendo recomendado a execução a partir de um gerenciador de processos.

#### Método de execução com PM2

Considerando o PM2 (```npm install -g pm2```) instalado e como o gerenciador de processos para a execução permanente da API, estarão disponíveis os seguintes comandos para a gerência do processo da API:

> Colocar o serviço do PM2 para iniciar junto com o sistema operacional (serviço no systemd)
```
pm2 startup
```

> Instalar e executar a API no PM2
```
cd api
pm2 start main.js --name="Gerenciador de Leads" --watch
cd ..
```

> Salvar a inicialização no serviço do PM2 (necessário se for iniciar a api juntamente com o sistema opecarional)
```
pm2 save
```

> Parar a API
```
pm2 stop "Gerenciador de Leads"
```

> Deletar a API
```
pm2 delete "Gerenciador de Leads"
```

> Iniciar a API
```
cd api
pm2 start "Gerenciador de Leads" --watch
cd ..
```

> Verifiar logs da API
```
pm2 logs
```

# Preparação do frontend

O frontend é compilado usando Webpack e pode ser publicado de forma estática em qualquer servidor HTTP. Por conveniência os arquivos do frontend pode ser publicado usando o mesmo servidor HTTP que é levantadado pelo serviço da API, bastando que os arquivos compilados sejam colocados em ***api/public*** (se a pasta public não estiver criada, ela pode ser criada normalmente).

## Instalação de dependências

A instalação de dependências é parecida com a da API, bastanto somente executar o comando ```npm --prefix ./web/ install ./web/```

## Configuração do ambiente

No frontend é necessário verificar e configurar o domínio onde a api está publicada e em casos em que o gerenciador de leads não esteja na raiz do domínio servido, essa rota também deverá ser configurada.

### Configuração do domínio da API

Para essa configuração é necessário acessar o arquivo ***web/.env***. No arquivo é possível ver a constante ***VUE_APP_ENDPOINT***, que é responsável por essa configuração. A api sempre é servida em um domínio "/api", onde serão acessados os métodos da mesma. A constante aceita o caminho completo do domínio da API (ex: **VUE_APP_ENDPOINT=https://meu.dominio/api**) ou se o frontend e API estão hospedados no mesmo domínio é possível somenta deixar o caminho relativo até a API (ex: **VUE_APP_ENDPOINT=/api**)

### Configuração de caminho do frontend (casos em que ele não está publicado da raiz do domínio)

Para casos em que o frontend não está na acessível raiz do domínio (ex: frontend acessível em **https://meu.dominio/gerenciadorleads/web** ao invés de **https://meu.dominio**) é necessária uma configuração extra antes de compilar o frontend.

Essa configuração é acessível através do arquivo ***web/vue.config.js***. No arquivo é possível visualizar o parâmatro ***publicPath***, que é responável por essa configuração. Nele colocar todo o caminho a partir do "/" de onde o frontend está acessível. (ex: para o caminho **https://meu.dominio/gerenciadorleads/web** colocar no parâmetro **/gerenciadorleads/web**)

## Compilação do projeto

Para compilar o projeto é necessário executar o comando ```npm --prefix ./web/ run build```. Uma pasta localizada em ***web/dist*** contém o projeto compilado, que pode ser movido para o servidor HTTP de escolha (ou para a pasta **public** dentro da API que está executando o servidor HTTP próprio).

# Fim

Com esses passos o projeto já está pronto e poderá ser acessado com o usuário padrão criado no setup.
