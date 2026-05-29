import { Button } from "react-bootstrap";

import coffeeImg from "../../assets/coffeeImg.PNG";

import "./Hero.css";

export default function Hero() {

    return (

        <section className="hero-section">

            <div className="container">

                <div className="row align-items-center min-vh-100">



                    <div className="col-lg-6 text-white hero-left">

                        <span className="hero-tag">
                            کافه مدرن و لوکس
                        </span>

                        <h1 className="hero-title">
                            تجربه‌ای متفاوت
                            <br />
                            از طعم واقعی
                            <br />
                            قهوه
                        </h1>

                        <p className="hero-text">
                            بهترین قهوه‌ها و دسرها را
                            در فضایی آرام، مدرن و
                            خاص تجربه کنید.
                        </p>

                        <div className="d-flex gap-3 flex-wrap">

                            <Button className="hero-btn">
                                سفارش آنلاین
                            </Button>

                            <Button
                                variant="outline-light"
                                className="hero-btn-outline"
                            >
                                مشاهده منو
                            </Button>

                        </div>

                    </div>


                    <div className="col-lg-6 position-relative hero-right">

                        <div className="blur-circle"></div>


                        <img
                            src={coffeeImg}
                            alt="coffee"
                            className="hero-image"
                        />



                        <div className="floating-card">

                            <span>
                                کاپوچینو ویژه
                            </span>

                            <h5>
                                ۲۲۰ هزار تومان
                            </h5>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}