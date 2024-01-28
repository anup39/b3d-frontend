import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageCarousel.css';

export default class ImageCarousel extends Component {
  state = {
    display: true,
    width: 820,
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
            width: this.state.width + 'px',
            display: this.state.display ? 'block' : 'none',
          }}
        >
          <Slider {...settings}>
            {this.props.itemData.map((item, index) => (
              <div
                key={index}
                onClick={() => this.props.onImageClick(item.img)}
              >
                {console.log(item)}
                <img
                  style={{
                    width: '90%',
                    objectFit: 'contain',
                  }}
                  srcSet={`${item.img}?w=200&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading='lazy'
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}
