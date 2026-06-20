import "./About.css";
import AboutSlider from "./AboutSlider";
import Intrior from "../../assets/intrior.PNG";

export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="container">
                
                <div className="row align-items-center gy-5">

                
                    <div className="col-lg-6 about-image">
                        <div className="about-glow"></div>

                        <img
                            src={Intrior}
                            alt="coffee shop"
                        />
                    </div>

                
                    <div className="col-lg-6 text-white about-text">

                        <span className="about-tag">درباره ما</span>

                        <h2 className="about-title">
                            کافه‌ای برای
                            <br />
                            لحظه‌های خاص
                        </h2>

                        <p className="about-desc">
                            ما در Coffee House تلاش می‌کنیم تجربه‌ای متفاوت از قهوه را برای شما بسازیم.
                            از دانه‌های تازه انتخاب‌شده تا فضای آرام و مدرن،
                            همه چیز برای آرامش و لذت شما طراحی شده است.
                        </p>

                        <div className="about-stats">
                            <div>
                                <h3>10+</h3>
                                <p>سال تجربه</p>
                            </div>

                            <div>
                                <h3>50+</h3>
                                <p>نوع نوشیدنی</p>
                            </div>

                            <div>
                                <h3>1000+</h3>
                                <p>مشتری راضی</p>
                            </div>
                            <AboutSlider/>
                            
                        </div>
                    
                    </div>
                    
                   
                </div>
            
            </div>
            
          
        </section>
        

        
    );
}
