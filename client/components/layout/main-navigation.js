import { getSession, signOut } from 'next-auth/client';
import Link from 'next/link';

import classes from './main-navigation.module.css';

function MainNavigation(props) {
  const { session } = props; 

  const logoutHandler = () => {
    signOut();
  }

  return (
    <header className={classes.header}>
      {!session && <div className={classes.logo}>K8s Ticketing</div>}
      {session && <Link href='/'>
        <a>
          <div className={classes.logo}>K8s Ticketing</div>
        </a>
      </Link>}
      <nav>
        <ul>
          {!session && <li>
            <Link href='/auth'>Login</Link>
          </li>}
          {session && <li>
            <Link href='/profile'>Profile</Link>
          </li>}
          {session && <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
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

export default MainNavigation;
