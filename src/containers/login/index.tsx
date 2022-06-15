/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
// @flow
import { Button } from 'components/button';
import React, { useState } from 'react';
import { FaLinkedinIn, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Header } from 'views/header';
import { Link, useHistory } from 'react-router-dom';
import { axiosPublic } from 'config/axiosInstance';
// import { SERVER_URL } from 'config/baseURL';
import { Helmet } from 'react-helmet-async';
import { SyncLoader } from 'react-spinners';
// import { axiosInstance } from 'config/axiosInstance';
import logged from '../../store/actions/logged';

export const Login = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState<Boolean | null>(null);
    // const [token, setToken] = useState<string>('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        onSubmit(values) {
            setLoading(true);
            const { email, password } = values;
            if (!email || !password) {
                console.log('Fields are empty...');
                return;
            }
            axiosPublic.post('http://localhost:5000/login', values)
                .then((res) => {
                    const { accessToken, message, isLoggedIn } = res.data;

                    localStorage.setItem('accessToken', accessToken); // save token
                    setResponse(message);
                    setLoading(false);
                    if (isLoggedIn) {
                        dispatch(logged());
                        history.push('/feed');
                    }
                })
                .catch((err) => console.error('Something went wrong: ', err));
        }
    });

    return (
        <>
            <Helmet>
                <title> Login To Your Account and Continue Where You Left Off | Blendot </title>
                <meta name='description' content='Login and collaborate with like-minded people within the platform.' />
                <link rel='canonical' href='/login' />
            </Helmet>
            <Header />
            <section className='login'>
                <section className='login__container'>
                        <h2 className='login__header'> Account Login </h2>
                        <form onSubmit={formik.handleSubmit} className='login__form'>
                            <label className='login__label' htmlFor='email'> Email or Username: </label>
                            <input
                              type='email'
                              name='email'
                              placeholder='Enter your email'
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              className='login__emailField'
                              autoCapitalize='false'
                            />

                            <label className='login__label' htmlFor='email'> Password: </label>
                            <input
                              type='password'
                              name='password'
                              placeholder='Enter password'
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              className='login__emailField'
                              autoComplete='false'
                            />
                            <Button type='submit' className='login__button'> {loading ? <SyncLoader size={8} color='#fff' /> : 'login'} </Button>
                            <p style={{ color: 'red' }}> {response} </p>
                        </form>
                        <p className='login__Or'>OR</p>
                        <section className='login__socials'>
                            <FaGoogle />
                            <FaFacebookF />
                            <FaLinkedinIn />
                        </section>
                        <section className='login__button--register'>
                            <p> Dont have an account? <b /> <Link to='/register'> Create new account! </Link> </p>
                        </section>
                </section>
            </section>
        </>
    );
};
