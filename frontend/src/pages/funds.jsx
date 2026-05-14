import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '@/components/UI';
import { Table, Alert, Modal } from '@/components/Common';
import { withAuthAndLayout } from '@/utils/middleware';
import { fundAPI } from '@/services';
import { formatCurrency } from '@/utils/helpers';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

const FundManagement = () => {
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [viewingFund, setViewingFund] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    fundName: '',
    amcName: '',
    category: '',
    riskLevel: '',
    latestNAV: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    setIsLoading(true);
    try {
      const response = await fundAPI.getAll();
      setFunds(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load funds');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fundName) newErrors.fundName = 'Fund name is required';
    if (!formData.amcName) newErrors.amcName = 'AMC name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.riskLevel) newErrors.riskLevel = 'Risk level is required';
    if (!formData.latestNAV) newErrors.latestNAV = 'Latest NAV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingFund) {
        await fundAPI.update(editingFund.id, formData);
        setSuccess('Fund updated successfully');
      } else {
        await fundAPI.create(formData);
        setSuccess('Fund added successfully');
      }
      fetchFunds();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fund?')) {
      try {
        await fundAPI.delete(id);
        setSuccess('Fund deleted successfully');
        fetchFunds();
      } catch (err) {
        setError('Failed to delete fund');
      }
    }
  };

  const handleEdit = (fund) => {
    setEditingFund(fund);
    setFormData(fund);
    setShowModal(true);
  };

  const handleView = (fund) => {
    setViewingFund(fund);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      fundName: '',
      amcName: '',
      category: '',
      riskLevel: '',
      latestNAV: '',
    });
    setErrors({});
    setEditingFund(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(funds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFunds = funds.slice(startIndex, startIndex + itemsPerPage);

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'gray';
    }
  };

  const columns = [
    { key: 'fundName', label: 'Fund Name' },
    { key: 'amcName', label: 'AMC Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      render: (risk) => <Badge variant={getRiskColor(risk)}>{risk}</Badge>,
    },
    {
      key: 'latestNAV',
      label: 'NAV',
      render: (nav) => formatCurrency(nav),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="text-primary hover:text-primary-dark"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="text-error hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mutual Fund Management</h1>
          <p className="text-gray-600 mt-1">Add and manage mutual funds</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <Plus size={20} /> Add Fund
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      <Card>
        <Table
          columns={columns}
          data={paginatedFunds}
          isLoading={isLoading}
          emptyMessage="No funds found. Add one to get started!"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingFund ? 'Edit Fund' : 'Add New Fund'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fund Name"
              placeholder="HDFC Growth Fund"
              value={formData.fundName}
              onChange={(e) =>
                setFormData({ ...formData, fundName: e.target.value })
              }
              error={errors.fundName}
              required
            />
            <Input
              label="AMC Name"
              placeholder="HDFC Asset Management"
              value={formData.amcName}
              onChange={(e) =>
                setFormData({ ...formData, amcName: e.target.value })
              }
              error={errors.amcName}
              required
            />

            <Select
              label="Category"
              options={[
                { value: 'Equity', label: 'Equity' },
                { value: 'Debt', label: 'Debt' },
                { value: 'Balanced', label: 'Balanced' },
                { value: 'Liquid', label: 'Liquid' },
                { value: 'International', label: 'International' },
              ]}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              error={errors.category}
              required
            />
            <Select
              label="Risk Level"
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
              value={formData.riskLevel}
              onChange={(e) =>
                setFormData({ ...formData, riskLevel: e.target.value })
              }
              error={errors.riskLevel}
              required
            />

            <Input
              label="Latest NAV"
              type="number"
              placeholder="150.50"
              step="0.01"
              value={formData.latestNAV}
              onChange={(e) =>
                setFormData({ ...formData, latestNAV: e.target.value })
              }
              error={errors.latestNAV}
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingFund ? 'Update' : 'Add'} Fund
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Fund Details"
        size="md"
      >
        {viewingFund && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fund Name</p>
                <p className="font-semibold text-gray-900">{viewingFund.fundName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">AMC</p>
                <p className="font-semibold text-gray-900">{viewingFund.amcName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">{viewingFund.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <Badge variant={getRiskColor(viewingFund.riskLevel)}>
                  {viewingFund.riskLevel}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Latest NAV</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(viewingFund.latestNAV)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default withAuthAndLayout(FundManagement);
