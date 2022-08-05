import { auth } from '@lib/firebase';
import { UserProps } from 'types';
import {
  doc,
  onSnapshot,
  getFirestore,
  DocumentData,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    if (user) {
      const ref = doc(getFirestore(), 'users', user.uid);
      unsubscribe = onSnapshot(ref, (doc: DocumentData) => {
        const x = { ...doc.data() } as UserProps;
        setUsername(x.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
