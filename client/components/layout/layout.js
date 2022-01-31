import { Fragment } from 'react';

import MainNavigation from './main-navigation';

function Layout(props) {
  return (
    <Fragment>
      <MainNavigation signOut={props.signOut} session={props.session}/>
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
