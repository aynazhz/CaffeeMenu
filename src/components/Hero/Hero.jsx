import { useNavigate } from "react-router-dom";
import coffeeImg from "../../assets/coffeeImg.PNG";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grain" aria-hidden="true" />

      <div className="container hero-container">
        <div className="row align-items-center g-5 hero-row">
          <div className="col-lg-6 hero-content">
            <div className="hero-eyebrow">
             
             
            </div>

            <h1 id="hero-title" className="hero-title">
              قهوه‌ای برای
              <span> حالِ همین لحظه</span>
            </h1>

            <p className="hero-text">
              از دانه‌های تازه‌برشت تا آخرین قطره؛ نوشیدنی‌ات را همان‌طور
              می‌سازیم که خودت دوست داری.
            </p>

            <div className="hero-actions">
              <button className="hero-btn hero-btn-primary" onClick={() => navigate("/menu")}>
                دیدن منو
                <span aria-hidden="true">←</span>
              </button>
            </div>

            <div className="hero-proof" aria-label="ویژگی‌های کافه">
              <div>
                <strong>۱۰۰٪</strong>
                <span>دانه عربیکا</span>
              </div>
              <div>
                <strong>روزانه</strong>
                <span>برشت تازه</span>
              </div>
              <div>
                <strong>برای تو</strong>
                <span>شخصی‌سازی طعم</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 hero-visual" aria-label="قهوه تازه کافه">
            <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
            <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
            <span className="hero-word" aria-hidden="true">COFFEE</span>

            <div className="hero-image-wrap">
              <img src={coffeeImg} alt="فنجان قهوه تازه با دانه‌های قهوه" className="hero-image" />
            </div>

            <div className="hero-note" aria-hidden="true">
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
