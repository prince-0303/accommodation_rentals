import React, { useState, useEffect } from 'react';
import { getProperties, getPropertiesNearby } from '../api/propertiesApi';
import { aiSearch } from '../api/searchApi';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilters from '../components/properties/PropertyFilters';
import SearchBar from '../components/properties/SearchBar';
import { MapPin, Sparkles, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const formatAiFilters = (filters) => {
  if (!filters) return '';
  
  let phrase = '';
  const parts = [];
  
  let noun = '';
  if (filters.min_bedrooms) {
    noun += `${filters.min_bedrooms}+ bedroom `;
  }
  
  if (filters.property_type && String(filters.property_type).trim()) {
    noun += `${filters.property_type}s`;
  } else {
    noun += 'results';
  }
  
  if (filters.city && String(filters.city).trim()) {
    noun += ` in ${filters.city}`;
  }
  
  phrase = `Showing ${noun}`;
  
  if (filters.max_price) {
    parts.push(`under ₹${filters.max_price}/night`);
  }
  
  if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    parts.push(`with ${filters.amenities.join(', ')}`);
  }
  
  if (parts.length > 0) {
    phrase += ', ' + parts.join(', ');
  }
  
  if (phrase === 'Showing results') return '';
  
  return phrase;
};

const PropertyListPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiResultInfo, setAiResultInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isAiMode) return;

    const timeoutId = setTimeout(() => {
      fetchProperties(filters);
    }, 400); // wait 400ms after the user stops typing/changing filters

    return () => clearTimeout(timeoutId);
  }, [filters, isAiMode]);

  const fetchProperties = async (currentFilters) => {
    setLoading(true);
    setAiResultInfo(null);
    try {
      const data = await getProperties(currentFilters);
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      if (!isAiMode) fetchProperties(filters);
      return;
    }

    setLoading(true);
    try {
      if (isAiMode) {
        const data = await aiSearch(query);
        setProperties(data.results);
        setAiResultInfo({
          ai_parsed: data.ai_parsed,
          filters_used: data.filters_used
        });
      } else {
        const currentFilters = { ...filters, search: query };
        fetchProperties(currentFilters);
      }
    } catch (error) {
      console.error('Search failed', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getPropertiesNearby(latitude, longitude);
          setProperties(data);
          setAiResultInfo(null);
          setIsAiMode(false);
          toast.success('Found properties near you');
        } catch (error) {
          console.error('Failed to fetch nearby properties', error);
          toast.error('Failed to find nearby properties');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        toast.error('Unable to retrieve your location');
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            Find your perfect stay
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Discover amazing places to rent with our smart AI search or standard filters.
          </p>
        </div>

        <div className="mb-10">
          <SearchBar onSearch={handleSearch} isAiMode={isAiMode} setIsAiMode={setIsAiMode} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-300"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                {showFilters ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
              <button
                onClick={handleNearMe}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find Near Me
              </button>

              {!isAiMode && (
                <PropertyFilters filters={filters} setFilters={setFilters} />
              )}
            </div>
          </div>

          {/* Main Content / Property List */}
          <div className="flex-1">
            {aiResultInfo && (
              <div className="mb-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-start">
                <Sparkles className="h-5 w-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-indigo-900">
                    {aiResultInfo.ai_parsed ? 'AI matched your query!' : 'Fell back to keyword search'}
                  </h3>
                  {aiResultInfo.filters_used && formatAiFilters(aiResultInfo.filters_used) && (
                    <p className="mt-1 text-sm text-indigo-700">
                      {formatAiFilters(aiResultInfo.filters_used)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100">
                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} distance_km={property.distance_km} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                  Try adjusting your filters, location, or search terms to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    setIsAiMode(false);
                  }}
                  className="mt-6 text-primary font-medium hover:text-primary-dark"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListPage;
