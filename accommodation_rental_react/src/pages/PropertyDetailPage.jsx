import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, deleteProperty } from '../api/propertiesApi';
import { useAuth } from '../hooks/useAuth';
import BookingForm from '../components/bookings/BookingForm';
import { MapPin, BedDouble, Users, IndianRupee, Edit, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await getProperty(id);
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property details', error);
      toast.error('Failed to load property details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
        toast.success('Property deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Failed to delete property', error);
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to listings
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    {property.title}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {property.property_type}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-lg">
                  <MapPin className="h-5 w-5 mr-1.5 text-gray-400" />
                  {property.address}, {property.city}
                </div>
              </div>
              
              <div className="flex items-end flex-col">
                <div className="text-3xl font-bold text-gray-900 flex items-center">
                  <IndianRupee className="h-7 w-7" />
                  {property.price_per_night}
                </div>
                <span className="text-gray-500">per night</span>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="flex space-x-3 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700 flex items-center mr-auto">
                  Admin Controls
                </span>
                <button
                  onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Edit className="h-4 w-4 mr-1.5 text-gray-500" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Details Section */}
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center text-gray-700">
                      <BedDouble className="h-6 w-6 mr-2 text-primary" />
                      <span className="font-medium">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="h-6 w-6 mr-2 text-primary" />
                      <span className="font-medium">Max {property.max_guests} Guests</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </section>

                {/* Amenities Section */}
                {property.amenities && property.amenities.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">What this place offers</h2>
                    <ul className="grid grid-cols-2 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Sidebar Booking Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {!user ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Want to book this place?</h3>
                      <p className="text-gray-600 mb-4 text-sm">Please sign in to check availability and book your stay.</p>
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                      >
                        Sign in to Book
                      </button>
                    </div>
                  ) : user.role === 'admin' ? (
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
                      <p className="text-gray-600 text-sm text-center">
                        Admins cannot book properties.
                      </p>
                    </div>
                  ) : (
                    <BookingForm propertyId={property.id} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
