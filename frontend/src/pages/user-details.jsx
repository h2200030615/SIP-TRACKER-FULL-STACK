import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '@/components/UI';
import { Alert, Modal } from '@/components/Common';
import { withAuthAndLayout } from '@/utils/middleware';
import apiClient from '@/services/apiClient';
import { formatDate, capitalizeFirst } from '@/utils/helpers';
import { Search, Mail, Phone, MapPin, FileText, User, Calendar, ArrowLeft } from 'lucide-react';

const UserDetailsPage = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [investor, setInvestor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setSearched(true);

    try {
      const response = await apiClient.get('/investors/search/email', {
        params: { email: searchEmail }
      });
      
      setInvestor(response.data);
      setSuccess('Investor found!');
    } catch (err) {
      setInvestor(null);
      setError(err.response?.data?.message || 'No investor found with this email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchEmail('');
    setInvestor(null);
    setError('');
    setSuccess('');
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Details Search</h1>
          <p className="text-gray-600">Find investor information by email address</p>
        </div>

        {/* Search Card */}
        <Card className="mb-8">
          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline mr-2 w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter investor email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"
                  >
                    <Search className="w-4 h-4" />
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                  {searched && (
                    <Button
                      onClick={handleReset}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Alert Messages */}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}
        {success && investor && (
          <Alert type="success" className="mb-6">
            {success}
          </Alert>
        )}

        {/* Investor Details Card */}
        {investor && (
          <Card className="mb-8">
            <div className="p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {investor.full_name || 'N/A'}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        ID: {investor.investor_id}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Email</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.email || 'N/A'}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-600">Phone</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.phone_no || 'N/A'}
                  </p>
                </div>

                {/* PAN Card */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-semibold text-gray-600">PAN Card</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.pancard_no || 'N/A'}
                  </p>
                </div>

                {/* Created Date */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-600">Joined Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.created_at ? formatDate(investor.created_at) : 'N/A'}
                  </p>
                </div>

                {/* Address */}
                <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-600">Address</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.address || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Summary Box */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                <p className="text-gray-600 text-sm">
                  This investor profile contains all the essential information registered in the system.
                  To view portfolio holdings and transactions, navigate to the respective sections.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {searched && !investor && !isLoading && (
          <Card className="text-center p-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Investor Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find an investor with the email "<strong>{searchEmail}</strong>"
            </p>
            <Button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4" />
              Try Another Search
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default withAuthAndLayout(UserDetailsPage);
