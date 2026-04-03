import React, { useState } from 'react';
import { Galleria } from 'primereact/galleria';

interface ImgItem{
    itemImageSrc: string
    thumbnailImageSrc: string
    alt: string
}

export default function GaleriaDeImagens() {
    const [images] = useState([
        {
            itemImageSrc: '/default/banner.png',
            thumbnailImageSrc: '/default/banner.png',
            alt: 'Foto 1'
        },
        {
            itemImageSrc: '/default/banner.png',
            thumbnailImageSrc: '/default/banner.png',
            alt: 'Foto 2'
        },
        {
            itemImageSrc: '/default/banner.png',
            thumbnailImageSrc: '/default/banner.png',
            alt: 'Foto 3'
        },
        {
            itemImageSrc: '/default/banner.png',
            thumbnailImageSrc: '/default/banner.png',
            alt: 'Foto 3'
        },
        {
            itemImageSrc: '/default/banner.png',
            thumbnailImageSrc: '/default/banner.png',
            alt: 'Foto 3'
        }
    ]);

    const responsiveOptions = [
        { breakpoint: '991px', numVisible: 4 },
        { breakpoint: '767px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    const itemTemplate = (item: ImgItem) => (
        <img
            src={item.itemImageSrc}
            alt={item.alt}
            className="w-full block"
        />
    );

    const thumbnailTemplate = (item: ImgItem) => (
        <img
            src={item.thumbnailImageSrc}
            alt={item.alt}
            className="block"
        />
    );

    return (
        <div className="card">
            <Galleria
                value={images}
                responsiveOptions={responsiveOptions}
                numVisible={5}
                style={{ maxWidth: '640px' }}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
            />
        </div>
    );
}