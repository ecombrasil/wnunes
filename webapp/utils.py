from django.http import JsonResponse
from unicodedata import normalize


def erro_com_mensagem(mensagem: str, status=400) -> JsonResponse:
    return JsonResponse({
        'data': {
            'message': mensagem
        }
    }, status_code=status)

def remove_acentos(txt: str) -> str:
    return normalize('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')