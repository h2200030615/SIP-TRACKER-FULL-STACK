import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select } from '@/components/UI';
import { Table, Alert } from '@/components/Common';
import { withAuthAndLayout } from '@/utils/middleware';
import { transactionAPI, investorAPI, sipAPI, fundAPI } from '@/services';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { RefreshCw } from 'lucide-react';

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [sips, setSIPs] = useState([]);
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterInvestor, setFilterInvestor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {

    setIsLoading(true);

    try {

      const [transRes, invRes, sipRes, fundRes] = await Promise.all([
        transactionAPI.getAll(),
        investorAPI.getAll(),
        sipAPI.getAll(),
        fundAPI.getAll(),
      ]);

      setTransactions(transRes.data || []);
      setInvestors(invRes.data || []);
      setSIPs(sipRes.data || []);
      setFunds(fundRes.data || []);
      setError('');

    } catch (err) {

      setError('Failed to load transactions');
      console.error(err);

    } finally {

      setIsLoading(false);

    }

  };

  const getStatusColor = (status) => {

    switch (status?.toLowerCase()) {

      case 'success':
        return 'success';

      case 'pending':
        return 'warning';

      case 'failed':
        return 'error';

      default:
        return 'gray';

    }

  };

  // Filter transactions
  const filteredTransactions =
    filterInvestor === ''
      ? transactions
      : transactions.filter(
          (t) => t.investor_id?.toString() === filterInvestor
        );

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Updated columns
  const columns = [
    {
      key: 'full_name',
      label: 'Investor Name',
    },
    {
      key: 'fund_name',
      label: 'Fund Name',
    },
    {
      key: 'transaction_amount',
      label: 'SIP Amount',
      render: (amount) => formatCurrency(amount),
    },
    {
      key: 'nav_at_purchase',
      label: 'NAV',
      render: (nav) => `₹${nav}`,
    },
    {
      key: 'units',
      label: 'Units',
    },
    {
      key: 'transaction_date',
      label: 'Date',
      render: (date) =>
        date ? formatDate(date) : 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge variant={getStatusColor(status)}>
          {status || 'Pending'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          SIP Transactions
        </h1>

        <p className="text-gray-600 mt-1">
          View and track all SIP transaction history
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Filters */}
      <Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Select
            label="Filter by Investor"
            options={[
              { value: '', label: 'All Investors' },

              ...investors.map((inv) => ({
                value: inv.investor_id,
                label: inv.full_name,
              })),
            ]}
            value={filterInvestor}
            onChange={(e) => {
              setFilterInvestor(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex items-end">

            <Button
              variant="outline"
              onClick={fetchAllData}
              className="w-full"
            >
              <RefreshCw size={18} /> Refresh
            </Button>

          </div>

        </div>

      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <p className="text-sm text-gray-600">
            Total Transactions
          </p>

          <p className="text-2xl font-bold text-primary mt-1">
            {filteredTransactions.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600">
            Successful
          </p>

          <p className="text-2xl font-bold text-success mt-1">
            {
              filteredTransactions.filter(
                (t) => t.status?.toLowerCase() === 'success'
              ).length
            }
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600">
            Total Amount Invested
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {
              formatCurrency(
                filteredTransactions.reduce(
                  (sum, t) =>
                    sum + (t.transaction_amount || 0),
                  0
                )
              )
            }
          </p>
        </Card>

      </div>

      {/* Transactions Table */}
      <Card>

        <Table
          columns={columns}
          data={paginatedTransactions}
          isLoading={isLoading}
          emptyMessage="No transactions found"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </Card>

    </div>
  );

};

export default withAuthAndLayout(Transactions);