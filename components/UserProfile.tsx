import { UserProps } from 'types';

export default function UserProfile({ user }: { user: UserProps }) {
  return (
    <div className='box-center'>
      <img src={user.photoURL} className='card-img-center' />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
}
