
import React, { useState } from 'react';
import { Contact } from '../types';

interface ContactsProps {
  contacts: Contact[];
  onAdd: (contact: Contact) => void;
  onUpdate: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, onAdd, onUpdate, onDelete }) => {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    name: '',
    phone: '',
    priority: 'Secondary'
  });

  const openAdd = () => {
    setFormData({ name: '', phone: '', priority: 'Secondary' });
    setCurrentContactId(null);
    setModalMode('add');
  };

  const openEdit = (contact: Contact) => {
    setFormData({ name: contact.name, phone: contact.phone, priority: contact.priority });
    setCurrentContactId(contact.id);
    setModalMode('edit');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    if (modalMode === 'add') {
      onAdd({ ...formData, id: Date.now().toString() });
    } else if (modalMode === 'edit' && currentContactId) {
      onUpdate({ ...formData, id: currentContactId });
    }
    
    closeModal();
  };

  const closeModal = () => {
    setModalMode(null);
    setCurrentContactId(null);
  };

  return (
    <div className="max-w-4xl mx-auto fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Guardian Circle</h1>
          <p className="text-sm text-slate-500 font-medium">Manage trusted individuals for instant emergency alerts.</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all flex items-center active:scale-95"
        >
          <i className="fas fa-plus mr-2"></i> Add Trusted Person
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                contact.priority === 'Primary' ? 'bg-indigo-600' : 
                contact.priority === 'Emergency' ? 'bg-red-600' : 'bg-slate-500'
              }`}>
                <i className={`fas ${contact.priority === 'Emergency' ? 'fa-bolt' : 'fa-user'} text-sm`}></i>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{contact.name}</h3>
                <p className="text-xs text-slate-500 font-bold tracking-tight">{contact.phone}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                    contact.priority === 'Primary' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                    contact.priority === 'Emergency' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {contact.priority}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => openEdit(contact)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center"
                title="Edit Details"
              >
                <i className="fas fa-pen text-xs"></i>
              </button>
              <button 
                onClick={() => onDelete(contact.id)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"
                title="Remove Contact"
              >
                <i className="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
             <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users-slash text-slate-300 text-2xl"></i>
             </div>
             <p className="text-slate-400 font-bold text-sm">Your guardian circle is empty. Add a contact above.</p>
          </div>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">{modalMode === 'add' ? 'Add Guardian' : 'Update Guardian'}</h3>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600"><i className="fas fa-xmark"></i></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold text-sm"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Mobile Number</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold text-sm"
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Priority Assignment</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold text-sm"
                  value={formData.priority}
                  onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                >
                  <option value="Primary">Primary (Family/Spouse)</option>
                  <option value="Secondary">Secondary (Friends/Colleagues)</option>
                  <option value="Emergency">High Alert (Immediate Notify)</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                type="submit"
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs shadow-xl active:scale-95 transition-all uppercase tracking-widest"
              >
                {modalMode === 'add' ? 'Confirm Addition' : 'Save Changes'}
              </button>
              <button 
                type="button"
                onClick={closeModal}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contacts;
