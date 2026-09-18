import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, getProperty, updateProperty } from '../api/propertiesApi';
import { Home, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPropertyFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    price_per_night: '',
    bedrooms: '',
    max_guests: '',
    amenities: '', // Will be converted to array
    is_active: true
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await getProperty(id);
      setFormData({
        ...data,
        amenities: data.amenities ? data.amenities.join(', ') : ''
      });
    } catch (error) {
      console.error('Failed to fetch property for editing', error);
      toast.error('Failed to load property');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Prepare payload
    const payload = { ...formData };
    
    // Convert amenities comma-separated string to array
    if (typeof payload.amenities === 'string') {
      payload.amenities = payload.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a !== '');
    }

    // Number conversions
    payload.price_per_night = parseFloat(payload.price_per_night);
    payload.bedrooms = parseInt(payload.bedrooms, 10);
    payload.max_guests = parseInt(payload.max_guests, 10);
    if (payload.latitude) payload.latitude = parseFloat(payload.latitude);
    if (payload.longitude) payload.longitude = parseFloat(payload.longitude);

    try {
      if (isEditMode) {
        await updateProperty(id, payload);
        toast.success('Property updated successfully');
        navigate('/admin/properties');
      } else {
        await createProperty(payload);
        toast.success('Property created successfully');
        navigate('/admin/properties');
      }
    } catch (error) {
      console.error('Failed to save property', error);
      toast.error(isEditMode ? 'Failed to update property' : 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center mb-8">
              <Home className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-extrabold text-gray-900">
                {isEditMode ? 'Edit Property' : 'Add New Property'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                  <select
                    name="property_type"
                    required
                    value={formData.property_type}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Per Night (₹) *</label>
                  <input
                    type="number"
                    name="price_per_night"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <h3 className="sm:col-span-2 text-lg font-medium text-gray-900">Location</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude (optional)</label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude (optional)</label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              {/* Capacity & Amenities */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <h3 className="sm:col-span-2 text-lg font-medium text-gray-900">Details & Amenities</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms *</label>
                  <input
                    type="number"
                    name="bedrooms"
                    required
                    min="1"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Guests *</label>
                  <input
                    type="number"
                    name="max_guests"
                    required
                    min="1"
                    value={formData.max_guests}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                  <input
                    type="text"
                    name="amenities"
                    placeholder="e.g. WiFi, Pool, Air Conditioning, TV"
                    value={formData.amenities}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active (visible in search results)
                  </label>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Saving...' : 'Save Property'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyFormPage;
