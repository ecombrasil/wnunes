from django.http import JsonResponse
from unicodedata import normalize


def erro_com_mensagem(mensagem: str) -> JsonResponse:
    return JsonResponse({
        'erro': {
            'mensagem': mensagem
        }
    })

def remove_acentos(txt: str) -> str:
    return normalize('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')