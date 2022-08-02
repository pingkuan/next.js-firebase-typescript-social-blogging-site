import React, { useState } from 'react';
import Loader from './Loader';
import { auth, storage, STATE_CHANGED } from '@lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    const fileRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    const task = uploadBytesResumable(fileRef, file);

    task.on(STATE_CHANGED, (snapshot) => {
      const pct = Number(
        ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
      );
      setProgress(pct);
    });

    task
      .then((d) => getDownloadURL(fileRef))
      .then((url: string) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div className='box'>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className='btn'>
            Upload Img
            <input
              type='file'
              onChange={uploadFile}
              accept='image/x-png,image/gif,image/jpeg'
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className='uplaod-snippet'>{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
};

export default ImageUploader;
