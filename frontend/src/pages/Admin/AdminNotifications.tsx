import { useMemo, useState } from 'react';
import { Bell, Plus, Search, Send, Trash2 } from 'lucide-react';
import { Button, Modal } from '../../components/common';
import { formatDate } from '../../utils';

type NotificationStatus = 'draft' | 'scheduled' | 'sent';
type NotificationChannel = 'app' | 'email' | 'sms';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  channel: NotificationChannel;
  audience: string;
  status: NotificationStatus;
  scheduledAt?: string;
  createdAt: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'noti-001',
    title: 'Khuyến mãi cuối tuần',
    content: 'Giảm 15% cho tất cả combo từ 18h-22h.',
    channel: 'app',
    audience: 'Tất cả khách hàng',
    status: 'sent',
    createdAt: '2026-04-08T10:20:00.000Z',
  },
  {
    id: 'noti-002',
    title: 'Bảo trì hệ thống',
    content: 'Hệ thống sẽ bảo trì từ 02:00 đến 03:00 ngày mai.',
    channel: 'email',
    audience: 'Quản trị viên',
    status: 'scheduled',
    scheduledAt: '2026-04-11T02:00:00.000Z',
    createdAt: '2026-04-09T11:00:00.000Z',
  },
];

const statusClass: Record<NotificationStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-amber-100 text-amber-700',
  sent: 'bg-green-100 text-green-700',
};

const statusLabel: Record<NotificationStatus, string> = {
  draft: 'Bản nháp',
  scheduled: 'Đã hẹn',
  sent: 'Đã gửi',
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    channel: 'app' as NotificationChannel,
    audience: 'Tất cả khách hàng',
    status: 'draft' as NotificationStatus,
    scheduledAt: '',
  });

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notifications;

    return notifications.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.audience.toLowerCase().includes(query)
    );
  }, [notifications, searchQuery]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      content: '',
      channel: 'app',
      audience: 'Tất cả khách hàng',
      status: 'draft',
      scheduledAt: '',
    });
    setShowModal(true);
  };

  const openEdit = (item: NotificationItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      channel: item.channel,
      audience: item.audience,
      status: item.status,
      scheduledAt: item.scheduledAt || '',
    });
    setShowModal(true);
  };

  const saveNotification = () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung thông báo');
      return;
    }

    if (editingId) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                scheduledAt: form.scheduledAt || undefined,
              }
            : item
        )
      );
    } else {
      setNotifications((prev) => [
        {
          id: `noti-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...form,
          scheduledAt: form.scheduledAt || undefined,
        },
        ...prev,
      ]);
    }

    setShowModal(false);
  };

  const removeNotification = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const sendNow = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'sent', scheduledAt: undefined } : item))
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm thông báo..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" /> Tạo thông báo
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kênh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đối tượng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hẹn gửi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tạo lúc</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">Không có thông báo</td>
                </tr>
              ) : (
                filteredNotifications.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[320px]">{item.content}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 uppercase">{item.channel}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.audience}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[item.status]}`}>
                        {statusLabel[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.scheduledAt ? formatDate(item.scheduledAt) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          title="Sửa"
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => sendNow(item.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50"
                          title="Gửi ngay"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeNotification(item.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Sửa thông báo' : 'Tạo thông báo'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề *</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung *</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kênh</label>
              <select
                value={form.channel}
                onChange={(event) => setForm((prev) => ({ ...prev, channel: event.target.value as NotificationChannel }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              >
                <option value="app">App</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as NotificationStatus }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              >
                <option value="draft">Bản nháp</option>
                <option value="scheduled">Đã hẹn</option>
                <option value="sent">Đã gửi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hẹn gửi</label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => setForm((prev) => ({ ...prev, scheduledAt: event.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Đối tượng nhận</label>
            <input
              type="text"
              value={form.audience}
              onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button onClick={saveNotification}>Lưu thông báo</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
