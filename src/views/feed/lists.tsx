import React from 'react';
import { PostField } from 'components/postField';
import { List } from 'components/lists/list';
import { RootState } from 'store';
import { Create } from 'components/create';
import { useSelector } from 'react-redux';
// import { ScaleLoader } from 'react-spinners';
import { useFetchData } from 'hoc/useFetchData';
import { SkeletonPosts } from 'components/skeleton';

export const Lists = () => {
  const toggleState = useSelector((state: RootState) => state.isToggleOn);
    const response = useFetchData('/feed');
    const { posts } = response.data;

 return (
    <div className='feed__feedWrapper'>
        {toggleState ? <PostField /> : null}
        { response.loading
                ? <SkeletonPosts cards={10} />
                : posts?.map(({
                    post, postImage, author, _id, createdAt, stars
                }) => (
              <List
                post={post}
                image={postImage}
                isVerified={author?.isVerified}
                name={author?.name}
                key={_id}
                date={createdAt}
                id={_id}
                occupation={author?.occupation}
                authorID={author?._id}
                avatar={author?.avatar}
                stars={stars}
              />
              ))}
        {!toggleState
        ? <Create />
        : null}
    </div>
  );
};
