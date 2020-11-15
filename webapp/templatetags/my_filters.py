from django.template import Library
from django.core.serializers import serialize
from django.utils.safestring import SafeString


register = Library()

@register.filter(name='times') 
def times(number):
    return range(number)

@register.filter(name='json')
def json(queryset):
    return SafeString(serialize('json', queryset))
