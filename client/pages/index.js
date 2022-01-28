import { getSession, signOut } from 'next-auth/client';
import { Button } from '@mui/material';
import Head from 'next/head'
import Layout from '../components/layout/layout'

import styles from '../styles/Home.module.css';

const getAuth = (stringifiedAuth) => {
  //pass session.user.email
  return JSON.parse(stringifiedAuth);
}

export default function Home(props) {
  const { session } = props; 
  const authInfo = getAuth(session.user.email); 
  const logoutHandler = () => {
    signOut();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>K8s Ticketing</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Layout>
      <p>Welcome to k8s tickets</p>
      <p className={styles.description}>
          {`Your are ${authInfo && authInfo.token? 'Logged in': 'not logged in.'}`}
        </p>
        <div style={{margin: '1rem 0'}}></div>
        <Button variant="text" onClick={logoutHandler}>Logout</Button>
    </Layout>
    </div>
  )
}

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
