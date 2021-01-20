from django.http import JsonResponse
from unicodedata import normalize
import json, uuid



class UUIDEncoder(json.JSONEncoder):
    """UUID enconder for JSON conversions."""
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)

def erro_com_mensagem(mensagem: str, status=400) -> JsonResponse:
    """Retorna uma resposta (com status 400, por padrão,) no formato JSON contendo uma mensagem de erro."""
    return JsonResponse({
        'data': {
            'message': mensagem
        }
    }, status=status)

def remove_acentos(txt: str) -> str:
    """Remove todos os acentos da string fornecida."""
    return normalize('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')

def get_uuid():
    """Retorna um UUID em formato de string."""
    return str(uuid.uuid4())
