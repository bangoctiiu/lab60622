import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Clock, ArrowRight, Search, AlertCircle } from 'lucide-react';
import { ticketService } from '@/services/ticketService';
import { Ticket, TicketStatus } from '@/models/Ticket';

const TicketList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const data = await ticketService.getTickets();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-warning/10 text-warning border-warning/20';
      case 'InProgress': return 'bg-primary/10 text-primary border-primary/20';
      case 'Resolved': return 'bg-success/10 text-success border-success/20';
      case 'Closed': return 'bg-muted/10 text-muted border-muted/20';
      default: return 'bg-muted/10 text-muted';
    }
  };

  const filteredTickets = tickets.filter(t => 
    activeTab === 'active' ? t.status !== 'Closed' && t.status !== 'Resolved' : t.status === 'Closed' || t.status === 'Resolved'
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải yêu cầu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h2 font-bold">Hỗ trợ</h2>
        <button className="p-2 bg-white rounded-xl shadow-sm"><Search size={20} className="text-muted" /></button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-2xl shadow-sm">
        {['active', 'closed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'active' | 'closed')}
            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${
              activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted'
            }`}
          >
            {tab === 'active' ? 'Đang xử lý' : 'Đã hoàn tất'}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => navigate(`/portal/tickets/${ticket.id}`)}
              className="card-container p-5 bg-white border-none shadow-sm space-y-4 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1 pr-4">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{ticket.type} • {ticket.ticketCode}</p>
                  <p className="text-body font-bold line-clamp-1">{ticket.title}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(ticket.status)}`}>
                  {ticket.status}
                </div>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-muted/5 text-[11px]">
                <div className="flex items-center gap-2 text-muted">
                  <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-[13px] font-bold text-primary">
                  Chi tiết <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl opacity-50 space-y-2 border-2 border-dashed border-muted/10">
            <AlertCircle size={40} className="mx-auto text-muted" />
            <p className="text-body font-bold text-muted">Không có yêu cầu nào</p>
          </div>
        )}
      </div>

      {/* Create Button Float */}
      <div className="fixed bottom-24 right-6">
        <button 
          onClick={() => navigate('/portal/tickets/create')}
          className="w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
        >
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
};

export default TicketList;
