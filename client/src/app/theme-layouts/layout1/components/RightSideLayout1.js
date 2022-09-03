import { memo } from 'react';
import QuickPanel from '../../shared-components/quickPanel/QuickPanel';
import UserPanel from '../../shared-components/userPanel/UserPanel';

function RightSideLayout1(props) {
  return (
    <>
      <QuickPanel />
      <UserPanel />
    </>
  );
}

export default memo(RightSideLayout1);
