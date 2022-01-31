import { getSession, signOut } from 'next-auth/react';
import React from 'react';
import ProfileComponent from '../components/profile-component/profile';

const Profile = (props) => {
  const { session } = props; 
  return <ProfileComponent session={session} signOut={signOut}/>;
};

export async function getServerSideProps(context){
  const session = await getSession({req: context.req});
  if(!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }
  return {
    props: {
      session
    }
  }
}

export default Profile;
