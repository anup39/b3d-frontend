import { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";
import PropTypes from "prop-types";

export default class ImageCarousel extends Component {
  state = {
    display: true,
    width: 800,
  };

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      // slidesToScroll: 1,
    };

    // time
    return (
      <div>
        <div
          style={{
            width: 800,
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

// #new file
// Path: src/components/Common/ImageCarousel.css
// .slick-prev:before, .slick-next:before {
//   color: #000;
// }
