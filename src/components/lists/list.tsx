/* eslint-disable operator-linebreak */
/* eslint-disable  no-nested-ternary */
import React, { FC } from 'react';
import { Avatar } from 'components/avatar';
import {
    FiStar,
    FiMoreHorizontal,
    FiAlertTriangle,
    FiMessageSquare
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { Button } from 'components/button';
import { Modal } from 'components/modal';
import { formatDistance } from 'date-fns';
import { SyncLoader } from 'react-spinners';
import { axiosPrivate } from 'config/axiosInstance';
import { useStore } from 'hoc/useStore';
import { Collapsable } from 'components/collapsable';
import { Container } from 'components/container';
import { PostComment } from 'views/feed/comment/postComment';
import { Comments } from 'views/feed/comment';
import { CProps } from 'views/feed/comment/';

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
      company: string;
      avatar: string;
      stars: [string];
      authorID: string;
      school: string;
      comments: CProps;
    }

    export const List:FC<Props> = ({
     name, post, id, authorID, date, image, isVerified, occupation, avatar, stars, company, school, comments
    }) => {
        const [modal, setModal] = React.useState(false);
        const [loading, setLoading] = React.useState<boolean | null>(null);
        const [toggleCommentsModal, setToggleComments] = React.useState(false);
        const [commentText, setCommentText] = React.useState('');
        const { userProfile } = useStore();
        const { userData } = userProfile;

        const isStudent = occupation === 'Student'
                            ? `Studying at ${school}`
                            : occupation === 'Student Teacher'
                            ? `${occupation} at ${school}`
                            : occupation;
        const userTitle = company ? `${occupation}, ${company}` : `${isStudent}`;

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

        const toggleComments = () => setToggleComments(!toggleCommentsModal);

        const handleChange = (e) => setCommentText(e.target.value);
        const handleBlur = () => console.log(commentText);

        const handlePostComment = async (postId: string) => {
            setCommentText('');
            const formData = {
                comment: commentText
            };

            try {
                const response = await axiosPrivate.post(`api/v1/comment/post/${postId}`, formData);
                console.log('Response: ', response.data);
            } catch (error) {
                console.log(error);
            }
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
                <p className='feed__title'> {userTitle} </p>
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
        <p className='feed__listContent'> <Collapsable showSeeLess={false} end={300}>{post}</Collapsable> </p>
        {image &&
            (
                <section>
                  <img src={image} alt='' className='feed__postImage' />
                </section>
            )}
      <hr style={{ opacity: '0.1' }} />

      { toggleCommentsModal && (
          <section className='feed__commentsModalContainer'>
             <Container header='Comments' className='feed__commentsModal'>
                <>
                    {comments?.length
                        ? <Comments id={id} />
                        : 'No comments. Be the first to comment.' }
                    <span className='feed__typeCommentContainer'>
                        <PostComment
                          onPost={() => handlePostComment(id)}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          text={commentText}
                        />
                    </span>
                </>
             </Container>
          </section>
      )}

    <section className='feed__LastRow'>
        <span className='feed__stats'>
            <span className='feed__comments' onClick={toggleComments} tabIndex={0} role='button' onKeyPress={toggleComments}> <FiMessageSquare className='feed__commentsIcon' /> { comments?.length ? `${comments?.length} comments` : 'No comments yet' } </span>
          <Button onClick={() => handleLikes(id)} className='feed__stats__bookmarks'> <FiStar className='feed__starIcon' /> {stars.length} </Button>
        </span>
    </section>
    </section>
  );
};
