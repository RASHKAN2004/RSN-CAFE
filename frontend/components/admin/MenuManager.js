'use client';
import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useAuth, useToast } from '@/components/Providers';
import { VegMark } from '@/components/MenuCard';
import { api } from '@/lib/api';
import { money } from '@/lib/cafe';

const BLANK = { name: '', description: '', category: '', price: '', emoji: '☕', isVeg: true, isPopular: false, isAvailable: true };

export default function MenuManager() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null); // null = closed
  const [busy, setBusy] = useState(false);

  const load = () => api('/menu', { auth: false }).then((d) => setItems(d.items)).catch((e) => toast(e.message, 'error'));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = [...new Set((items || []).map((i) => i.category))];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { _id, ...rest } = form;
      const body = { ...rest, price: Number(rest.price) };
      delete body.createdAt; delete body.updatedAt; delete body.__v;
      if (_id) await api(`/menu/${_id}`, { method: 'PUT', body });
      else await api('/menu', { method: 'POST', body });
      toast(_id ? 'Menu item updated.' : 'Menu item added.');
      setForm(null);
      load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function toggle(i) {
    try { await api(`/menu/${i._id}/availability`, { method: 'PATCH', body: { isAvailable: !i.isAvailable } }); load(); }
    catch (err) { toast(err.message, 'error'); }
  }
  async function del(i) {
    if (!confirm(`Delete "${i.name}" from the menu?`)) return;
    try { await api(`/menu/${i._id}`, { method: 'DELETE' }); toast('Item deleted.'); load(); }
    catch (err) { toast(err.message, 'error'); }
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setForm({ ...BLANK })}><Plus size={18} /> Add menu item</button>

      {form && (
        <form onSubmit={save} className="panel mt-5 grid gap-4 border-ink p-5 sm:grid-cols-2">
          <h2 className="text-xl font-bold sm:col-span-2">{form._id ? `Edit ${form.name}` : 'New menu item'}</h2>
          <div><label className="label" htmlFor="m-name">Name</label><input id="m-name" className="input" value={form.name} onChange={set('name')} required maxLength={80} /></div>
          <div>
            <label className="label" htmlFor="m-cat">Category</label>
            <input id="m-cat" className="input" list="cats" value={form.category} onChange={set('category')} required maxLength={40} placeholder="Coffee, Snacks…" />
            <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div><label className="label" htmlFor="m-price">Price (Rs.)</label><input id="m-price" className="input" type="number" min="0" step="1" value={form.price} onChange={set('price')} required /></div>
          <div><label className="label" htmlFor="m-emoji">Emoji icon</label><input id="m-emoji" className="input" value={form.emoji} onChange={set('emoji')} maxLength={8} /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="m-desc">Description</label><input id="m-desc" className="input" value={form.description} onChange={set('description')} maxLength={240} /></div>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            {[['isVeg', 'Vegetarian'], ['isPopular', 'Show as popular'], ['isAvailable', 'Available']].map(([k, l]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#0a2a2f]" checked={form[k]} onChange={set(k)} /> {l}</label>
            ))}
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save item'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {!items && <p className="mt-6 text-soft">Loading…</p>}
      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b-2 border-mist text-soft">
            <tr><th className="p-3">Item</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Available</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y-2 divide-mist">
            {items?.map((i) => (
              <tr key={i._id}>
                <td className="p-3"><span className="mr-2 text-xl">{i.emoji}</span><VegMark veg={i.isVeg} /> <span className="ml-1 font-semibold">{i.name}</span>{i.isPopular && <span className="badge ml-2 bg-saffron/40">Popular</span>}</td>
                <td className="p-3">{i.category}</td>
                <td className="p-3 font-semibold">{money(i.price)}</td>
                <td className="p-3">
                  <button role="switch" aria-checked={i.isAvailable} onClick={() => toggle(i)} aria-label={`Toggle availability of ${i.name}`}
                    className={`relative h-6 w-11 rounded-full border-2 border-ink transition-colors ${i.isAvailable ? 'bg-palm' : 'bg-mist'}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${i.isAvailable ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...i }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label={`Edit ${i.name}`}><Pencil size={16} /></button>
                  {user.role === 'admin' && <button className="btn btn-ghost btn-sm text-chili" onClick={() => del(i)} aria-label={`Delete ${i.name}`}><Trash2 size={16} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
