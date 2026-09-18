import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Users, IndianRupee } from 'lucide-react';

const PropertyCard = ({ property, distance_km }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {property.property_type}
          </span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span className="truncate">{property.city}, {property.address}</span>
        </div>

        {distance_km !== undefined && (
          <div className="mt-1 text-xs text-primary font-medium">
            {distance_km.toFixed(1)} km away
          </div>
        )}

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <BedDouble className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            {property.bedrooms} Beds
          </div>
          <div className="flex items-center">
            <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            Max {property.max_guests} Guests
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {property.description}
        </p>

        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div className="flex items-center text-lg font-bold text-gray-900">
          <IndianRupee className="h-4 w-4" />
          {property.price_per_night}
          <span className="text-sm font-normal text-gray-500 ml-1">/ night</span>
        </div>
        <Link
          to={`/properties/${property.id}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
