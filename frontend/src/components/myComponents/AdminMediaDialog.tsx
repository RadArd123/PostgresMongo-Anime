import { axiosInstance } from '@/lib/axios';
import AdminRecordDialog, { type AdminRecord } from './AdminRecordDialog';

export default function AdminMediaDialog({ kind, records, onSaved }: { kind: 'anime' | 'hero' | 'suggestion' | 'news'; records: AdminRecord[]; onSaved: () => Promise<void> }) {
  const fields = kind === 'anime' ? [{ name: 'img_file_icon', label: 'New poster (optional)' }, { name: 'img_file_banner', label: 'New banner (optional)' }] : [{ name: kind === 'suggestion' ? 'poster_image' : 'background_image', label: 'New image', required: true }];
  return <AdminRecordDialog title="Replace Images" description="Update artwork while keeping the content details" records={records} fields={fields.map(field => ({ ...field, type: 'file' }))} onSave={async (id, data) => {
    const uploads = new FormData();
    for (const field of fields) {
      const file = data.get(field.name);
      if (file instanceof File && file.size > 0) {
        if (file.size > 10 * 1024 * 1024) throw new Error('Each image must be 10 MB or smaller.');
        uploads.append(field.name, file);
      }
    }
    if (!Array.from(uploads.keys()).length) throw new Error('Choose at least one image.');
    await axiosInstance.put(`/admin/media/${kind}/${id}`, uploads);
    await onSaved();
  }} />;
}
