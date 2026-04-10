import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, RefreshCcw, Send, User } from 'lucide-react';
import { Button } from '../../components/common';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'bot';
  timestamp: string;
  image?: string;
}

const STORAGE_KEY = 'chat_messages';

const seedMessages: ChatMessage[] = [
  {
    id: 'seed-1',
    text: 'Xin chào! Tôi cần hỗ trợ về đơn hàng #DH20260410',
    sender: 'user',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    text: 'Chào bạn, admin đã nhận được tin nhắn. Mình sẽ kiểm tra ngay nhé.',
    sender: 'admin',
    timestamp: new Date().toISOString(),
  },
];

const loadMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedMessages;

    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedMessages;
    }

    return parsed;
  } catch {
    return seedMessages;
  }
};

const saveMessages = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore write errors
  }
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const loaded = loadMessages();
    setMessages(loaded);
  }, []);

  const customerMessages = useMemo(
    () => messages.filter((message) => message.sender === 'user').length,
    [messages]
  );

  const latestMessageTime = useMemo(() => {
    if (messages.length === 0) return '-';
    return new Date(messages[messages.length - 1].timestamp).toLocaleString('vi-VN');
  }, [messages]);

  const refreshMessages = () => {
    setMessages(loadMessages());
  };

  const sendReply = () => {
    const text = draft.trim();
    if (!text) return;

    const nextMessage: ChatMessage = {
      id: `admin-${Date.now()}`,
      text,
      sender: 'admin',
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, nextMessage];
    setMessages(updated);
    saveMessages(updated);
    setDraft('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 md:gap-6">
      <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Hội thoại khách hàng</h3>

        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-red-100 flex items-center justify-center">
              <User className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Khách vãng lai</p>
              <p className="text-xs text-gray-500">Tin nhắn từ widget chat</p>
              <p className="text-xs text-gray-500 mt-1">Tin khách: {customerMessages}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Cập nhật gần nhất: {latestMessageTime}
        </div>

        <Button variant="outline" className="w-full mt-3" onClick={refreshMessages}>
          <RefreshCcw className="w-4 h-4 mr-1" /> Làm mới
        </Button>
      </aside>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-140">
        <header className="px-4 md:px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Nhắn tin với khách hàng</h2>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Trực tuyến</span>
        </header>

        <div className="flex-1 p-4 md:p-5 overflow-y-auto bg-gray-50 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có tin nhắn nào.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.sender === 'user'
                      ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                      : message.sender === 'bot'
                        ? 'bg-blue-50 text-blue-900 border border-blue-100 rounded-br-md'
                        : 'bg-red-500 text-white rounded-br-md'
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Hình ảnh khách gửi"
                      className="max-w-full max-h-44 rounded-lg mb-2 object-contain bg-black/5"
                    />
                  )}
                  <p>{message.text}</p>
                  <p className={`text-[11px] mt-1 ${message.sender === 'admin' ? 'text-red-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 md:p-4 border-t border-gray-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                sendReply();
              }
            }}
            placeholder="Nhập phản hồi cho khách hàng..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
          <Button onClick={sendReply}>
            <Send className="w-4 h-4 mr-1" /> Gửi
          </Button>
        </div>
      </section>
    </div>
  );
}
