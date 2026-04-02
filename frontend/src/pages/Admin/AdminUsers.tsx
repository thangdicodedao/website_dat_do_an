import { useEffect, useState, useCallback } from 'react';
import { Search, User as UserIcon, Edit2, Trash2, Shield, X, Save } from 'lucide-react';
import { Button, Input, ProfileSkeleton } from '../../components/common';
import { userAPI } from '../../services';
import { User } from '../../types';
import { formatDate } from '../../utils';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', role: 'user', isVerified: false });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const data = await userAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((u: User) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.phone && u.phone.includes(searchQuery))
  );

  const handleToggleRole = async (user: User) => {
    try {
      const updated = await userAPI.toggleUserRole(user.id);
      setUsers(users.map((u: User) => u.id === user.id ? updated : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      phone: user.phone || '',
      role: user.role,
      isVerified: user.isVerified,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const updated = await userAPI.updateUser(editingUser.id, editForm);
      setUsers(users.map((u: User) => u.id === editingUser.id ? updated : u));
      setEditingUser(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?`)) return;
    setDeletingId(user.id);
    try {
      await userAPI.deleteUser(user.id);
      setUsers(users.filter((u: User) => u.id !== user.id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Quản lý người dùng</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-3 md:p-4 border-b">
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Người dùng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Vai trò</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Xác thực</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Ngày tạo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-4 h-4 text-red-500" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{user.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleRole(user)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600 disabled:opacity-50"
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

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sửa người dùng</h3>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{editingUser.email}</p>

            <div className="space-y-4">
              <Input
                label="Họ và tên"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <Input
                label="Số điện thoại"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'admin' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isVerified}
                  onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  className="w-4 h-4 text-red-500 rounded"
                />
                <span className="text-sm text-gray-600">Đã xác thực email</span>
              </label>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setEditingUser(null)}>
                Hủy
              </Button>
              <Button className="flex-1" onClick={handleSaveEdit} disabled={saving}>
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
