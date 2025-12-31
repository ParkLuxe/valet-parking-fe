/**
 * Reports Page (Host)
 * Generate and view various reports
 */

import React, { useState } from 'react';
import { FileLineChart, Download } from 'lucide-react';
import { Card } from '../../components';
import { Button } from '../../components';
import { DateRangePicker } from '../../components';

const Reports = () => {
  // Date range for report filtering - TODO: Implement report generation with date range
  const [_dateRange, setDateRange] = useState({ start: '', end: '' });
  const reportTypes = [
    {
      id: 'daily',
      name: 'Daily Report',
      description: 'Daily vehicle throughput and revenue',
    },
    {
      id: 'weekly',
      name: 'Weekly Report',
      description: 'Weekly summary of operations',
    },
    {
      id: 'monthly',
      name: 'Monthly Report',
      description: 'Monthly performance metrics',
    },
    {
      id: 'valet',
      name: 'Valet Performance',
      description: 'Individual valet performance metrics',
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Detailed revenue breakdown',
    },
  ];

  const handleGenerateReport = (reportType) => {
    // TODO: Implement report generation logic
    // - Generate report based on reportType and selected date range
    // - Export as PDF/CSV
    // - Store in recent reports list
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-white/60">Generate and download various reports</p>
      </div>

      {/* Date Range Selector */}
      <Card title="Select Date Range">
        <DateRangePicker onDateChange={setDateRange} showPresets={true} />
      </Card>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="p-6" hover>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <FileLineChart className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {report.name}
                </h3>
                <p className="text-sm text-white/50 mb-4">{report.description}</p>
                <Button
                  variant="ghost"
                  size="small"
                  fullWidth
                  onClick={() => handleGenerateReport(report.id)}
                  startIcon={<Download className="w-4 h-4" />}
                >
                  Generate
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card title="Recent Reports" subtitle="Previously generated reports">
        <div className="text-white/50 text-center py-8">
          <p>No reports generated yet</p>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
