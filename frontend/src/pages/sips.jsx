import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '@/components/UI';
import { Table, Alert, Modal } from '@/components/Common';
import { withAuthAndLayout } from '@/utils/middleware';
import { sipAPI, investorAPI, fundAPI } from '@/services';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const SIPRegistration = () => {
  const [sips, setSIPs] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSIP, setEditingSIP] = useState(null);
  const [viewingSIP, setViewingSIP] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    investorId: '',
    fundId: '',
    sipAmount: '',
    executionDate: '',
    startDate: '',
    endDate: '',
    frequency: 'Monthly',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [sipsRes, investorsRes, fundsRes] = await Promise.all([
        sipAPI.getAll(),
        investorAPI.getAll(),
        fundAPI.getAll(),
      ]);

      setSIPs(sipsRes.data || []);
      setInvestors(investorsRes.data || []);
      setFunds(fundsRes.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.investorId) newErrors.investorId = 'Investor is required';
    if (!formData.fundId) newErrors.fundId = 'Fund is required';
    if (!formData.sipAmount) newErrors.sipAmount = 'SIP amount is required';
    if (formData.sipAmount <= 0) newErrors.sipAmount = 'SIP amount must be positive';
    if (!formData.executionDate) newErrors.executionDate = 'Execution date is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingSIP) {
        await sipAPI.update(editingSIP.id, formData);
        setSuccess('SIP updated successfully');
      } else {
        await sipAPI.create(formData);
        setSuccess('SIP registered successfully');
      }
      fetchAllData();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this SIP?')) {
      try {
        await sipAPI.delete(id);
        setSuccess('SIP deleted successfully');
        fetchAllData();
      } catch (err) {
        setError('Failed to delete SIP');
      }
    }
  };

  const handleEdit = (sip) => {
    setEditingSIP(sip);
    setFormData(sip);
    setShowModal(true);
  };

  const handleView = (sip) => {
    setViewingSIP(sip);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      investorId: '',
      fundId: '',
      sipAmount: '',
      executionDate: '',
      startDate: '',
      endDate: '',
      frequency: 'Monthly',
    });
    setErrors({});
    setEditingSIP(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(sips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSIPs = sips.slice(startIndex, startIndex + itemsPerPage);

  const getInvestorName = (investorId) => {
    return investors.find((i) => i.id === investorId)?.name || 'N/A';
  };

  const getFundName = (fundId) => {
    return funds.find((f) => f.id === fundId)?.fundName || 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'error';
      default:
        return 'gray';
    }
  };

  const columns = [
    {
      key: 'investorId',
      label: 'Investor',
      render: (investorId) => getInvestorName(investorId),
    },
    {
      key: 'fundId',
      label: 'Fund',
      render: (fundId) => getFundName(fundId),
    },
    {
      key: 'sipAmount',
      label: 'SIP Amount',
      render: (amount) => formatCurrency(amount),
    },
    {
      key: 'executionDate',
      label: 'Execution Date',
      render: (date) => formatDate(date),
    },
    {
      key: 'frequency',
      label: 'Frequency',
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
          <h1 className="text-3xl font-bold text-gray-900">SIP Registration</h1>
          <p className="text-gray-600 mt-1">Register and manage Systematic Investment Plans</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <Plus size={20} /> Register SIP
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
          data={paginatedSIPs}
          isLoading={isLoading}
          emptyMessage="No SIPs found. Register one to get started!"
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
        title={editingSIP ? 'Edit SIP' : 'Register New SIP'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Investor"
              options={investors.map((inv) => ({
                value: inv.id,
                label: inv.name,
              }))}
              value={formData.investorId}
              onChange={(e) =>
                setFormData({ ...formData, investorId: e.target.value })
              }
              error={errors.investorId}
              required
            />
            <Select
              label="Mutual Fund"
              options={funds.map((fund) => ({
                value: fund.id,
                label: fund.fundName,
              }))}
              value={formData.fundId}
              onChange={(e) =>
                setFormData({ ...formData, fundId: e.target.value })
              }
              error={errors.fundId}
              required
            />

            <Input
              label="SIP Amount"
              type="number"
              placeholder="5000"
              step="100"
              value={formData.sipAmount}
              onChange={(e) =>
                setFormData({ ...formData, sipAmount: e.target.value })
              }
              error={errors.sipAmount}
              required
            />
            <Select
              label="Frequency"
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Half-Yearly', label: 'Half-Yearly' },
                { value: 'Yearly', label: 'Yearly' },
              ]}
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
            />

            <Input
              label="Execution Date"
              type="date"
              value={formData.executionDate}
              onChange={(e) =>
                setFormData({ ...formData, executionDate: e.target.value })
              }
              error={errors.executionDate}
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              error={errors.startDate}
              required
            />

            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              error={errors.endDate}
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
              {editingSIP ? 'Update' : 'Register'} SIP
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="SIP Details"
        size="md"
      >
        {viewingSIP && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Investor</p>
                <p className="font-semibold text-gray-900">{getInvestorName(viewingSIP.investorId)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fund</p>
                <p className="font-semibold text-gray-900">{getFundName(viewingSIP.fundId)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SIP Amount</p>
                <p className="font-semibold text-gray-900">{formatCurrency(viewingSIP.sipAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-semibold text-gray-900">{viewingSIP.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-900">{formatDate(viewingSIP.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold text-gray-900">{formatDate(viewingSIP.endDate)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default withAuthAndLayout(SIPRegistration);
