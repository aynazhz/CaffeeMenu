import "./Footer.css";

export default function Footer() {
  return (
    <footer className="cafe-footer">
      <div className="container">
        <div className="row gy-4">

          {/* Brand */}
          <div className="col-lg-4">
            <h2 className="footer-logo">Coffee House</h2>
            <p className="footer-text">
              تجربه‌ای متفاوت از طعم واقعی قهوه در محیطی آرام، مدرن و خاص.
              هر فنجان، یک لحظه آرامش ☕
            </p>
          </div>

          {/* Links */}
          <div className="col-lg-2 col-6">
            <h5 className="footer-title">منو</h5>
            <ul>
              <li>قهوه‌ها</li>
              <li>دسرها</li>
              <li>نوشیدنی سرد</li>
              <li>صبحانه</li>
            </ul>
          </div>

          <div className="col-lg-2 col-6">
            <h5 className="footer-title">لینک‌ها</h5>
            <ul>
              <li>خانه</li>
              <li>درباره ما</li>
              <li>تماس</li>
              <li>سفارش آنلاین</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <h5 className="footer-title">ارتباط با ما</h5>
            <p>📍 باکو، منطقه مدرن کافه‌ها</p>
            <p>📞 0999 123 456</p>
            <p>✉️ coffee@house.com</p>

            <div className="socials">
              <span>Instagram</span>
              <span>Telegram</span>
              <span>WhatsApp</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 Coffee House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}