import Link from 'next/link';

import classes from './main-navigation.module.css';

function MainNavigation({session, signOut}) {

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

export default MainNavigation;
