from unicodedata import normalize

def remove_acentos(txt: str) -> str:
    return normalize('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')