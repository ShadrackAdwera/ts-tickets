import Link from 'next/link';

import classes from './main-navigation.module.css';

function MainNavigation() {
  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>K8s Ticketing</div>
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href='/auth'>Login</Link>
          </li>
          <li>
            <Link href='/profile'>Profile</Link>
          </li>
          <li>
            <button onClick={()=>{}}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
