from typing import List
from lets_debug import terminal
from .models import (
    Produto,
    ItemKitPersonalizado,
    KitPersonalizado
)

class Altura:
    """Enumerador para as opções de altura."""

    _35mm = 35
    _40mm = 40

class Telhado:
    """Enumerador para as opções de telhado."""

    Ceramico = 'T1'
    Fibrocimento = 'T2'
    Shingle = 'T3'
    MetalicoTrapezoidal = 'T4'
    MetalicoTrapezoidalMiniTrilhoBaixo = 'T5'
    MetalicoTrapezoidalMiniTrilhoAlto = 'T6'
    MetalicoPerfilCorridoBaixo = 'T7'
    MetalicoPerfilCorridoAlto = 'T8'

class DistanciaAncoragem:
    """Enumerador para as opções de distância entre ancoragens."""

    _60mm = 60
    _80mm = 80
    _100mm = 100
    _120mm = 120
    _130mm = 130
    _150mm = 150
    _180mm = 180
    _200mm = 200

class Orientacao:
    """Enumerador para as opções de orientacao."""

    Paisagem = 'P'
    Retrato = 'R'

class MontadorKit:
    """Classe responsável por montar o kit customizado."""

    altura = None
    telhado = None
    orientacao = None
    distancia_ancoragens = None
    filas = None
    minitrilho = None

    itens = []
    pedido = None

    def __init__(self, altura: int, telhado: str, distancia_ancoragens: int, filas: List[int], orientacao: str):
        self.altura = altura
        self.telhado = telhado
        self.orientacao = orientacao
        self.distancia_ancoragens = distancia_ancoragens
        self.filas = filas
        self.minitrilho = minitrilho

    def montar(self):
        """Monta o kit com os parâmetros passados."""

        # Selecionar produtos de acordo com a altura

        if self.altura == Altura._35mm:
            terminal.log('Add produto 18 35mm')
            terminal.log('Add produto 19 35mm')
        elif self.altura == Altura._40mm:
            terminal.log('Add produto 18 40mm')
            terminal.log('Add produto 19 40mm')

        # Tratar telhado mini trilho e retornar

        if (self.telhado == Telhado.MetalicoTrapezoidalMiniTrilhoAlto or
            self.telhado == Telhado.MetalicoTrapezoidalMiniTrilhoBaixo):
            terminal.log('Quantidade de mini trilho')
            return

        # Definir quantidade de perfil

        if self.orientacao == Orientacao.Retrato:
            terminal.log('Cálculo quantidade de perfil para retrato')
        elif self.orientacao == Orientacao.Paisagem:
            terminal.log('Cálculo quantidade de perfil para paisagem')

        # Tratar tratar telhados perfil corrido e retornar

        if self.telhado == Telhado.MetalicoPerfilCorridoAlto:
            terminal.log('Perfil alto')
            return
        
        if self.telhado == Telhado.MetalicoTrapezoidalMiniTrilhoBaixo:
            terminal.log('Perfil baixo')
            return

        terminal.log('Quantidade de fixação')

        if self.telhado == Telhado.MetalicoTrapezoidal:
            terminal.log('Kit 14')
            return
        
        if self.telhado == Telhado.Shingle:
            terminal.log('Kit 10 - 3')
            return
        
        if self.telhado == Telhado.Fibrocimento:
            terminal.log('Kit 12')
            return
        
        if self.telhado == Telhado.Ceramico:
            terminal.log('Kit 10')
            return

    def criar_pedido(self):
        """Cria um registro para o kit customizado no banco de dados."""
        self.__registrar_items()
        self.pedido = KitPersonalizado()
        self.pedido.save()
        self.pedido.itens.add(...self.itens)

    def __adicionar_item(self, produto: Produto, qntd: int):
        """Adicionar na lista novo objeto de item do kit."""
        self.itens.append(ItemKitPersonalizado(produto=produto, qntd=qntd))
    
    def __registrar_items(self):
        """Salvar todos os objetos dos ítens do kit no banco de dados."""
        [item.save() for item in self.itens]


montador_kit = MontadorKit(
    altura=Altura._35mm,
    telhado=Telhado.T1,
    distancia_ancoragens=80,
    filas=[4, 3, 3],
    orientacao=Orientacao.Paisagem,
)
