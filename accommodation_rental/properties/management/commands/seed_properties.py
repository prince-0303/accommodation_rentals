from django.core.management.base import BaseCommand
from properties.models import Property
from users.models import User


class Command(BaseCommand):
    help = 'Seeds the database with sample properties for testing/demo purposes'

    def handle(self, *args, **options):
        admin = User.objects.filter(role='admin').first() or User.objects.filter(is_superuser=True).first()
        if not admin:
            self.stdout.write(self.style.ERROR(
                'No admin or superuser found. Create one first with: python manage.py createsuperuser'
            ))
            return

        properties_data = [
            {
                "title": "Cozy Studio",
                "description": "Near the beach",
                "property_type": "studio",
                "city": "Kochi",
                "address": "MG Road",
                "latitude": 9.9312, "longitude": 76.2673,
                "price_per_night": 1500.00, "bedrooms": 1, "max_guests": 2,
                "amenities": ["wifi", "ac"],
            },
            {
                "title": "Modern 3BHK Apartment",
                "description": "Spacious apartment with sea view, close to Marine Drive",
                "property_type": "apartment",
                "city": "Kochi",
                "address": "Marine Drive, Ernakulam",
                "latitude": 9.9658, "longitude": 76.2422,
                "price_per_night": 2800.00, "bedrooms": 3, "max_guests": 4,
                "amenities": ["wifi", "parking", "ac", "kitchen"],
            },
            {
                "title": "Beachfront Villa with Private Pool",
                "description": "Luxurious 3-bedroom villa steps from Fort Kochi beach, private pool and garden",
                "property_type": "villa",
                "city": "Kochi",
                "address": "Fort Kochi Beach Road",
                "latitude": 9.9658, "longitude": 76.2422,
                "price_per_night": 6500.00, "bedrooms": 3, "max_guests": 6,
                "amenities": ["wifi", "pool", "parking", "ac", "kitchen"],
            },
            {
                "title": "Cozy Studio Near Railway Station",
                "description": "Compact and affordable studio, walking distance to Ernakulam Junction",
                "property_type": "studio",
                "city": "Kochi",
                "address": "Ernakulam South, near Railway Station",
                "latitude": 9.9691, "longitude": 76.2856,
                "price_per_night": 900.00, "bedrooms": 1, "max_guests": 2,
                "amenities": ["wifi", "ac"],
            },
            {
                "title": "Spacious 3BHK Family House",
                "description": "Quiet residential house with garden, ideal for families, close to Lulu Mall",
                "property_type": "house",
                "city": "Thiruvananthapuram",
                "address": "Kazhakkoottam",
                "latitude": 8.5661, "longitude": 76.8746,
                "price_per_night": 3200.00, "bedrooms": 3, "max_guests": 5,
                "amenities": ["wifi", "parking", "kitchen", "washing_machine"],
            },
            {
                "title": "Premium Penthouse with Skyline View",
                "description": "Ultra-luxury penthouse apartment with panoramic city views, rooftop access, and premium furnishings",
                "property_type": "apartment",
                "city": "Kochi",
                "address": "Panampilly Nagar",
                "latitude": 9.9633, "longitude": 76.2999,
                "price_per_night": 8500.00, "bedrooms": 4, "max_guests": 8,
                "amenities": ["wifi", "parking", "ac", "kitchen", "pool", "gym"],
            },
            {
                "title": "Simple Single Room Stay",
                "description": "No-frills, clean and affordable single room, perfect for solo travelers on a budget",
                "property_type": "studio",
                "city": "Kochi",
                "address": "Vyttila",
                "latitude": 9.9683, "longitude": 76.3175,
                "price_per_night": 600.00, "bedrooms": 1, "max_guests": 1,
                "amenities": ["wifi"],
            },
            {
                "title": "Traditional Kerala Homestay",
                "description": "Charming heritage-style homestay with traditional architecture, near Kozhikode beach",
                "property_type": "house",
                "city": "Kozhikode",
                "address": "Beach Road, Kozhikode",
                "latitude": 11.2588, "longitude": 75.7804,
                "price_per_night": 1800.00, "bedrooms": 2, "max_guests": 4,
                "amenities": ["wifi", "parking", "kitchen"],
            },
            {
                "title": "Hillside Cottage with Tea Estate View",
                "description": "Cozy cottage nestled in the hills, surrounded by tea plantations, ideal for a peaceful getaway",
                "property_type": "house",
                "city": "Munnar",
                "address": "Tea Estate Road, Munnar",
                "latitude": 10.0889, "longitude": 77.0595,
                "price_per_night": 3800.00, "bedrooms": 2, "max_guests": 4,
                "amenities": ["wifi", "parking", "kitchen", "fireplace"],
            },
            {
                "title": "Garden Villa in Kakkanad",
                "description": "Peaceful villa with a private garden, close to Infopark, great for business travelers",
                "property_type": "villa",
                "city": "Kochi",
                "address": "Kakkanad, near Infopark",
                "latitude": 10.0159, "longitude": 76.3419,
                "price_per_night": 4200.00, "bedrooms": 3, "max_guests": 6,
                "amenities": ["wifi", "parking", "ac", "kitchen", "garden"],
            },
            {
                "title": "Compact 1BHK Near Infopark",
                "description": "Well-maintained 1BHK apartment, ideal for IT professionals working nearby",
                "property_type": "apartment",
                "city": "Kochi",
                "address": "Kakkanad, near Infopark",
                "latitude": 10.0159, "longitude": 76.3419,
                "price_per_night": 1200.00, "bedrooms": 1, "max_guests": 2,
                "amenities": ["wifi", "ac", "parking"],
            },
            {
                "title": "Cozy 1BHK Near Technopark",
                "description": "Comfortable one-bedroom apartment close to Technopark, perfect for short business stays",
                "property_type": "apartment",
                "city": "Thiruvananthapuram",
                "address": "Kazhakkoottam, near Technopark",
                "latitude": 8.5642, "longitude": 76.8697,
                "price_per_night": 1500.00, "bedrooms": 1, "max_guests": 2,
                "amenities": ["wifi", "ac", "kitchen"],
            },
            {
                "title": "Elegant 1BHK Serviced Apartment",
                "description": "Fully serviced 1BHK with premium interiors, housekeeping included, near Lulu Mall",
                "property_type": "apartment",
                "city": "Kochi",
                "address": "Edappally, near Lulu Mall",
                "latitude": 10.0261, "longitude": 76.3086,
                "price_per_night": 2200.00, "bedrooms": 1, "max_guests": 2,
                "amenities": ["wifi", "ac", "kitchen", "housekeeping"],
            },
        ]

        created_count = 0
        for data in properties_data:
            _, created = Property.objects.get_or_create(
                title=data["title"],
                defaults={**data, "owner": admin, "is_active": True},
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Seeding complete: {created_count} new properties created, '
            f'{len(properties_data) - created_count} already existed and were skipped.'
        ))
