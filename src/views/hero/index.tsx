import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from '../../components/button';
import { title, para } from './typo';

export const Hero: React.FC = () => {
    const history = useHistory();
    const isLoggedIn = useSelector((state) => state.isLogged);

  return (
    <section className='hero'>
        <section className='hero__innerHero container'>
            <aside className='hero__left'>
                <section className='hero__top' />
                <span className='hero__bottom' style={{ padding: '1em 0' }}>
                    <p className='hero__left__title'> {title} </p>
                    <p className='hero__left__paragraph'> {para} </p>
                    { !isLoggedIn ? <Button onClick={() => history.push('/register')} className='hero__left--action'> get started <FiArrowRight style={{ fontSize: '1.2rem' }} /> </Button> : <Button onClick={() => history.push('/feed')} className='hero__left--action'> go to feed <FiArrowRight style={{ fontSize: '1.2rem' }} /> </Button>}
                </span>
            </aside>
            <aside className='hero__right' />
        </section>
    </section>
  );
};
