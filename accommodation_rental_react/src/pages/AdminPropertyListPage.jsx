import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties, deleteProperty, updateProperty } from '../api/propertiesApi';
import { PlusCircle, Edit, Trash2, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPropertyListPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate (soft-delete) this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deactivated');
      // Update local state to remove it or mark inactive
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to deactivate property', error);
      toast.error('Failed to deactivate property');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await updateProperty(id, { is_active: true });
      toast.success('Property reactivated');
      fetchProperties();
    } catch (error) {
      console.error('Failed to reactivate property', error);
      toast.error('Failed to reactivate property');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            View, edit, and manage all property listings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Property
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                    No properties found.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className={property.is_active !== false ? "hover:bg-gray-50" : "opacity-50 bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{property.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{property.property_type}</div>
                      <div className="text-sm text-gray-500">{property.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {property.price_per_night}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {property.is_active !== false ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/properties/${property.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Link>
                      
                      {property.is_active !== false ? (
                        <button
                          onClick={() => handleDeactivate(property.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(property.id)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyListPage;
