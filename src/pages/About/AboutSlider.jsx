import Carousel from "react-bootstrap/Carousel";
import cafe1 from "../../assets/cafe1.PNG";
import cafe3 from "../../assets/cafe3.PNG";
import cafe5 from "../../assets/cafe5.PNG";

export default function AboutSlider() {
  return (
    <Carousel fade interval={2000} className="about-carousel">

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={cafe5}
          alt="coffee shop"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={cafe3}
          alt="coffee beans"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={cafe1}
          alt="barista"
        />
      </Carousel.Item>

    </Carousel>
  );
}