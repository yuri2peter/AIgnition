import { Stack } from '@mantine/core';
import React, { useState } from 'react';
import NavHeader from './NavHeader';
import MainNavTree from './MainNavTree';
import { useListenEventReloadTree } from './events';
import { shortId } from 'src/common/utils/string';

const PageNav: React.FC<{ show: boolean }> = ({ show }) => {
  const [navKeyForReload, setNavKeyForReload] = useState(shortId());
  useListenEventReloadTree(() => {
    setNavKeyForReload(shortId());
  });
  return (
    <Stack gap={0} h={'100%'} display={show ? undefined : 'none'}>
      <NavHeader />
      <MainNavTree key={navKeyForReload} />
    </Stack>
  );
};

export default PageNav;
