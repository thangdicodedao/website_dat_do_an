import { useMemo, useState } from 'react';
import { CheckCircle2, MessageSquareReply, Search, Star, XCircle } from 'lucide-react';
import { Button, Modal } from '../../components/common';
import { formatDate } from '../../utils';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface ReviewItem {
  id: string;
  productName: string;
  userName: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  createdAt: string;
  adminReply?: string;
}

const initialReviews: ReviewItem[] = [
  {
    id: 'rev-001',
    productName: 'Gà Rán Giòn Cay',
    userName: 'Nguyễn Văn A',
    rating: 5,
    content: 'Gà giòn ngon, giao nhanh. Sẽ ủng hộ tiếp!',
    status: 'pending',
    createdAt: '2026-04-07T09:30:00.000Z',
  },
  {
    id: 'rev-002',
    productName: 'Burger Bò Phô Mai',
    userName: 'Trần Thị B',
    rating: 4,
    content: 'Bánh ngon nhưng hơi ít sốt.',
    status: 'approved',
    createdAt: '2026-04-06T13:00:00.000Z',
    adminReply: 'Cảm ơn bạn, quán sẽ cải thiện phần sốt trong các đơn tiếp theo.',
  },
  {
    id: 'rev-003',
    productName: 'Pizza Hải Sản',
    userName: 'Lê Văn C',
    rating: 2,
    content: 'Đế bánh hơi khô, mong quán kiểm tra lại.',
    status: 'rejected',
    createdAt: '2026-04-05T18:22:00.000Z',
  },
];

const statusLabel: Record<ReviewStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const statusClass: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | ReviewStatus>('all');
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchStatus = activeStatus === 'all' || review.status === activeStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        review.productName.toLowerCase().includes(query) ||
        review.userName.toLowerCase().includes(query) ||
        review.content.toLowerCase().includes(query);

      return matchStatus && matchQuery;
    });
  }, [reviews, activeStatus, searchQuery]);

  const openDetail = (review: ReviewItem) => {
    setSelectedReview(review);
    setReplyDraft(review.adminReply || '');
  };

  const updateReviewStatus = (id: string, status: ReviewStatus) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
    setSelectedReview((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const saveReply = () => {
    if (!selectedReview) return;

    setReviews((prev) =>
      prev.map((review) =>
        review.id === selectedReview.id
          ? { ...review, adminReply: replyDraft.trim(), status: review.status === 'pending' ? 'approved' : review.status }
          : review
      )
    );

    setSelectedReview((prev) =>
      prev
        ? {
            ...prev,
            adminReply: replyDraft.trim(),
            status: prev.status === 'pending' ? 'approved' : prev.status,
          }
        : null
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo sản phẩm, khách hàng, nội dung..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'pending', label: 'Chờ duyệt' },
              { key: 'approved', label: 'Đã duyệt' },
              { key: 'rejected', label: 'Từ chối' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveStatus(item.key as 'all' | ReviewStatus)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  activeStatus === item.key
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-gray-500" colSpan={7}>
                    Không có đánh giá phù hợp
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{review.productName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{review.userName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className={`w-4 h-4 ${index < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[320px] truncate">{review.content}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[review.status]}`}>
                        {statusLabel[review.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(review.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openDetail(review)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          title="Duyệt và phản hồi"
                        >
                          <MessageSquareReply className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReviewStatus(review.id, 'approved')}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50"
                          title="Duyệt"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReviewStatus(review.id, 'rejected')}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                          title="Từ chối"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        title="Duyệt đánh giá"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Sản phẩm: <span className="font-medium text-gray-800">{selectedReview.productName}</span></p>
              <p className="text-sm text-gray-500">Khách hàng: <span className="font-medium text-gray-800">{selectedReview.userName}</span></p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
              {selectedReview.content}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phản hồi của admin</label>
              <textarea
                rows={4}
                value={replyDraft}
                onChange={(event) => setReplyDraft(event.target.value)}
                placeholder="Nhập phản hồi cho khách hàng..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => updateReviewStatus(selectedReview.id, 'rejected')}>
                Từ chối
              </Button>
              <Button variant="outline" onClick={() => updateReviewStatus(selectedReview.id, 'approved')}>
                Duyệt
              </Button>
              <Button onClick={saveReply}>Lưu phản hồi</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
