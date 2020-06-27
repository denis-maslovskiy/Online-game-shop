import React from 'react';
import '../styles/content.scss'

export const HomePage = () => {

    let goods = [1,2,3,4,5,6,7,8,9,10];

    return (
        <main className='container'>
            <div className='content'>
                {
                    goods.map((item, index) => {

                        return (
                            <button className='content__card-btn' key={index}>
                                <div className='content__card'>
                                    <div className='content__card__picture'></div>
                                    <div className='content__card_description'>
                                        <h2>{item}</h2>
                                        <h3>Genre</h3>
                                        <h3>Author</h3>
                                        <p>Price</p>
                                    </div>
                                </div>
                            </button>
                        )
                    })
                }

                <div>
                    
                </div>
            </div>
        </main>
    )
}