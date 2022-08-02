import styles from '@styles/Admin.module.css';
import AuthCheck from '@components/AuthCheck';
import { auth } from '@lib/firebase';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import ImageUploader from '@components/ImageUploader';

const AdminPostEdit: NextPage = () => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
};

const PostManager = () => {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  let { slug } = router.query;
  slug = slug.toString();

  const postRef = doc(
    getFirestore(),
    'users',
    auth.currentUser.uid,
    'posts',
    slug
  );
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='btn-blue'>Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
};

type PostFormProps = {
  defaultValues: DocumentData;
  postRef: DocumentReference<DocumentData>;
  preview: boolean;
};

const PostForm = ({ defaultValues, postRef, preview }: PostFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm({ defaultValues, mode: 'onChange' });

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          name='content'
          {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && (
          <p className='text-danger'>{`${errors.content.message}`}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name='published'
            type='checkbox'
            {...register('published')}
          />
          <label>Published</label>
        </fieldset>

        <button
          type='submit'
          className='btn-green'
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const DeletePostButton = ({
  postRef,
}: {
  postRef: DocumentReference<DocumentData>;
}) => {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/admin');
      toast('post annihilated', { icon: '🗑️' });
    }
  };

  return (
    <button className='btn-red' onClick={deletePost}>
      Delete
    </button>
  );
};

export default AdminPostEdit;
