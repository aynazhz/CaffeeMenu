import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="cafe-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="footer-logo" to="/" aria-label="خانه قهوه">
              <span>C</span>
              <div>خانه قهوه<small>COFFEE HOUSE</small></div>
            </Link>
            <p>یک فنجان خوب، دقیقاً همان‌طور که دوست داری.</p>
            <div className="footer-status"><i aria-hidden="true" /> هر روز از ساعت 8:00 الی 23:00</div>
          </div>

          <nav className="footer-nav" aria-label="دسترسی سریع">
            <div>
              <h2>دسترسی سریع</h2>
              <Link to="/">خانه</Link>
              <Link to="/menu">منوی کافه</Link>
              <Link to="/about">درباره ما</Link>
            </div>
            <div>
              <h2>دسته‌بندی</h2>
              <Link to="/menu?category=coffee">قهوه</Link>
              <Link to="/menu?category=dessert">دسر</Link>
              <Link to="/menu?category=drink">نوشیدنی سرد</Link>
            </div>
          </nav>

          <div className="footer-contact">
            <h2>پیدامون کن</h2>
            <address>باکو، منطقه مدرن کافه‌ها</address>
            <a href="tel:+994999123456" dir="ltr">+994 99 912 34 56</a>
            <div className="footer-socials">
              <a href="#instagram" aria-label="اینستاگرام">IG</a>
              <a href="#telegram" aria-label="تلگرام">TG</a>
              <a href="#whatsapp" aria-label="واتس‌اپ">WA</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© ۲۰۲۶ خانه قهوه</span>
          <span>ساخته‌شده برای لحظه‌های آرام</span>
        </div>
      </div>
    </footer>
  );
}
