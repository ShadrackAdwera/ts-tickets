import React from 'react';
import Layout from '../layout/layout';

import styles from './profile.module.css';

const Profile = ({ signOut, session}) => {
  return <Layout session={session} signOut={signOut}>
      <div className={styles.container}>Profile Page</div>
  </Layout>;
};

export default Profile;
