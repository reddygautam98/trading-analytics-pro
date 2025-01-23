import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StockDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Close');
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    const mockStockData = [
      { Date: '2024-01-01', Close: 100, Volume: 1000000, Daily_Return: 0.5 },
      { Date: '2024-01-02', Close: 102, Volume: 1200000, Daily_Return: 1.2 },
      { Date: '2024-01-03', Close: 101, Volume: 950000, Daily_Return: -0.3 },
      { Date: '2024-01-04', Close: 103, Volume: 1100000, Daily_Return: 0.8 },
      { Date: '2024-01-05', Close: 105, Volume: 1300000, Daily_Return: 1.5 }
    ];

    setStockData(mockStockData);
    
    const mockAnalysis = {
      Total_Trading_Days: mockStockData.length,
      Average_Volume: 1110000,
      Average_Close_Price: 102.2,
      Lowest_Price: 100,
      Highest_Price: 105,
      Total_Return: 5,
      Average_Daily_Return: 0.74,
      Standard_Deviation_Returns: 0.59,
      Max_Daily_Gain: 1.5,
      Max_Daily_Loss: -0.3
    };

    setAnalysisResults(mockAnalysis);
  }, []);

  const renderChart = () => {
    const chartProps = {
      width: '100%',
      height: 300,
      data: stockData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    const chartStyles = {
      Close: { 
        stroke: '#3b82f6', 
        gradientFrom: 'rgba(59, 130, 246, 0.2)', 
        gradientTo: 'rgba(59, 130, 246, 0)'
      },
      Volume: { 
        fill: '#10b981', 
        gradientFrom: 'rgba(16, 185, 129, 0.2)', 
        gradientTo: 'rgba(16, 185, 129, 0)' 
      },
      Daily_Return: { 
        stroke: '#f43f5e', 
        gradientFrom: 'rgba(244, 63, 94, 0.2)', 
        gradientTo: 'rgba(244, 63, 94, 0)' 
      }
    };

    const currentStyle = chartStyles[selectedChart];

    switch (selectedChart) {
      case 'Close':
        return (
          <LineChart {...chartProps}>
            <defs>
              <linearGradient id="closeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentStyle.gradientFrom} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={currentStyle.gradientTo} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="Date" tick={{fill: '#6b7280'}} />
            <YAxis tick={{fill: '#6b7280'}} />
            <Tooltip 
              contentStyle={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
            />
            <Line 
              type="monotone" 
              dataKey="Close" 
              stroke={currentStyle.stroke} 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#closeGradient)"
              dot={{r: 4, strokeWidth: 2, stroke: currentStyle.stroke, fill: 'white'}}
            />
          </LineChart>
        );
      case 'Volume':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="Date" tick={{fill: '#6b7280'}} />
            <YAxis tick={{fill: '#6b7280'}} />
            <Tooltip 
              contentStyle={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
            />
            <Bar 
              dataKey="Volume" 
              fill={currentStyle.fill} 
              fillOpacity={0.7}
            />
          </BarChart>
        );
      case 'Daily_Return':
        return (
          <LineChart {...chartProps}>
            <defs>
              <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentStyle.gradientFrom} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={currentStyle.gradientTo} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="Date" tick={{fill: '#6b7280'}} />
            <YAxis tick={{fill: '#6b7280'}} />
            <Tooltip 
              contentStyle={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
            />
            <Line 
              type="monotone" 
              dataKey="Daily_Return" 
              stroke={currentStyle.stroke} 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#returnGradient)"
              dot={{r: 4, strokeWidth: 2, stroke: currentStyle.stroke, fill: 'white'}}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-500 text-white py-4">
            <CardTitle className="text-2xl font-bold">Stock Market Analysis Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-[180px] border-blue-500">
                  <SelectValue placeholder="Select Chart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Close">Close Price</SelectItem>
                  <SelectItem value="Volume">Volume</SelectItem>
                  <SelectItem value="Daily_Return">Daily Returns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              {renderChart()}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-green-500 text-white py-4">
            <CardTitle className="text-xl font-bold">Key Analysis Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(analysisResults).map(([key, value]) => (
                <div 
                  key={key} 
                  className="flex justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">{key.replace(/_/g, ' ')}:</span>
                  <span className="font-semibold text-blue-600">
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDashboard;
