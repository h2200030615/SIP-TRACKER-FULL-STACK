import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '@/components/UI';
import { Table, Alert, Modal } from '@/components/Common';
import { withAuthAndLayout } from '@/utils/middleware';
import { investorAPI } from '@/services';
import { calculateAge, formatDate } from '@/utils/helpers';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

const InvestorManagement = () => {
  const [investors, setInvestors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [viewingInvestor, setViewingInvestor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    pancard_no: '',
    adhaarcard_no: '',
    passport_no: '',
    date_of_birth: '',
    gender: '',
    occupation: '',
    email: '',
    phone_no: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    setIsLoading(true);
    try {
      const response = await investorAPI.getAll();
      setInvestors(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load investors');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone_no) newErrors.phone_no = 'Phone is required';
    if (!formData.pancard_no) newErrors.pancard_no = 'PAN is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'DOB is required';
    if (formData.phone_no && formData.phone_no.length < 10) newErrors.phone_no = 'Phone must be at least 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingInvestor) {
        await investorAPI.update(editingInvestor.id, formData);
        setSuccess('Investor updated successfully');
      } else {
        await investorAPI.create(formData);
        setSuccess('Investor added successfully');
      }
      fetchInvestors();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this investor?')) {
      try {
        await investorAPI.delete(id);
        setSuccess('Investor deleted successfully');
        fetchInvestors();
      } catch (err) {
        setError('Failed to delete investor');
      }
    }
  };

  const handleEdit = (investor) => {
    setEditingInvestor(investor);
    setFormData(investor);
    setShowModal(true);
  };

  const handleView = (investor) => {
    setViewingInvestor(investor);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      full_name: '',
      pancard_no: '',
      adhaarcard_no: '',
      passport_no: '',
      date_of_birth: '',
      gender: '',
      occupation: '',
      email: '',
      phone_no: '',
      address: '',
    });
    setErrors({});
    setEditingInvestor(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(investors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvestors = investors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    { 
      key: 'first_name', 
      label: 'Name',
      render: (first_name, row) => `${row.first_name || ''} ${row.middle_name || ''} ${row.last_name || ''}`.trim()
    },
    { key: 'email', label: 'Email' },
    { key: 'phone_no', label: 'Phone' },
    { key: 'pancard_no', label: 'PAN' },
    { key: 'gender', label: 'Gender' },
    { key: 'occupation', label: 'Occupation' },
    {
      key: 'id',
      label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="text-primary hover:text-primary-dark"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="text-error hover:text-red-700"
            title="Delete"
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
          <h1 className="text-3xl font-bold text-gray-900">Investor Management</h1>
          <p className="text-gray-600 mt-1">Manage your investors and their information</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <Plus size={20} /> Add Investor
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
          data={paginatedInvestors}
          isLoading={isLoading}
          emptyMessage="No investors found. Add one to get started!"
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
        title={editingInvestor ? 'Edit Investor' : 'Add New Investor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              error={errors.first_name}
              required
            />
            <Input
              label="Middle Name"
              placeholder="Kumar"
              value={formData.middle_name}
              onChange={(e) =>
                setFormData({ ...formData, middle_name: e.target.value })
              }
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              error={errors.last_name}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              required
            />

            <Input
              label="Phone Number"
              placeholder="9876543210"
              value={formData.phone_no}
              onChange={(e) =>
                setFormData({ ...formData, phone_no: e.target.value })
              }
              error={errors.phone_no}
              required
            />
            <Input
              label="PAN"
              placeholder="ABCDE1234F"
              value={formData.pancard_no}
              onChange={(e) =>
                setFormData({ ...formData, pancard_no: e.target.value })
              }
              error={errors.pancard_no}
              required
            />

            <Input
              label="Aadhaar Number"
              placeholder="123456789012"
              value={formData.adhaarcard_no}
              onChange={(e) =>
                setFormData({ ...formData, adhaarcard_no: e.target.value })
              }
            />
            <Input
              label="Passport Number"
              placeholder="P1234567"
              value={formData.passport_no}
              onChange={(e) =>
                setFormData({ ...formData, passport_no: e.target.value })
              }
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              error={errors.date_of_birth}
              required
            />

            <Select
              label="Gender"
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            />
            <Input
              label="Occupation"
              placeholder="Software Engineer"
              value={formData.occupation}
              onChange={(e) =>
                setFormData({ ...formData, occupation: e.target.value })
              }
            />
            <Input
              label="Address"
              placeholder="123 Main St, City"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
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
              {editingInvestor ? 'Update' : 'Add'} Investor
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Investor Details"
        size="lg"
      >
        {viewingInvestor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Middle Name</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.middle_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.phone_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PAN</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.pancard_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aadhaar</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.adhaarcard_no || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Passport</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.passport_no || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-semibold text-gray-900">{formatDate(viewingInvestor.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupation</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.occupation || '-'}</p>
              </div>
              <div className="col-span-2 md:col-span-3">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-900">{viewingInvestor.address || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default withAuthAndLayout(InvestorManagement);
