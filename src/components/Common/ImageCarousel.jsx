import { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";
import PropTypes from "prop-types";

export default class ImageCarousel extends Component {
  state = {
    display: true,
    width: window.innerWidth * 0.5,
  };

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      // slidesToScroll: 1,
    };

    return (
      <div>
        <div
          style={{
            width: this.state.width + "px",
            display: this.state.display ? "block" : "none",
          }}
        >
          <Slider {...settings}>
            {this.props.itemData.map((item, index) => (
              <div
                style={{ padding: "10px" }}
                key={index}
                onClick={() => this.props.onImageClick(item)}
              >
                <img
                  style={{
                    padding: "5px",
                    width: "99%",
                    objectFit: "contain",
                  }}
                  // srcSet={`${item.img}?w=200&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.photo}`}
                  alt={item.id}
                  loading="lazy"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}

ImageCarousel.defaultProps = {
  itemData: [],
  onImageClick: () => {},
};
ImageCarousel.propTypes = {
  itemData: PropTypes.array,
  onImageClick: PropTypes.func,
};
