import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '../../utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Làm thế nào để đặt món?',
    answer: 'Bạn có thể đặt món bằng cách chọn món ăn mong muốn, thêm vào giỏ hàng, sau đó tiến hành thanh toán. Bạn cũng có thể quét QR code tại bàn để đặt món trực tiếp.',
  },
  {
    question: 'Các phương thức thanh toán được chấp nhận?',
    answer: 'Chúng tôi chấp nhận thanh toán qua tiền mặt (COD) và chuyển khoản qua VNPAY. Bạn có thể chọn phương thức phù hợp khi thanh toán.',
  },
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Thời gian giao hàng tùy thuộc vào khoảng cách và thời điểm đặt hàng. Thông thường giao hàng trong vòng 30-45 phút kể từ khi xác nhận đơn hàng.',
  },
  {
    question: 'Làm thế nào để theo dõi đơn hàng?',
    answer: 'Sau khi đặt hàng thành công, bạn sẽ nhận được mã đơn hàng. Bạn có thể theo dõi trạng thái đơn hàng trong phần "Lịch sử đơn hàng" hoặc liên hệ trực tiếp qua điện thoại.',
  },
  {
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Nếu sản phẩm có vấn đề về chất lượng hoặc không đúng như mô tả, bạn có thể yêu cầu đổi trả trong vòng 24 giờ kể từ khi nhận hàng. Vui lòng liên hệ hotline để được hỗ trợ.',
  },
  {
    question: 'Tôi có thể hủy đơn hàng không?',
    answer: 'Bạn có thể hủy đơn hàng trước khi đơn hàng được chế biến. Vui lòng liên hệ hotline hoặc sử dụng tính năng hủy đơn trong phần chi tiết đơn hàng.',
  },
  {
    question: 'Làm sao để được giảm giá?',
    answer: 'Chúng tôi thường xuyên có các chương trình khuyến mãi và giảm giá. Bạn có thể theo dõi các chương trình qua trang web, fanpage hoặc đăng ký nhận tin để cập nhật thông tin mới nhất.',
  },
  {
    question: 'Làm thế nào để trở thành đối tác?',
    answer: 'Nếu bạn muốn trở thành đối tác hoặc có câu hỏi về hợp tác, vui lòng liên hệ qua email hoặc điện thoại được cung cấp trong trang liên hệ. Chúng tôi sẽ phản hồi trong vòng 24-48 giờ.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Câu hỏi thường gặp</h1>
          <p className="text-gray-600">Tìm câu trả lời cho những thắc mắc của bạn</p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-40' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Vẫn còn thắc mắc?</h2>
            <p className="text-white/80 mb-4">Liên hệ với chúng tôi để được hỗ trợ</p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-white text-red-500 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
