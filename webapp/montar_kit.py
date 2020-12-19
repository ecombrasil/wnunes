from typing import List, Dict
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

    _60cm = 60
    _80cm = 80
    _100cm = 100
    _120cm = 120
    _130cm = 130
    _150cm = 150
    _180cm = 180
    _200cm = 200

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

    def __init__(self, altura: int, telhado: str, distancia_ancoragens: int, filas: List[Dict]):
        self.altura = altura
        self.telhado = telhado
        self.distancia_ancoragens = distancia_ancoragens
        self.filas = filas
        self.minitrilho = minitrilho

    def montar(self):
        """Monta o kit conforme os parâmetros passados."""

        # Cálculos padrão para todos os kits

        calculo_lateral = self.__calcular_kit_lateral()
        calculo_interno = self.__calcular_kit_interno()

        # Cálculos mini trilho (retorna)

        if (self.telhado == Telhado.MetalicoTrapezoidalMiniTrilhoAlto or
            self.telhado == Telhado.MetalicoTrapezoidalMiniTrilhoBaixo):
            self.__calcular_quantidade_minitrilho(calculo_lateral, calculo_interno)
            return

        # Cálculos perfil

       self.__calcular_quantidade_perfil()

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
        """Registra o kit no banco de dados."""
        
        self.pedido = KitPersonalizado()
        self.pedido.save()

        self.__registrar_items()
        self.pedido.itens.add(...self.itens)

    def __adicionar_item(self, produto: Produto, qntd: int):
        """Adiciona um novo item do kit à lista."""

        self.itens.append(ItemKitPersonalizado(produto=produto, qntd=qntd))
    
    def __registrar_items(self):
        """Salva todos ítens do kit no banco de dados."""

        [item.save() for item in self.itens]

    def __calcular_kit_lateral(self) -> int:
        """Faz o cálculo do kit lateral."""

        numero_filas = len(self.filas)
        produto = None
        qntd = numero_filas * 4

        if self.altura == Altura._35mm:
            # Adiciona o kit 18 35mm
            produto = None
        elif self.altura == Altura._40mm:
            # Adiciona o kit 18 40mm
            produto = None

        self.__adicionar_item(produto, qntd)
        return qntd

    def __calcular_kit_interno(self) -> int:
        """Faz o cálculo do kit interno."""

        numero_placas = sum(self.filas)
        produto = None
        qntd = (numero_placas - 1) * 2

        if self.altura == Altura._35mm:
            # Adiciona o kit 19 35mm
            produto = None
        elif self.altura == Altura._40mm:
            # Adiciona o kit 19 40mm
            produto = None

        self.__adicionar_item(produto, qntd)
        return qntd

    def __calcular_quantidade_minitrilho(self, qntd_lateral, qntd_minitrilho):
        """Calcula a quantidade de minitrilho."""

        qntd = qntd_lateral + qntd_minitrilho
        produto = None

        # Não sei qual(is) produto(s) selecionar

        self.__adicionar_item(produto, qntd)

    def __calcular_quantidade_perfil(self) -> int:
        """Calcula a quantidade de perfil."""
        
        numero_placas = sum(self.filas)
        produto = None
        qntd = 0

        if self.orientacao == Orientacao.Paisagem:
            qntd = 2 * numero_placas
        elif self.orientacao == Orientacao.Retrato:
            qntd = numero_placas

        self.__adicionar_item(produto, qntd)
        return qntd

    def __calcular_quantidade_kit_fixacao(self):
        """Calcula a quantidade necessária de kits de fixação."""
        
        produto = None


montador_kit = MontadorKit(
    altura=Altura._35mm,
    telhado=Telhado.Ceramico,
    distancia_ancoragens=DistanciaAncoragem._80cm,
    filas=[
        {
            'qntd_placas': 10,
            'orientacao': Orientacao.Retrato
        },
        {
            'qntd_placas': 2,
            'orientacao': Orientacao.Paisagem
        }
    ]
)
