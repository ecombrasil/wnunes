from django.http import JsonResponse
from unicodedata import normalize


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

def random_string(comprimento: int) -> str:
    """Retorna uma string aleatória que pode ser utilizada como um ID."""
    return ''.join(random.choice(string.ascii_letters) for i in range(comprimento))
