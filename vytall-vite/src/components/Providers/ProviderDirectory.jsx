import React, { useState, useEffect } from 'react';
import { fetchPhysicians } from '../../api/physicians';
import { fetchPharmacists } from '../../api/pharmacists';
import Select from 'react-select';
import Button from '../ui/Button';
import specializations from '../../Data/specializations';

export default function ProviderDirectory() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    providerType: 'all', // 'all', 'physician', 'pharmacist'
    specialization: '',
    searchQuery: '',
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both physicians and pharmacists
      const [physicians, pharmacists] = await Promise.all([
        fetchPhysicians(),
        fetchPharmacists(),
      ]);

      // Format the data to include provider type
      const formattedPhysicians = physicians.map(p => ({
        ...p,
        providerType: 'physician',
        displayName: `Dr. ${p.name}`,
        specialty: p.specialty,
      }));

      const formattedPharmacists = pharmacists.map(p => ({
        ...p,
        providerType: 'pharmacist',
        displayName: p.name,
        specialty: 'Pharmacist',
      }));

      setProviders([...formattedPhysicians, ...formattedPharmacists]);
    } catch (err) {
      console.error('Error loading providers:', err);
      setError('Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const filteredProviders = providers.filter(provider => {
    // Filter by provider type
    if (filters.providerType !== 'all' && provider.providerType !== filters.providerType) {
      return false;
    }

    // Filter by specialization
    if (filters.specialization && provider.specialty !== filters.specialization) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        provider.displayName.toLowerCase().includes(query) ||
        provider.specialty.toLowerCase().includes(query) ||
        (provider.contact && provider.contact.toLowerCase().includes(query))
      );
    }

    return true;
  });

  if (loading) return <div className="p-4 text-center">Loading providers...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Provider Directory</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Provider Type Filter */}
          <Select
            options={[
              { value: 'all', label: 'All Providers' },
              { value: 'physician', label: 'Physicians' },
              { value: 'pharmacist', label: 'Pharmacists' },
            ]}
            value={{ value: filters.providerType, label: filters.providerType === 'all' ? 'All Providers' : 
              filters.providerType === 'physician' ? 'Physicians' : 'Pharmacists' }}
            onChange={(option) => handleFilterChange('providerType', option.value)}
            className="w-full"
          />

          {/* Specialization Filter */}
          {filters.providerType === 'physician' && (
            <Select
              options={specializations.map(spec => ({ value: spec, label: spec }))}
              value={{ value: filters.specialization, label: filters.specialization || 'All Specialties' }}
              onChange={(option) => handleFilterChange('specialization', option.value)}
              placeholder="Select Specialty"
              isClearable
              className="w-full"
            />
          )}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search providers..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Providers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map((provider) => (
          <div
            key={`${provider.providerType}-${provider.id}`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-800">{provider.displayName}</h3>
            <p className="text-gray-600 font-medium">{provider.specialty}</p>
            {provider.contact && (
              <p className="text-gray-500 mt-2">{provider.contact}</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={() => {/* TODO: Implement booking/appointment functionality */}}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No providers found matching your criteria.
        </div>
      )}
    </div>
  );
} 