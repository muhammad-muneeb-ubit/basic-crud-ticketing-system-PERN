import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleTicket, updateTicket } from '../services/api';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
    case 'opened':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in progress':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TicketsDetails = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getSingleTicket(id);
        setTicket(data.data|| data.data); 
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  const handleResolve = async () => {
    if (!ticket) return;
    try {
      await updateTicket(id, { status: 'closed' });
      setTicket(prev => ({ ...prev, status: 'closed' }));
    } catch (error) {
      console.error('Failed to resolve ticket:', error);
      alert('Error resolving ticket');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="p-12 text-center text-red-500 font-medium">Ticket not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate('/tickets')}
        className="mb-6 flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        &larr; Back to Tickets
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-slate-200 p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ticket ID #{ticket.id}</span>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{ticket.title}</h1>
          </div>
          
          <div className="flex gap-3">
             {/* <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
               Edit
             </button> */}
             {role === 'admin' && ticket.status !== 'closed' && (
               <button 
                 onClick={handleResolve}
                 className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
               >
                 Resolve
               </button>
             )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Description</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <div className="space-y-6 bg-slate-50 rounded-xl p-6 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Created By</p>
              <p className="font-medium text-slate-900">{ticket.name || 'Unknown'}</p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Created At</p>
              <p className="font-medium text-slate-900">{new Date(ticket.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Last Updated</p>
              <p className="font-medium text-slate-900">{new Date(ticket.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsDetails;
