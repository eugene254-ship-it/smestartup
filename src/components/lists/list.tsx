/* eslint-disable operator-linebreak */
import React, { FC } from 'react';
import { Avatar } from 'components/avatar';
import {
    FiStar,
    FiMoreHorizontal,
    FiAlertTriangle
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
// import avatar from 'assets/avatar.png';
import { Button } from 'components/button';
import { Modal } from 'components/modal';
import { formatDistance } from 'date-fns';
// import { useFetchUserId } from 'hoc/useFetchUserId';
import { SyncLoader } from 'react-spinners';
import { axiosPrivate } from 'config/axiosInstance';
import { useStore } from 'hoc/useStore';
import { Collapsable } from 'components/collapsable';
// import { Link } from 'react-router-dom';
// import { findLinks } from 'helpers/findLinks';
// import { io } from 'socket.io-client';
// import { NODE_ENV } from 'config/baseURL';

    export interface Props {
      name: {
        firstName: string;
        lastName: string;
      };
      post: string;
      id: string;
      date: Date;
      image: string;
      isVerified: boolean;
      occupation: string;
      avatar: string;
      stars: number;
      authorID: string;
    }

    export const List:FC<Props> = ({
     name, post, id, authorID, date, image, isVerified, occupation, avatar, stars
    }) => {
        const [modal, setModal] = React.useState(false);
        const [loading, setLoading] = React.useState<boolean | null>(null);
        const { userProfile } = useStore();
        const { userData } = userProfile;

           const handleLikes = (postId: string) => {
            const formData = {
                postId,
            };

            axiosPrivate.put(`/feed/${postId}`, formData)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => console.log(err));
        };

        const handleDelete = async (postId: string) => {
            setLoading(true);
            await axiosPrivate.delete(`/feed/${postId}`)
                .then((res) => {
                    const { success } = res.data;
                    if (success) {
                        setLoading(false);
                        setModal(false);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    setLoading(false);
                });
        };

    return (
    <section className='feed__list'>
        <span className='feed__firstRow'>
            <div className='feed__profile'>
                <Avatar className='feed__profileImage' avatar={avatar} />
              <span>
                <h4 className='feed__name'> {name?.firstName} {name?.lastName} {isVerified && <MdVerified /> } </h4>
                <p className='feed__title'> {occupation} </p>
                <p className='feed__recent'> {formatDistance(new Date(date), new Date(), { addSuffix: true })} </p>
              </span>
            </div>
            {modal &&
                (
                    <Modal className='feed__optionsModal'>
                        <section className='feed__postOptions'>
                            <span className='feed__optionsContainer'>
                                <section style={{ textAlign: 'center', fontSize: '1.2rem', width: '100%' }}> Options </section>
                                <hr className='feed__line' />
                            </span>
                            { userData._id === authorID
                                && (
                                    <span>
                                        <section className='feed__optionItem'> <FiAlertTriangle style={{ marginRight: '.6em' }} /> Report </section>
                                        <hr className='feed__line' />
                                    </span>
                                )}
                        </section>
                        { userData._id === authorID
                            && (
                                <section className='feed__btnContainer'>
                                    <Button className='feed__modal--delete' onClick={() => handleDelete(id)}> { loading ? <SyncLoader color='white' size={8} /> : 'Delete' } </Button>
                                </section>
                            )}
                    </Modal>
            )}
        <FiMoreHorizontal className='feed__options' onClick={() => setModal(!modal)} />
        </span>
        <p className='feed__listContent'> <Collapsable end={300}>{post}</Collapsable> </p>
    {!image ? null
    :
    (
        <section>
          <img src={image} alt='' className='feed__postImage' />
        </section>
    )}
      <hr style={{ opacity: '0.1' }} />

    <section className='feed__LastRow'>
        <span className='feed__stats'>
          <span className='feed__comments'>  </span>
          <Button onClick={() => handleLikes(id)} className='feed__stats__bookmarks'> <FiStar className='feed__starIcon' /> {stars.length} </Button>
        </span>
    </section>
    </section>
  );
};
