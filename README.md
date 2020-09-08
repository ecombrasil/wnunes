# wnunes

## Instalação

### Requisitos:

- [Python 3](https://www.python.org)
- [PostgreSQL](https://www.postgresql.org)
- Pacote [virtualenv](https://pypi.org/project/virtualenv/)

### Passos

Primeiro, crie um ambiente de desenvolvimento dentro do diretório do projeto e, logo em seguida, ative-o:

```bash
virualenv env
source env/bin/activate
```

Instale os pacotes necessários:

```
pip install -r requirements.txt
```

Crie um banco de dados local do PostgreSQL, conforme os dados fornecidos em `settings.py` e faça as migrações utilizando os comandos abaixo:

```
python manage.py makemigrations
python manage.py migrate
```

## Uso

Para rodar a aplicação localmente, execute o seguinte comando:

```bash
python manage.py runserver
```

## Dicas

Se estiver rodando a aplicação **localmente** com `DEBUG = False` em `settings.py` e desejar carregar os arquivos estáticos normalmente, utilize o comando `python manage.py runserver --insecure`.