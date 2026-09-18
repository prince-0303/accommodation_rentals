import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const SearchBar = ({ onSearch, isAiMode, setIsAiMode }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setIsAiMode(false)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            !isAiMode 
              ? 'bg-gray-900 text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Standard Search
        </button>
        <button
          onClick={() => setIsAiMode(true)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center ${
            isAiMode 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          AI Search
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${isAiMode ? 'text-indigo-500' : 'text-gray-400'}`}>
          {isAiMode ? <Sparkles className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </div>
        <input
          type="text"
          className={`block w-full pl-12 pr-24 py-4 rounded-xl border-2 focus:ring-0 focus:outline-none transition-colors shadow-sm text-lg ${
            isAiMode 
              ? 'border-indigo-100 focus:border-indigo-500 placeholder-indigo-300' 
              : 'border-gray-200 focus:border-primary placeholder-gray-400'
          }`}
          placeholder={
            isAiMode
              ? 'e.g. "2BHK in Kochi under 5000 with wifi"'
              : 'Search by keywords...'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              isAiMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
