import requests
from requests import Request, Response
from decouple import config
from typing import Any
from .models import CredencialPJBank, TokenCartaoPJBank, TransacaoPJBank
from .errors import FeedbackError

class Ambiente:
    """
    Enumerador de ambientes disponíveis (desenvolvimento e produção).
    """
    Dev = 'sandbox'
    Prod = 'api'

class PJBank:
    """
    Classe base a realização de requisições à API do PJBank.
    """
    ambiente: str = config('ENV')

    def __init__(self, credencial: CredencialPJBank=None):
        self.ambiente = ambiente
        self.credencial = credencial or CredencialPJBank.objects.last()

    def get_raiz_api(self) -> str:
        """
        Retorna a URL principal da API do PJBank.
        """
        return f'https://{self.ambiente}.pkbank.com.br/'

    def requerir(self, method: str, rota: str, dados: Any=None, headers: dict=None, params: dict=None) -> Response:
        """
        Faz uma requisição à API do PJBank e retorna a resposta recebida.
        """
        url = self.get_raiz_api() + rota
        headers |= { 'X-CHAVE': self.credencial.chave }

        return Request(method=method, url=url, headers=headers, data=data, params=params)

class PJBankCartao(PJBank):
    """
    Manipulador de transações com cartão de crédito tokenizado via PJBank.
    """
    def credenciar_conta(self) -> None:
        """
        Credencia uma nova conta para recebimentos.
        """
        credencial = self.credencial
        dados = {
            'nome_empresa': credencial.nome_empresa,
            'conta_repasse': credencial.conta,
            'agencia_repasse': credencial.agencia,
            'banco_repasse': credencial.conta,
            'cnpj': credencial.cnpj,
            'ddd': credencial.ddd,
            'telelefone': credencial.telefone,
            'email': credencial.email,
            'cartao': credencial.cartao
        }

        resposta = self.requerir('POST', 'recebimentos', dados, headers={})

        if resposta.status_code == 201:
            resposta = resposta.json()

            credencial.credencial = resposta['credencial']
            credencial.chave = resposta['chave']
            credencial.conta_virtual = resposta['conta_virtual']
            credencial.agencia_virtual = resposta['agencia_virtual']
            credencial.save()
        
        raise FeedbackError('Não foi possível completar a requisição ao PJBank.')
    
    def consultar_credencial(self) -> dict:
        """
        Retorna as informações relativas a uma credencial.
        """
        credencial = self.credencial

        if credencial.credencial and credencial.chave:
            resposta = self.requerir('GET', f'recebimentos/{credencial.credencial}')

            if resposta.status_code == requests.codes.ok:
                return resposta.json()
            
            raise FeedbackError('Não foi possível completar a requisição ao PJBank.')

        raise FeedbackError('Para consultar uma credencial, é necessário que os campos "credencial" e "chave" estejam preenchidos.')

    def consultar_token_cartao(self, token_cartao: TokenCartaoPJBank) -> dict:
        """
        Consulta informações do token e indica se ele já foi validado anteriormente tanto
        pelo processo de validação quanto por uma transação (quando um token não validado
        é utilizado em uma transação o PJBank entende que ele é um token válido).
        """
        resposta = self.requerir('GET', f'recebimentos/{self.credencial.credencial}/tokens/{token_cartao.tid}')

        if resposta.status_code == requests.codes.ok:
            return resposta.json()

        raise FeedbackError('Não foi possível completar a requisição ao PJBank.')

    def criar_transacao_via_token(
            self,
            token_cartao: TokenCartaoPJBank,
            valor: float,
            parcelas: int,
            pedido_numero: int,
            descricao_pagamento: str
        ) -> TransacaoPJBank:
        """
        Cria uma transação de cartão de crédito utilizando um cartão tokenizado.
        """
        resposta = self.requerir('POST', f'recebimentos/{self.credencial.credencial}/transacoes', {
            'token_cartao': token_cartao.tid,
            'valor': valor,
            'parcelas': parcelas,
            'pedido_numero': pedido_numero,
            'descricao_pagamento': descricao_pagamento,
            'webhook': 'https://wnunes.com.br/transacoes/cartao'
        })

        if resposta.status_code == 201:
            return TransacaoPJBank.objects.create(
                token_cartao=resposta['token_cartao'],
                tid=resposta['tid'],
                previsao_credito=resposta['previsao_credito'],
                mensagem_status=resposta['msg'],
                tid_conciliaca=resposta['tid_conciliacao'],
                bandeira=resposta['bandeira'],
                autorizacao=resposta['autorizacao'],
                cartao_truncado=resposta['cartao_truncado'],
                status_cartao=resposta['statuscartao'],
                tarifa=resposta['tarifa'],
                taxa=resposta['taxa'],
                pedido_numero=resposta['pedido_numero']
            )

        raise FeedbackError('Não foi possível realizar a transação.')

    def consultar_transacao(self, tid: str) -> dict:
        """
        Retorna uma transação de cartão pelo `tid` passado na URL.
        """
        resposta = self.requerir('GET', f'recebimentos/{self.credencial.credencial}/transacoes/{tid}')

        if resposta.status_code == requests.status_codes.ok:
            return resposta.json()

        raise FeedbackError('Não foi possível consultar a transação.')

    def consultar_por_periodo(self, data_inicio: str, data_fim: str, pagina: int=1) -> dict:
        """
        Lista o que foi recebido em um determinado dia em formato ideal para realizar as baixas. Observações:

        A resposta sempre será paginada em 50 itens.
        Se não passar nenhuma data de parâmetro, será usada a data de hoje.
        O filtro de data será aplicado à `data_vencimento`.
        """
        resposta = self.requerir('GET', f'recebimentos/{self.credencial.credencial}/transacoes', params={
            'data_inicio': data_inicio,
            'data_fim': data_fim,
            'pagina': pagina
        })

        if resposta.status_code == requests.status_codes.ok:
            return resposta.json()

        raise FeedbackError('Não foi possível consultar as transações.')

    def cancelar_transacao(self, tid: str) -> None:
        """
        Quanto antes for feito, maior a chance de sucesso.
        """
        try:
            resposta = self.requerir('DELETE', f'recebimentos/{self.credencial.credencial}/transacoes/{tid}').json()
        except ValueError:
            raise FeedbackError('Não foi possível completar a requisição ao PJBank.')

        if resposta['status'] != 200:
            raise FeedbackError(resposta['msg'])
