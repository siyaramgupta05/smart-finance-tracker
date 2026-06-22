import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Tag, 
  Search, 
  Filter, 
  TrendingDown, 
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Receipt,
  PieChart,
  Layers
} from 'lucide-react';

const API_URL = 'http://localhost:8081/api/expenses';

const CATEGORIES = [
  { name: 'Food', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
  { name: 'Utilities', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa' },
  { name: 'Rent', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', text: '#c084fc' },
  { name: 'Entertainment', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399' },
  { name: 'Transport', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' },
  { name: 'Others', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa' }
];

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Filter/Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure the Spring Boot application is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 50) {
      errors.title = 'Title must be under 50 characters';
    }
    
    const parsedAmount = parseFloat(amount);
    if (!amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = 'Amount must be a positive number';
    }

    if (!category) {
      errors.category = 'Please select a category';
    }

    if (!date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      // Set hours to 0 to compare only dates
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        errors.date = 'Date cannot be in the future';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add Expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setError('');

    try {
      const newExpense = {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        date
      };
      const response = await axios.post(API_URL, newExpense);
      setExpenses([response.data, ...expenses]);
      
      // Reset form fields
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setFormErrors({});
      setSuccessMsg('Expense added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 400 
        ? 'Bad request: Please check your input fields.' 
        : 'Failed to save the expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(expenses.filter(exp => exp.id !== id));
      setSuccessMsg('Expense deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete the expense. Please check your backend.');
    }
  };

  // Filtering
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory ? exp.category === selectedFilterCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Analytics
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // Find top spending category
  let topCategoryName = 'N/A';
  let maxCatValue = 0;
  Object.keys(categoryTotals).forEach(cat => {
    if (categoryTotals[cat] > maxCatValue) {
      maxCatValue = categoryTotals[cat];
      topCategoryName = cat;
    }
  });

  // Chart Data preparation
  const chartData = CATEGORIES.map(cat => {
    const value = categoryTotals[cat.name] || 0;
    return { ...cat, value };
  }).filter(c => c.value > 0);

  const totalChartVal = chartData.reduce((sum, c) => sum + c.value, 0);

  // Generate SVG Donut slices
  let currentPercentage = 0;
  const donutSlices = chartData.map((slice) => {
    const percentage = slice.value / totalChartVal;
    const startAngle = currentPercentage * 360;
    currentPercentage += percentage;
    const endAngle = currentPercentage * 360;
    
    // Radians conversion
    const radStart = (startAngle - 90) * Math.PI / 180;
    const radEnd = (endAngle - 90) * Math.PI / 180;
    
    // Radius of outer arc is 38
    const r = 35;
    const cx = 50;
    const cy = 50;
    
    const x1 = cx + r * Math.cos(radStart);
    const y1 = cy + r * Math.sin(radStart);
    const x2 = cx + r * Math.cos(radEnd);
    const y2 = cy + r * Math.sin(radEnd);
    
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    
    // Return arc path details (single path using stroke-dasharray is easier, but standard arc path is robust)
    let path = '';
    if (percentage >= 0.999) {
      // Draw almost full circle path to avoid zero length errors
      path = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    } else {
      path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    }

    return {
      path,
      color: slice.color,
      name: slice.name,
      percentage: (percentage * 100).toFixed(1),
      value: slice.value
    };
  });

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Top Banner Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={fetchExpenses} 
            className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 flex items-center gap-3 animate-fade-in">
          <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {/* App Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
              $
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
              SmartFinance <span className="text-indigo-400">Tracker</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Monitor your budgets, check categories, and log daily expenses easily.</p>
        </div>
        
        <button 
          onClick={fetchExpenses}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/50 text-gray-200 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </header>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Expenses</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-gray-500">Aggregated spend across all logs</p>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Transactions</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {expenses.length}
          </h2>
          <p className="text-xs text-gray-500">Number of items recorded</p>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Top Category</span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {topCategoryName}
          </h2>
          <p className="text-xs text-gray-500">
            {maxCatValue > 0 
              ? `Max share: $${maxCatValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : 'No entries yet'}
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass p-6 rounded-2xl relative">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Add New Expense</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Expense Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Title</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Receipt className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Grocery Shopping"
                    className={`w-full bg-gray-900/60 border ${formErrors.title ? 'border-red-500/60 focus:ring-red-500/20' : 'border-gray-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all`}
                  />
                </div>
                {formErrors.title && (
                  <span className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.title}
                  </span>
                )}
              </div>

              {/* Amount & Category Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Amount ($)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                      <DollarSign className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full bg-gray-900/60 border ${formErrors.amount ? 'border-red-500/60 focus:ring-red-500/20' : 'border-gray-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all`}
                    />
                  </div>
                  {formErrors.amount && (
                    <span className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.amount}
                    </span>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                      <Tag className="w-4 h-4" />
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full bg-gray-900/60 border ${formErrors.category ? 'border-red-500/60 focus:ring-red-500/20' : 'border-gray-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-gray-900 text-gray-500">Select Category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name} className="bg-gray-900 text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.category && (
                    <span className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Date</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full bg-gray-900/60 border ${formErrors.date ? 'border-red-500/60 focus:ring-red-500/20' : 'border-gray-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 transition-all`}
                  />
                </div>
                {formErrors.date && (
                  <span className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.date}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Add Transaction
                  </>
                )}
              </button>
            </form>
          </div>

          {/* SVG Pie Chart Card */}
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Category Breakdown</h3>
            </div>

            {chartData.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 mx-auto mb-3">
                  <PieChart className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-400">No chart data available.</p>
                <p className="text-xs text-gray-500 mt-1">Add expenses to view breakdown.</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="35" fill="transparent" stroke="#1f2937" strokeWidth="12" />
                    {donutSlices.map((slice, i) => (
                      <path
                        key={i}
                        d={slice.path}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="12"
                        className="transition-all duration-500 hover:stroke-[14px] cursor-pointer"
                        title={`${slice.name}: ${slice.percentage}%`}
                      />
                    ))}
                  </svg>
                  {/* Center percentage label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-400 uppercase tracking-wider scale-90">Total</span>
                    <span className="text-lg font-extrabold text-white">${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 space-y-2">
                  {chartData.map((slice, idx) => {
                    const pct = ((slice.value / totalChartVal) * 100).toFixed(1);
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: slice.color }}
                          />
                          <span className="text-gray-300 font-medium">{slice.name}</span>
                        </div>
                        <div className="text-right pl-3">
                          <span className="text-white font-semibold">${slice.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          <span className="text-gray-500 text-xs block font-mono">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: List & Filter Logs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass p-6 rounded-2xl">
            {/* Search/Filter Controls Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-bold text-white">Expense History</h3>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search box */}
                <div className="relative flex-1 sm:flex-initial">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search expenses..."
                    className="w-full sm:w-48 bg-gray-900/60 border border-gray-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Filter dropdown */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Filter className="w-4 h-4" />
                  </span>
                  <select
                    value={selectedFilterCategory}
                    onChange={(e) => setSelectedFilterCategory(e.target.value)}
                    className="w-full sm:w-36 bg-gray-900/60 border border-gray-800 focus:border-indigo-500 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List content */}
            {loading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Loading expenses...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-gray-800/40 border border-gray-700/30 flex items-center justify-center text-gray-500 mx-auto mb-4">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-semibold">No transactions found</p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchTerm || selectedFilterCategory 
                    ? 'Try adjusting your search query or filters.' 
                    : 'Start by filling in the details on the left form!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-3 pt-1 pl-4">Title</th>
                      <th className="pb-3 pt-1">Category</th>
                      <th className="pb-3 pt-1">Date</th>
                      <th className="pb-3 pt-1 text-right pr-4">Amount</th>
                      <th className="pb-3 pt-1 text-center pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {filteredExpenses.map((exp) => {
                      const categoryObj = CATEGORIES.find(c => c.name === exp.category) || {
                        color: '#9ca3af',
                        bg: 'rgba(156, 163, 175, 0.1)',
                        text: '#9ca3af'
                      };

                      return (
                        <tr 
                          key={exp.id} 
                          className="hover:bg-gray-800/30 transition-all text-sm group"
                        >
                          <td className="py-4 pl-4 font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]" title={exp.title}>
                            {exp.title}
                          </td>
                          <td className="py-4">
                            <span 
                              className="px-2.5 py-1 rounded-full text-xs font-semibold inline-block"
                              style={{ 
                                backgroundColor: categoryObj.bg, 
                                color: categoryObj.text 
                              }}
                            >
                              {exp.category}
                            </span>
                          </td>
                          <td className="py-4 text-gray-400 text-xs font-medium">
                            {new Date(exp.date).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="py-4 text-right pr-4 font-bold text-white font-mono">
                            ${exp.amount.toFixed(2)}
                          </td>
                          <td className="py-4 text-center pr-4">
                            <button
                              onClick={() => handleDelete(exp.id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all scale-90 group-hover:opacity-100 duration-200"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
