from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from properties.models import Property
from properties.serializers import PropertySerializer
from .services import extract_filters_with_ai

STOPWORDS = {'i', 'a', 'an', 'the', 'is', 'in', 'of', 'for', 'to', 'near', 'at', 'with', 'need', 'want', 'my'}


class AISearchView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='q',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
                description="Natural-language search query, e.g. '2BHK in Kochi under 5000 with wifi'",
            ),
        ],
        responses={200: PropertySerializer(many=True)},
        description="AI-powered natural-language property search. Parses the query into structured filters via Gemini; falls back to ranked keyword search if AI parsing fails.",
    )
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"detail": "Query parameter 'q' is required."}, status=400)

        filters = extract_filters_with_ai(query)

        if filters is not None:
            qs = Property.objects.filter(is_active=True)

            if filters.get('city'):
                # Check both city AND address — Gemini may extract a landmark/street
                # (e.g. "Marine Drive") into 'city' when it's actually stored in address
                qs = qs.filter(
                    Q(city__icontains=filters['city']) | Q(address__icontains=filters['city'])
                )
            if filters.get('property_type'):
                qs = qs.filter(property_type__iexact=filters['property_type'])

            # "1bhk"/"3 bedroom" means EXACT count; "3+ bedrooms"/"at least 3" means a MINIMUM.
            # These are semantically different — gte alone would make "1bhk" match everything
            # with 1+ bedrooms, which is wrong.
            if filters.get('bedrooms') is not None:
                qs = qs.filter(bedrooms=filters['bedrooms'])
            elif filters.get('min_bedrooms') is not None:
                qs = qs.filter(bedrooms__gte=filters['min_bedrooms'])

            if filters.get('max_price') is not None:
                qs = qs.filter(price_per_night__lte=filters['max_price'])
            for amenity in filters.get('amenities') or []:
                qs = qs.filter(amenities__contains=[amenity])

            serializer = PropertySerializer(qs, many=True)
            return Response({
                "ai_parsed": True,
                "filters_used": filters,
                "results": serializer.data,
            })

        # Fallback: ranked keyword search. Instead of strict AND (too easy to return
        # nothing) or plain OR (too easy to return irrelevant matches — e.g. a property
        # in a different city matching only because it shares one word like "3bhk"),
        # we score every property by how many query words it matches and rank by that.
        # A property matching more of the query's words appears higher in the results,
        # while still not being fully excluded from the list if it matches fewer.
        words = [w for w in query.lower().split() if w not in STOPWORDS and len(w) > 1]

        active_properties = Property.objects.filter(is_active=True)

        if words:
            scored = []
            for prop in active_properties:
                searchable = f"{prop.title} {prop.description} {prop.city} {prop.address}".lower()
                match_count = sum(1 for word in words if word in searchable)
                if match_count > 0:
                    scored.append((match_count, prop))

            scored.sort(key=lambda pair: pair[0], reverse=True)
            results_list = [prop for _, prop in scored]
        else:
            results_list = list(active_properties)

        serializer = PropertySerializer(results_list, many=True)
        return Response({
            "ai_parsed": False,
            "filters_used": None,
            "results": serializer.data,
        })