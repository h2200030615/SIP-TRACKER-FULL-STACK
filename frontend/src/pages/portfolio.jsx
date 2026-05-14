import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge } from '@/components/UI';
import { Table, Alert } from '@/components/Common';
import { withAuthAndLayout } from '@/utils/middleware';
import { portfolioAPI, investorAPI, fundAPI, sipAPI } from '@/services';
import { formatCurrency, calculateProfit, calculateProfitPercentage } from '@/utils/helpers';
import { DollarSign } from 'lucide-react';

const Portfolio = () => {
  const [selectedInvestor, setSelectedInvestor] = useState('');
  const [investors, setInvestors] = useState([]);
  const [funds, setFunds] = useState([]);
  const [sips, setSIPs] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [invRes, fundRes, sipRes] = await Promise.all([
        investorAPI.getAll(),
        fundAPI.getAll(),
        sipAPI.getAll(),
      ]);

      const investorsList = invRes.data || [];
      setInvestors(investorsList);
      setFunds(fundRes.data || []);
      setSIPs(sipRes.data || []);

      // Set first investor as default
      if (investorsList.length > 0) {
        setSelectedInvestor(investorsList[0].id);
        fetchPortfolio(investorsList[0].id);
      }

      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPortfolio = async (investorId) => {
    if (!investorId) return;

    setIsLoading(true);
    try {
      // Get investor's SIPs
      const investorSIPs = sips.filter((sip) => sip.investorId === investorId);

      // Calculate portfolio holdings
      const holdings = investorSIPs.map((sip) => {
        const fund = funds.find((f) => f.id === sip.fundId);
        const navValue = fund?.latestNAV || 0;
        const totalUnits = Math.random() * 100; // Demo calculation
        const invested = sip.sipAmount * 12; // Rough estimate
        const currentValue = totalUnits * navValue;
        const profit = calculateProfit(invested, currentValue);
        const profitPercent = calculateProfitPercentage(invested, currentValue);

        return {
          fundName: fund?.fundName || 'N/A',
          totalUnits: totalUnits.toFixed(2),
          investedAmount: invested,
          currentNAV: navValue,
          currentValue: currentValue,
          profit: profit,
          profitPercent: profitPercent,
        };
      });

      setPortfolio(holdings);

      // Calculate totals
      const totalInv = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
      const totalCurr = holdings.reduce((sum, h) => sum + h.currentValue, 0);

      setTotalInvested(totalInv);
      setTotalCurrent(totalCurr);
      setNetWorth(totalCurr);

      setError('');
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvestorChange = (e) => {
    const investorId = e.target.value;
    setSelectedInvestor(investorId);
    fetchPortfolio(investorId);
  };

  const totalProfit = totalCurrent - totalInvested;
  const totalProfitPercent =
    totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;

  const profitColor = totalProfit >= 0 ? 'text-success' : 'text-error';

  const columns = [
    { key: 'fundName', label: 'Fund Name' },
    {
      key: 'totalUnits',
      label: 'Total Units',
      render: (units) => units,
    },
    {
      key: 'investedAmount',
      label: 'Invested Amount',
      render: (amount) => formatCurrency(amount),
    },
    {
      key: 'currentNAV',
      label: 'Current NAV',
      render: (nav) => formatCurrency(nav),
    },
    {
      key: 'currentValue',
      label: 'Current Value',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'profit',
      label: 'Profit/Loss',
      render: (profit) => (
        <span className={profit >= 0 ? 'text-success' : 'text-error'}>
          {formatCurrency(profit)}
        </span>
      ),
    },
    {
      key: 'profitPercent',
      label: 'Return %',
      render: (percent) => (
        <Badge variant={percent >= 0 ? 'success' : 'error'}>
          {percent.toFixed(2)}%
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Valuation</h1>
        <p className="text-gray-600 mt-1">View your complete portfolio and holdings</p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Investor Selection */}
      <Card>
        <Select
          label="Select Investor"
          options={investors.map((inv) => ({
            value: inv.id,
            label: inv.name,
          }))}
          value={selectedInvestor}
          onChange={handleInvestorChange}
        />
      </Card>

      {selectedInvestor && (
        <>
          {/* Net Worth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-primary">
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-primary mt-2">
                {formatCurrency(totalInvested)}
              </p>
            </Card>

            <Card className="border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {formatCurrency(totalCurrent)}
              </p>
            </Card>

            <Card className="border-l-4 border-success">
              <p className="text-sm font-medium text-gray-600">Profit/Loss</p>
              <p className={`text-2xl font-bold mt-2 ${profitColor}`}>
                {formatCurrency(totalProfit)}
              </p>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <p className="text-sm font-medium text-gray-600">Return</p>
              <p className={`text-2xl font-bold mt-2 ${profitColor}`}>
                {totalProfitPercent}%
              </p>
            </Card>
          </div>

          {/* Net Worth Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Net Worth</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(netWorth)}</p>
              </div>
              <DollarSign size={64} className="opacity-20" />
            </div>
          </Card>

          {/* Holdings Table */}
          <Card title="Your Holdings">
            <Table
              columns={columns}
              data={portfolio}
              isLoading={isLoading}
              emptyMessage="No holdings found"
            />
          </Card>

          {/* Summary Statistics */}
          {portfolio.length > 0 && (
            <Card title="Statistics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Best Performing Fund</p>
                  <p className="text-lg font-semibold mt-2">
                    {
                      portfolio.reduce((prev, current) =>
                        prev.profitPercent > current.profitPercent
                          ? prev
                          : current
                      ).fundName
                    }
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Average Return</p>
                  <p className="text-lg font-semibold mt-2">
                    {(
                      portfolio.reduce((sum, h) => sum + h.profitPercent, 0) /
                      portfolio.length
                    ).toFixed(2)}
                    %
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Total Holdings</p>
                  <p className="text-lg font-semibold mt-2">{portfolio.length}</p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default withAuthAndLayout(Portfolio);
