from rest_framework import routers, serializers, viewsets
from rest_framework.response import Response
from .models import ItemCarrinho
from .utils import erro_com_mensagem


# Serializers

class ItemCarrinhoPartialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCarrinho
        fields = ['qntd']

# ViewSets

class ItemCarrinhoViewSet(viewsets.ModelViewSet):
    queryset = ItemCarrinho.objects.all()
    serializer_class = ItemCarrinhoPartialSerializer

    def partial_update(self, request, pk=None):
        item = self.get_object()
        item_recebido = request.data
        is_disponivel = False

        qntd = item_recebido['qntd']

        # Faz a checagem se for produto
        if item.produto is not None:
            is_disponivel = item.produto.is_disponivel(qntd)

        # Faz a checagem se for kit
        elif item.kit is not None:
            is_disponivel = item.kit.is_disponivel(qntd)
        
        # Retorna Bad Request se não houver nem produto nem kit
        else:
            return erro_com_mensagem('Não há produto ou kit neste item do carrinho.')

        # Faz a atualização do item e o retorna se estiver tudo certo
        if is_disponivel:
            serializer = self.serializer_class(item, item_recebido, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        
        # Retorna Bad Request se a quantidade solicitada não estiver disponível em estoque
        return erro_com_mensagem('A quantidade solicitada não está disponível no momento.')

# Router

router = routers.DefaultRouter()
router.register(r'item-carrinho', ItemCarrinhoViewSet)