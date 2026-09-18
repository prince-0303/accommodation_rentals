import React from 'react';

const PropertyFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          type="text"
          name="city"
          value={filters.city || ''}
          onChange={handleChange}
          placeholder="e.g. Kochi"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
        <select
          name="property_type"
          value={filters.property_type || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
        >
          <option value="">Any</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
        <input
          type="number"
          name="bedrooms"
          value={filters.bedrooms || ''}
          onChange={handleChange}
          min="1"
          placeholder="Any"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select
          name="ordering"
          value={filters.ordering || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
        >
          <option value="">Newest</option>
          <option value="price_per_night">Price: Low to High</option>
          <option value="-price_per_night">Price: High to Low</option>
        </select>
      </div>

      <button
        onClick={() => setFilters({})}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default PropertyFilters;
