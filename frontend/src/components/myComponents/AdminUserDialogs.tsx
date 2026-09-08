import type { AdminUser } from './UserSidebar';
import AdminRecordDialog, { type AdminField } from './AdminRecordDialog';
import { axiosInstance } from '@/lib/axios';

const fields: AdminField[] = [
  { name: 'username', label: 'Username', required: true, minLength: 3, maxLength: 50 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 100 },
];
export default function AdminUserDialogs({ users, onSaved }: { users: AdminUser[]; onSaved: () => Promise<void> }) {
  return <div className="grid sm:grid-cols-2 gap-4">
    <AdminRecordDialog title="Create User" description="Create a member account" fields={[...fields, { name: 'password', label: 'Initial password', type: 'password', required: true, minLength: 8, maxLength: 72 }]} onSave={async (_, data) => {
      await axiosInstance.post('/admin/users', Object.fromEntries(data));
      await onSaved();
    }} />
    <AdminRecordDialog title="Edit User" description="Update a member’s username and email" records={users.map(user => ({ id: user.id, title: user.username, values: { username: user.username, email: user.email } }))} fields={fields} onSave={async (id, data) => {
      await axiosInstance.put(`/admin/users/${id}`, Object.fromEntries(data));
      await onSaved();
    }} />
  </div>;
}
