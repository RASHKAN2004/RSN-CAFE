"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth, useToast } from "@/components/Providers";
import { VegMark } from "@/components/MenuCard";
import { api } from "@/lib/api";
import { money } from "@/lib/cafe";

const BLANK = {
  name: "",
  description: "",
  category: "",
  price: "",
  emoji: "☕",
  isVeg: true,
  isPopular: false,
  isAvailable: true,
};

export default function MenuManager() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    api("/menu", { auth: false })
      .then((d) => setItems(d.items))
      .catch((e) => toast(e.message, "error"));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = [...new Set((items || []).map((i) => i.category))];
  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  async function save(e) {
    e.preventDefault();
    setBusy(true);

    try {
      const { _id, ...rest } = form;
      const body = { ...rest, price: Number(rest.price) };
      delete body.createdAt;
      delete body.updatedAt;
      delete body.__v;

      if (_id) await api(`/menu/${_id}`, { method: "PUT", body });
      else await api("/menu", { method: "POST", body });

      toast(_id ? "Menu item updated." : "Menu item added.");
      setForm(null);
      load();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function toggleAvailability(item) {
    try {
      await api(`/menu/${item._id}/availability`, {
        method: "PATCH",
        body: { isAvailable: !item.isAvailable },
      });
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function del(item) {
    if (!confirm(`Delete "${item.name}" from the menu?`)) return;

    try {
      await api(`/menu/${item._id}`, { method: "DELETE" });
      toast("Item deleted.");
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-accent"
        onClick={() => setForm({ ...BLANK })}
      >
        <Plus size={18} />
        Add menu item
      </button>

      {form && (
        <form
          onSubmit={save}
          className="panel mt-5 grid gap-4 p-5 sm:grid-cols-2"
        >
          <h2 className="text-2xl sm:col-span-2">
            {form._id ? `Edit ${form.name}` : "New menu item"}
          </h2>

          <div>
            <label htmlFor="m-name" className="field-label">
              Name
            </label>
            <input
              id="m-name"
              className="input"
              value={form.name}
              onChange={set("name")}
              required
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="m-cat" className="field-label">
              Category
            </label>
            <input
              id="m-cat"
              className="input"
              list="cats"
              value={form.category}
              onChange={set("category")}
              required
              maxLength={40}
              placeholder="Coffee, Snacks..."
            />
            <datalist id="cats">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="m-price" className="field-label">
              Price (Rs.)
            </label>
            <input
              id="m-price"
              className="input"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={set("price")}
              required
            />
          </div>

          <div>
            <label htmlFor="m-emoji" className="field-label">
              Emoji icon
            </label>
            <input
              id="m-emoji"
              className="input"
              value={form.emoji}
              onChange={set("emoji")}
              maxLength={8}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="m-desc" className="field-label">
              Description
            </label>
            <input
              id="m-desc"
              className="input"
              value={form.description}
              onChange={set("description")}
              maxLength={240}
            />
          </div>

          <div className="flex flex-wrap gap-5 sm:col-span-2">
            {[
              ["isVeg", "Vegetarian"],
              ["isPopular", "Show as popular"],
              ["isAvailable", "Available"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-accent"
                  checked={form[key]}
                  onChange={set(key)}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn btn-accent" disabled={busy}>
              {busy ? "Saving…" : "Save item"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setForm(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!items && <p className="mt-6 text-ink-soft">Loading menu…</p>}

      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-border text-ink-soft">
            <tr>
              <th className="p-3 font-semibold">Item</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Available</th>
              <th className="p-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {items?.map((item) => (
              <tr key={item._id}>
                <td className="p-3">
                  <span className="mr-2 text-xl">{item.emoji}</span>
                  <VegMark veg={item.isVeg} />
                  <span className="ml-2 font-semibold">{item.name}</span>
                  {item.isPopular && (
                    <span className="chip ml-2 bg-gold/20">Popular</span>
                  )}
                </td>
                <td className="p-3">{item.category}</td>
                <td className="p-3 font-semibold">{money(item.price)}</td>
                <td className="p-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.isAvailable}
                    onClick={() => toggleAvailability(item)}
                    aria-label={`Toggle availability of ${item.name}`}
                    className={`relative h-7 w-12 rounded-full border border-ink transition-colors ${
                      item.isAvailable
                        ? "bg-success"
                        : "bg-[color:var(--surface-strong)]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                        item.isAvailable ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setForm({ ...item });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil size={16} />
                  </button>

                  {user.role === "admin" && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-danger"
                      onClick={() => del(item)}
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
