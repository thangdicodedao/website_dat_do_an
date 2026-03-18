import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Bot, Minimize2, Image, X } from 'lucide-react';
import { cn } from '../../utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'bot';
  timestamp: string;
  image?: string;
}

const STORAGE_KEY = 'chat_messages';
const MAX_MESSAGES = 20;

const defaultMessages: Message[] = [
  {
    id: '1',
    text: 'Xin chào! Tôi là chatbot của Bình Bún Bò. Tôi có thể giúp gì cho bạn?',
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.length > 0 ? parsed : defaultMessages;
    }
  } catch {
    // ignore
  }
  return defaultMessages;
};

const saveMessages = (messages: Message[]) => {
  try {
    // Keep only the latest MAX_MESSAGES
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bot' | 'admin'>('bot');
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendWithImage = () => {
    if (!selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText || '[Hình ảnh]',
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveMessages(newMessages);
      return newMessages;
    });

    if (selectedImage) {
      const imageMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '[Hình ảnh]',
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => {
        const newMessages = [...prev, { ...imageMessage, image: selectedImage }];
        saveMessages(newMessages);
        return newMessages;
      });
    }

    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (activeTab === 'bot') {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Cảm ơn bạn đã gửi hình ảnh! Chúng tôi sẽ xem và phản hồi sớm nhất có thể.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => {
          const newMessages = [...prev, botMessage];
          saveMessages(newMessages);
          return newMessages;
        });
      }, 500);
    }
  };

  // Bot responses
  const botResponses = [
    { keywords: ['xin chào', 'hello', 'hi', 'chào'], response: 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần giúp gì?' },
    { keywords: ['giờ mở cửa', 'giờ hoạt động', 'mấy giờ'], response: 'Chúng tôi hoạt động từ 7:00 - 22:00 hàng ngày!' },
    { keywords: ['giao hàng', 'ship', 'vận chuyển'], response: 'Chúng tôi giao hàng tận nơi! Phí ship chỉ 15.000đ trong nội thành.' },
    { keywords: ['đặt hàng', 'order', 'mua'], response: 'Bạn có thể đặt hàng trực tiếp trên website hoặc gọi điện cho chúng tôi. Bạn muốn đặt món gì?' },
    { keywords: ['thanh toán', 'payment', 'trả tiền'], response: 'Chúng tôi hỗ trợ thanh toán COD (tiền mặt khi nhận hàng) và VNPAY.' },
    { keywords: ['đổi trả', 'hoàn tiền', 'refund'], response: 'Bạn vui lòng xem chính sách đổi trả tại mục "Chính sách đổi trả" trên website nhé.' },
    { keywords: ['liên hệ', 'contact', 'số điện thoại', 'phone'], response: 'Bạn có thể liên hệ: 0123 456 789 hoặc chat trực tiếp với admin.' },
    { keywords: ['cảm ơn', 'thanks', 'thank'], response: 'Không có gì! Chúc bạn ngon miệng!' },
  ];

  const getBotResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    for (const rule of botResponses) {
      if (rule.keywords.some(keyword => lowerText.includes(keyword))) {
        return rule.response;
      }
    }
    return 'Cảm ơn bạn đã nhắn tin! Để lại lời nhắn, admin sẽ phản hồi sớm nhất có thể.';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveMessages(newMessages);
      return newMessages;
    });
    setInputText('');

    if (activeTab === 'bot') {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputText),
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => {
          const newMessages = [...prev, botMessage];
          saveMessages(newMessages);
          return newMessages;
        });
      }, 500);
    } else {
      // Admin chat - simulate admin response
      setTimeout(() => {
        const adminMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Cảm ơn bạn đã liên hệ! Admin sẽ phản hồi trong giây lát.',
          sender: 'admin',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => {
          const newMessages = [...prev, adminMessage];
          saveMessages(newMessages);
          return newMessages;
        });
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-2 md:right-6 z-50 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center justify-center animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-2 md:right-6 z-50 w-[95%] sm:w-[400px] lg:w-96 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 h-[80vh] md:h-[500px]">
          {/* Header */}
          <div className="bg-red-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Hỗ trợ trực tuyến</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-red-600 rounded-lg transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => { setActiveTab('bot'); setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2',
                activeTab === 'bot' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Bot className="w-4 h-4" />
              Chatbot
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2',
                activeTab === 'admin' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <User className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender !== 'user' && (
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    message.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  )}>
                    {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                )}
                <div className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-2',
                  message.sender === 'user'
                    ? 'bg-red-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                )}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared"
                      className="max-w-full rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    message.sender === 'user' ? 'text-red-200' : 'text-gray-400'
                  )}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white">
            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="relative mb-2">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-32 rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {activeTab === 'admin' && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                </>
              )}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                onClick={selectedImage ? handleSendWithImage : handleSendMessage}
                disabled={(!inputText.trim() && !selectedImage) || (activeTab === 'bot' && !!selectedImage)}
                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
