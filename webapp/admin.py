from django.contrib import admin
from django.db import models
from django import forms
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import ugettext_lazy as _
from martor.widgets import AdminMartorWidget
from .models import (
    User,
    AvaliacaoCliente,
    Produto,
    Kit,
    BlogPost,
    ItemCarrinho
)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: { 'widget': AdminMartorWidget },
        models.CharField: { 'widget': forms.Textarea },
    }

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no email field."""

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    exclude = ('avaliacoes',)

@admin.register(Kit)
class KitAdmin(admin.ModelAdmin):
    exclude = ('avaliacoes',)

admin.site.register(AvaliacaoCliente)
admin.site.register(ItemCarrinho)