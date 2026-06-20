import { useState } from "react";
import { Container } from "react-bootstrap";
import { menuData } from "../../data/menudata";
import "./Menu.css";

const filters = [
  { id: "all", label: "همه", icon: "✦" },
  { id: "coffee", label: "قهوه", icon: "☕" },
  { id: "dessert", label: "دسر", icon: "◇" },
  { id: "drink", label: "نوشیدنی", icon: "○" },
];

export default function Menu() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all"
    ? menuData
    : menuData.filter((item) => item.category === filter);

  return (
    <main className="menu-page">
      <Container>
        <div className="menu-toolbar">
          <div className="menu-filters" role="group" aria-label="فیلتر دسته‌بندی منو">
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
          <span className="menu-count">{filtered.length} انتخاب خوش‌طعم</span>
        </div>

        <section className="menu-grid" aria-live="polite">
          {filtered.map((item, index) => (
            <article className="menu-card" key={item.id} style={{ "--delay": `${index * 70}ms` }}>
              <div className="menu-card-media">
                <img src={`${item.image}?auto=format&fit=crop&w=900&q=85`} alt={item.title} loading="lazy" />
                <span className="menu-card-index">۰{index + 1}</span>
                <button className="menu-favorite" type="button" aria-label={`افزودن ${item.title} به علاقه‌مندی‌ها`}>
                  ♡
                </button>
              </div>

              <div className="menu-card-body">
                <div className="menu-card-title">
                  <div>
                    <span>{item.category === "dessert" ? "شیرین و تازه" : item.category === "drink" ? "خنک و تازه" : "دانه عربیکا"}</span>
                    <h2>{item.title}</h2>
                  </div>
                  <strong>{item.price}<small> تومان</small></strong>
                </div>

                <p>تهیه‌شده با مواد تازه و قابل شخصی‌سازی دقیق برای سلیقه شما.</p>

              </div>
            </article>
          ))}
        </section>
      </Container>
    </main>
  );
}
