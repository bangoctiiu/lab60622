import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, User } from 'lucide-react';
import { ticketService } from '@/services/ticketService';
import { Ticket, TicketComment } from '@/models/Ticket';

const TicketDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [ticketData, commentData] = await Promise.all([
          ticketService.getTicketDetail(id),
          ticketService.getTicketComments(id)
        ]);
        setTicket(ticketData);
        setComments(commentData);
      } catch (error) {
        console.error('Error fetching ticket detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSend = async () => {
    if (!newComment.trim() || !id) return;
    try {
      const sent = await ticketService.addComment(id, newComment);
      setComments([...comments, sent]);
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải hội thoại...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-bg flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-muted/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <div className="text-center">
          <p className="text-body font-bold">Yêu cầu {ticket.ticketCode}</p>
          <p className="text-[10px] text-muted font-bold uppercase">{ticket.title}</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
        <div className="text-center py-2">
          <span className="px-3 py-1 bg-white rounded-lg text-[11px] font-bold text-muted shadow-sm uppercase tracking-wider">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Initial Description as first message */}
        <div className="flex justify-end gap-3">
          <div className="max-w-[80%] space-y-1">
            <div className="p-4 rounded-2xl shadow-sm text-small font-medium bg-primary text-white rounded-tr-none">
              {ticket.description}
            </div>
            <p className="text-[10px] text-muted font-medium text-right">
              {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {comments.map((msg, i) => (
          <div key={msg.id} className={`flex ${msg.authorRole === 'Staff' ? 'justify-start' : 'justify-end'} gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.authorRole === 'Staff' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">
                <User size={16} />
              </div>
            )}
            <div className="max-w-[80%] space-y-1">
              <div className={`p-4 rounded-2xl shadow-sm text-small font-medium ${
                msg.authorRole !== 'Staff' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-dark rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              <p className={`text-[10px] text-muted font-medium ${msg.authorRole !== 'Staff' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {ticket.status === 'Resolved' && (
          <div className="flex items-center gap-3 py-4 opacity-50">
            <div className="h-px flex-1 bg-muted/20"></div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted italic">
              <CheckCircle2 size={12} /> Yêu cầu đã được giải quyết
            </div>
            <div className="h-px flex-1 bg-muted/20"></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {ticket.status !== 'Closed' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-muted/10">
          <div className="flex gap-3 bg-bg rounded-2xl p-2 items-center">
            <input 
              type="text" 
              placeholder="Nhập nội dung phản hồi..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-transparent px-4 py-2 border-none focus:ring-0 text-small font-medium"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
