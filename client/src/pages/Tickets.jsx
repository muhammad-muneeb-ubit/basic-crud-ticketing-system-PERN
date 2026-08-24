import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTickets, deleteTicket, updateTicket, specificUserTickets } from '../services/api';

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

const Tickets = ({ role }) => {


  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let data;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.data.role === 'admin') {
          data = await getAllTickets();
        } else {
          const userId = user.data.id || user.data._id;
          data = await specificUserTickets(userId);
        }
      } else {
        data = await getAllTickets();
      }

      setTickets(Array.isArray(data.data) ? data.data : data.data || []);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await deleteTicket(id);
      setTickets(tickets.filter((t) => t.id !== id && t._id !== id));
    } catch (error) {
      console.error('Failed to delete ticket', error);
      alert('Error deleting ticket');
    }
  };

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editingTicket.id || editingTicket._id;
    try {
      await updateTicket(id, {
        title: editingTicket.title,
        description: editingTicket.description,
        status: editingTicket.status,
      });
      setTickets(tickets.map(t => (t.id === id || t._id === id ? editingTicket : t)));
      setEditingTicket(null);
    } catch (error) {
      console.error('Failed to update ticket', error);
      alert('Error updating ticket');
    }
  };

  const handleEditChange = (e) => {
    setEditingTicket({ ...editingTicket, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tickets</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Manage and view all system tickets</p>
          </div>
          {/* <button
            onClick={() => navigate('/tickets/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-indigo-200 transition-colors"
          >
            Create Ticket
          </button> */}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Created By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">Created At</th>
                  {role == 'admin' && (<th className="px-6 py-4 text-right">Actions</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading tickets...</td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No tickets found.</td>
                  </tr>
                ) : (
                  tickets.map((ticket) => {
                    const tId = ticket.id || ticket._id;
                    return (
                      <tr key={tId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {tId.toString().slice(-6)}
                        </td>
                        <Link to={`/tickets/${tId}`} className="hover:text-indigo-600 underline decoration-indigo-300 underline-offset-4 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">{ticket.title}</td>
                        </Link>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={ticket.description}>
                          {ticket.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{ticket.name || ticket.user_id || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        {role == 'admin' && (<td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEditClick(ticket)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-4 transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(tId)}
                            className="text-red-600 hover:text-red-900 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>)}
                      </tr>
                    );
                  })
                )}
              </tbody>
              {/* <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-slate-500">
                    Showing {tickets.length} of {tickets.length} tickets
                  </td>
                </tr>
              </tfoot> */}
            </table>
          </div>
            <div className="px-6 py-4 text-center text-slate-500 border-t border-slate-200">
              Showing {tickets.length} of {tickets.length} tickets
            </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Update Ticket</h3>
              <button onClick={() => setEditingTicket(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={editingTicket.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={editingTicket.description}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingTicket.status}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all outline-none capitalize"
                >
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
