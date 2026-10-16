
from django.shortcuts import render

# Productos de Fer's Crepas & Waffles
PRODUCTOS = [
    # Crepas dulces
    {"nombre": "Nutella con fresa", "precio": 85, "stock": 20},
    {"nombre": "Cajeta con nuez", "precio": 80, "stock": 20},
    {"nombre": "Plátano con lechera", "precio": 75, "stock": 20},
    {"nombre": "Philadelphia con zarzamora", "precio": 90, "stock": 20},
    {"nombre": "Mazapán", "precio": 75, "stock": 20},

    # Crepas saladas y waffles
    {"nombre": "Jamón y queso", "precio": 85, "stock": 20},
    {"nombre": "Pollo con champiñones", "precio": 95, "stock": 20},
    {"nombre": "Waffle clásico", "precio": 70, "stock": 20},
    {"nombre": "Waffle con helado", "precio": 95, "stock": 20},
    {"nombre": "Waffle con pollo frito", "precio": 120, "stock": 20},

    # Bebidas
    {"nombre": "Café de olla", "precio": 35, "stock": 20},
    {"nombre": "Frappé Nutella", "precio": 80, "stock": 20},
    {"nombre": "Malteada de fresa", "precio": 70, "stock": 20},
    {"nombre": "Chocolate caliente", "precio": 50, "stock": 20},
    {"nombre": "Smoothie de mango", "precio": 65, "stock": 20},
]


def vista_ssr(request):
    contexto = {"productos": PRODUCTOS}
    return render(
        request,
        'catalogo_nomf/catalogo_ssr.html',
        contexto
    )
