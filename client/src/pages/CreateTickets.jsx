import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/api';

const CreateTickets = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    user_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setFormData(prev => ({ ...prev, user_id: user.data.id || user._id || '' }));
      }
    } catch (err) {
      console.error('Error parsing user from local storage', err);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTicket(formData);
      navigate('/tickets');
    } catch (error) {
      console.error('Failed to create ticket', error);
      alert('Failed to create ticket. Please check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create New Ticket</h1>
          <p className="text-slate-500 mt-1 text-sm">Please provide the details of your issue below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID (Hidden or Read-only) */}
          <div className="hidden">
            <input type="hidden" name="user_id" value={formData.user_id} />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Cannot access the dashboard"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe your issue in detail..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Status
            </label>
            <input
              id="status"
              name="status"
              type="text"
              disabled
              value={formData.status}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed capitalize font-medium"
            />
            <p className="text-xs text-slate-400 mt-1">New tickets are opened by default.</p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors ${
                isSubmitting ? 'bg-indigo-400 text-indigo-100 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTickets;
