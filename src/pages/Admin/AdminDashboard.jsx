import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getAdminAuthHeader,
  isAdminAuthError,
  isAdminLoggedIn,
  logoutAdmin,
} from "./adminAuth";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5236";

const initialForm = {
  title: "",
  price: "",
  category: "coffee",
  image: "",
  imageFile: null,
  imagePreview: "",
};

const categories = [
  { value: "coffee", label: "قهوه" },
  { value: "dessert", label: "دسر" },
  { value: "drink", label: "نوشیدنی" },
];

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  return image.startsWith("/") ? `${API_URL}${image}` : image;
}

async function uploadImage(itemId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.put(`${API_URL}/api/menu/${itemId}/image`, formData, {
    headers: getAdminAuthHeader(),
  });
  return response.data;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  const isEditing = editingId !== null;
  const previewImage = form.imagePreview || getImageUrl(form.image);
  const categorySummary = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: items.filter((item) => item.category === category.value).length,
      })),
    [items]
  );

  const handleAuthExpired = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/menu`);
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load menu:", error);
        setMessage("منو از API دریافت نشد.");
      } finally {
        setLoading(false);
      }
    };

    if (isAdminLoggedIn()) {
      loadItems();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (form.imagePreview) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const resetForm = (clearMessage = true) => {
    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm(initialForm);
    setEditingId(null);
    if (clearMessage) {
      setMessage("");
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("فقط فایل عکس قابل انتخاب است.");
      return;
    }

    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm((currentForm) => ({
      ...currentForm,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
    setMessage("");
  };

  const startEdit = (item) => {
    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setEditingId(item.id);
    setForm({
      title: item.title ?? "",
      price: item.price ?? "",
      category: item.category ?? "coffee",
      image: item.image ?? "",
      imageFile: null,
      imagePreview: "",
    });
    setMessage("حالت ویرایش فعال شد. تغییرات را در فرم بالا اعمال کن.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      price: form.price.trim(),
      category: form.category,
      image: form.image.trim() || "/uploads/placeholder.jpg",
    };

    if (!payload.title || !payload.price || !payload.category) {
      setMessage("نام، قیمت و دسته‌بندی را کامل کن.");
      return;
    }

    if (!isEditing && !form.imageFile) {
      setMessage("برای آیتم جدید یک عکس از سیستم انتخاب کن.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/menu/${editingId}`, payload, {
          headers: getAdminAuthHeader(),
        });

        let updatedItem = { id: editingId, ...payload };
        if (form.imageFile) {
          updatedItem = await uploadImage(editingId, form.imageFile);
        }

        setItems((currentItems) =>
          currentItems.map((item) => (item.id === editingId ? updatedItem : item))
        );
        setMessage("تغییرات آیتم ذخیره شد.");
      } else {
        const createResponse = await axios.post(`${API_URL}/api/menu`, payload, {
          headers: getAdminAuthHeader(),
        });
        const createdItem = await uploadImage(createResponse.data.id, form.imageFile);

        setItems((currentItems) => [...currentItems, createdItem]);
        setMessage("آیتم جدید با عکس انتخابی ساخته شد.");
      }

      resetForm(false);
    } catch (error) {
      console.error("Failed to save menu item:", error);
      if (isAdminAuthError(error)) {
        handleAuthExpired();
        return;
      }
      setMessage(isEditing ? "ویرایش آیتم انجام نشد." : "ساخت آیتم انجام نشد.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`آیتم «${item.title}» حذف شود؟`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setMessage("");

    try {
      await axios.delete(`${API_URL}/api/menu/${item.id}`, {
        headers: getAdminAuthHeader(),
      });
      setItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id)
      );

      if (editingId === item.id) {
        resetForm();
      }

      setMessage("آیتم با موفقیت حذف شد.");
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      if (isAdminAuthError(error)) {
        handleAuthExpired();
        return;
      }
      setMessage("حذف آیتم انجام نشد. API را چک کن.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="admin-page">
      <Container>
        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">داشبورد</span>
            <h1>{isEditing ? "ویرایش آیتم منو" : "ساخت آیتم جدید منو"}</h1>
          </div>

          <button
            className="admin-logout"
            type="button"
            onClick={() => {
              logoutAdmin();
              navigate("/admin/login", { replace: true });
            }}
          >
            خروج
          </button>
        </div>

        {message && <p className="admin-message">{message}</p>}

        <section className="admin-stats" aria-label="خلاصه منو">
          <article>
            <span>کل آیتم‌ها</span>
            <strong>{loading ? "-" : items.length}</strong>
          </article>

          {categorySummary.map((category) => (
            <article key={category.value}>
              <span>{category.label}</span>
              <strong>{loading ? "-" : category.count}</strong>
            </article>
          ))}
        </section>

        <section className="admin-create-panel" aria-label="فرم مدیریت آیتم">
          <form className="admin-create-form" onSubmit={handleSubmit}>
            <div className="admin-form-title">
              <span className="admin-eyebrow">
                {isEditing ? "حالت ویرایش" : "آیتم جدید"}
              </span>
              <h2>{isEditing ? "اطلاعات آیتم را تغییر بده" : "مشخصات آیتم را وارد کن"}</h2>
            </div>

            <label>
              نام آیتم
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="مثلا لاته کاراملی"
              />
            </label>

            <label>
              قیمت
              <input
                type="text"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="مثلا 95000"
              />
            </label>

            <label>
              دسته‌بندی
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-file-field">
              عکس آیتم
              <input type="file" accept="image/*" onChange={handleImageSelect} />
              <span>{form.imageFile ? form.imageFile.name : "انتخاب عکس"}</span>
            </label>

            <div className="admin-form-actions">
              <button className="admin-save" type="submit" disabled={saving}>
                {saving
                  ? "در حال ذخیره..."
                  : isEditing
                    ? "ذخیره تغییرات"
                    : "ساخت آیتم"}
              </button>

              {isEditing && (
                <button
                  className="admin-cancel"
                  type="button"
                  disabled={saving}
                  onClick={resetForm}
                >
                  لغو ویرایش
                </button>
              )}
            </div>
          </form>

          <aside className="admin-preview">
            {previewImage ? (
              <img src={previewImage} alt="پیش‌نمایش آیتم" />
            ) : (
              <div className="admin-preview-empty">پیش‌نمایش عکس</div>
            )}
            <strong>{form.title || "نام آیتم"}</strong>
            <span>{form.price || "قیمت"} تومان</span>
          </aside>
        </section>

        <section className="admin-compact-list" aria-label="آیتم‌های فعلی">
          <div className="admin-list-head">
            <div>
              <span className="admin-eyebrow">مدیریت منو</span>
              <h2>آیتم‌های فعلی</h2>
            </div>
            <span>{loading ? "در حال دریافت..." : `${items.length} آیتم`}</span>
          </div>

          {!loading && items.length === 0 && (
            <p className="admin-empty">هنوز آیتمی برای نمایش وجود ندارد.</p>
          )}

          {!loading &&
            items.map((item) => (
              <article
                className={`admin-compact-item ${
                  editingId === item.id ? "is-editing" : ""
                }`}
                key={item.id}
              >
                <img src={getImageUrl(item.image)} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    {item.category} · {item.price} تومان
                  </span>
                </div>

                <div className="admin-row-actions">
                  <button
                    className="admin-edit"
                    type="button"
                    disabled={saving || deletingId === item.id}
                    onClick={() => startEdit(item)}
                  >
                    ویرایش
                  </button>

                  <button
                    className="admin-delete"
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item)}
                  >
                    {deletingId === item.id ? "در حال حذف..." : "حذف"}
                  </button>
                </div>
              </article>
            ))}
        </section>
      </Container>
    </main>
  );
}
