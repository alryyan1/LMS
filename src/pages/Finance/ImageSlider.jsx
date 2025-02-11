import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { imagesUrl, webUrl } from '../constants';

const ImageSlider = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Slider {...settings}>
            {images.map((image, index) => (
                <div key={index}>
                    <img src={`${imagesUrl}/${image.filename}`} alt={image.filename} style={{ width: '100%', maxHeight: '800px', objectFit: 'contain' }} />
                </div>
            ))}
        </Slider>
    );
};

export default ImageSlider;