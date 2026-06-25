import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import "./Menu.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5236";

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  return image.startsWith("/") ? `${API_URL}${image}` : image;
}

const filters = [
  { id: "all", label: "همه", icon: "✦" },
  { id: "coffee", label: "قهوه", icon: "☕" },
  { id: "dessert", label: "دسر", icon: "◇" },
  { id: "drink", label: "نوشیدنی", icon: "○" },
];

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/menu`);

        setProducts(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
        setError("منو از سرور دریافت نشد. لطفا API را اجرا کنید و دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filtered =
    filter === "all"
      ? products
      : products.filter((item) => item.category === filter);

  if (loading) {
    return (
      <main className="menu-page">
        <Container>
          <p>در حال دریافت منو...</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="menu-page">
      <Container>
        <div className="menu-toolbar">
          <div
            className="menu-filters"
            role="group"
            aria-label="فیلتر دسته‌بندی منو"
          >
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={filter === item.id ? "is-active" : ""}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <span className="menu-count">
            {filtered.length} انتخاب خوش‌طعم
          </span>
        </div>

        {error && <p className="menu-error">{error}</p>}

        <section className="menu-grid" aria-live="polite">
          {filtered.map((item, index) => (
            <article
              className="menu-card"
              key={item.id}
              style={{ "--delay": `${index * 70}ms` }}
            >
              <div className="menu-card-media">
                <img src={getImageUrl(item.image)} alt={item.title} loading="lazy" />

                <span className="menu-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <button
                  className="menu-favorite"
                  type="button"
                  aria-label={`افزودن ${item.title} به علاقه‌مندی‌ها`}
                >
                  ♡
                </button>
              </div>

              <div className="menu-card-body">
                <div className="menu-card-title">
                  <div>
                    <span>
                      {item.category === "dessert"
                        ? "شیرین و تازه"
                        : item.category === "drink"
                          ? "خنک و تازه"
                          : "دانه عربیکا"}
                    </span>

                    <h2>{item.title}</h2>
                  </div>

                  <strong>
                    {item.price}
                    <small> تومان</small>
                  </strong>
                </div>

                <p>
                  تهیه‌شده با مواد تازه و قابل شخصی‌سازی دقیق برای سلیقه شما.
                </p>
              </div>
            </article>
          ))}
        </section>
      </Container>
    </main>
  );
}
