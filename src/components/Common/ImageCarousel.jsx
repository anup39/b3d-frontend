import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";

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
      slidesToScroll: 1,
    };
    return (
      <div>
        {console.log(this.props.itemData)}
        <div
          style={{
            width: this.state.width + "px",
            display: this.state.display ? "block" : "none",
          }}
        >
          <Slider style={{ marginLeft: "15%" }} {...settings}>
            {this.props.itemData.map((item, index) => (
              <div key={index}>
                {console.log(item)}
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "5px solid yellow",
                  }}
                  srcSet={`${item.img}?w=200&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
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
