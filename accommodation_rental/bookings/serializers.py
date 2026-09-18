from datetime import date
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'property', 'user', 'check_in', 'check_out', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate_status(self, value):
        # Only transition to 'cancelled' is allowed via API; clients can't set 'confirmed' directly
        if self.instance and value == 'confirmed' and self.instance.status == 'cancelled':
            raise serializers.ValidationError("A cancelled booking cannot be reactivated.")
        if value not in ('confirmed', 'cancelled'):
            raise serializers.ValidationError("Invalid status.")
        return value

    def validate(self, data):
        request = self.context['request']

        # --- Cancellation path (self.instance exists on PATCH) ---
        if self.instance and data.get('status') == 'cancelled':
            user = request.user
            is_admin = user.role == 'admin' or user.is_superuser
            if not is_admin:
                if self.instance.user != user:
                    raise serializers.ValidationError("You can only cancel your own bookings.")
                if self.instance.check_in < date.today():
                    raise serializers.ValidationError("Cannot cancel a booking whose check-in date has passed.")
            return data

        # --- Creation path ---
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        property_obj = data.get('property')

        if check_out <= check_in:
            raise serializers.ValidationError("check_out must be after check_in.")

        if property_obj.owner == request.user:
            raise serializers.ValidationError("You cannot book your own property.")

        overlapping = Booking.objects.filter(
            property=property_obj,
            status='confirmed',
            check_in__lt=check_out,
            check_out__gt=check_in,
        )
        if overlapping.exists():
            raise serializers.ValidationError("This property is already booked for the selected dates.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)