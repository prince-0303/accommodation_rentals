from rest_framework import generics, filters
from django_filters import rest_framework as django_filters
from .models import Property
from .serializers import PropertySerializer
from .permissions import IsAdminOrReadOnly
from .utils import haversine_km
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


class PropertyFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')

    class Meta:
        model = Property
        fields = ['city', 'property_type', 'bedrooms']


class PropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Property.objects.none()
            
        user = self.request.user
        if user.is_authenticated and (getattr(user, 'role', '') == 'admin' or user.is_superuser):
            return Property.objects.all()
            
        return Property.objects.filter(is_active=True)

    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'city', 'address']
    ordering_fields = ['price_per_night', 'created_at']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Property.objects.none()
            
        user = self.request.user
        if user.is_authenticated and (getattr(user, 'role', '') == 'admin' or user.is_superuser):
            return Property.objects.all()
            
        return Property.objects.filter(is_active=True)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class NearbyPropertiesView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(name='lat', type=OpenApiTypes.FLOAT, location=OpenApiParameter.QUERY, required=True, description="Your latitude"),
            OpenApiParameter(name='lng', type=OpenApiTypes.FLOAT, location=OpenApiParameter.QUERY, required=True, description="Your longitude"),
            OpenApiParameter(name='radius_km', type=OpenApiTypes.FLOAT, location=OpenApiParameter.QUERY, required=False, description="Max distance in km. Defaults to 50km if not specified."),
        ],
        responses={200: PropertySerializer(many=True)},
        description="Lists active properties sorted nearest-first by distance from the given coordinates, limited to a radius (default 50km).",
    )
    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        if not lat or not lng:
            return Response({"detail": "'lat' and 'lng' are required."}, status=400)

        try:
            lat, lng = float(lat), float(lng)
        except ValueError:
            return Response({"detail": "'lat' and 'lng' must be numbers."}, status=400)

        radius_km = request.query_params.get('radius_km')
        radius_km = float(radius_km) if radius_km else 50

        scored = []
        for prop in Property.objects.filter(is_active=True):
            distance = haversine_km(lat, lng, prop.latitude, prop.longitude)
            if distance <= radius_km:
                scored.append((distance, prop))

        scored.sort(key=lambda pair: pair[0])

        data = []
        for distance, prop in scored:
            item = PropertySerializer(prop).data
            item['distance_km'] = round(distance, 2)
            data.append(item)

        return Response(data)