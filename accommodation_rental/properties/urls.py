from django.urls import path
from .views import PropertyListCreateView, PropertyDetailView, NearbyPropertiesView

urlpatterns = [
    path('', PropertyListCreateView.as_view(), name='property-list-create'),
    path('nearby/', NearbyPropertiesView.as_view(), name='property-nearby'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
]