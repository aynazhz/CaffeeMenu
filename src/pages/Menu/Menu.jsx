import { useState } from "react";
import { menuData } from "../../data/menudata";
import "./Menu.css";

export default function Menu() {
    const [filter, setFilter] = useState("all");

    const filtered =
        filter === "all"
            ? menuData
            : menuData.filter((item) => item.category === filter);

    return (
        <div className="container py-4">

            <h2 className="text-center mb-4">منوی کافه ☕</h2>

            {/* فیلترها */}
            <div className="text-center mb-4">
                <button className="btn btn-outline-dark mx-1" onClick={() => setFilter("all")}>
                    همه
                </button>
                <button className="btn btn-outline-dark mx-1" onClick={() => setFilter("coffee")}>
                    قهوه
                </button>
                <button className="btn btn-outline-dark mx-1" onClick={() => setFilter("dessert")}>
                    دسر
                </button>
                <button className="btn btn-outline-dark mx-1" onClick={() => setFilter("drink")}>
                    نوشیدنی
                </button>
            </div>

            {/* کارت‌ها */}
            <div className="row g-4">
                {filtered.map((item) => (
                    <div className="col-md-3 col-sm-6" key={item.id}>
                        <div className="card menu-card h-100">

                            <img src={item.image} className="card-img-top" alt={item.title} />

                            <div className="card-body text-center">
                                <h5>{item.title}</h5>
                                <p className="text-muted">{item.price} تومان</p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}