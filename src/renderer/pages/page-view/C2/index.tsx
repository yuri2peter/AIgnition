import { Box, Stack } from '@mantine/core';
import React from 'react';
import PageNav from '../C2/panels/PageNav';
import { useLeftsideStore } from 'src/renderer/store/useLeftsideStore';
import Settings from '../C2/panels/Settings';
import Aichat from '../C2/panels/Aichat';
import SectionData from '../C2/panels/Data';
import Search from '../C2/panels/Search';
import { useUserStore } from 'src/renderer/store/useUserStore';
import UserPanel from '../C2/panels/User';
import { Favorites } from '../C2/panels/Favorites';
import { QuickNotes } from '../C2/panels/QuickNotes';
import Logo from '../miscs/Logo';
import Recently from './panels/Recently';

const C2: React.FC<{}> = () => {
  const loggedIn = useUserStore((s) => s.loggedIn);
  const sid = useLeftsideStore((s) => s.activedSectionId);
  return (
    <Stack h={'100%'} gap={0}>
      <Logo type={2} />
      <Box style={{ flexGrow: 1, overflow: 'auto' }}>
        <PageNav show={sid === 'pages'} />
        {sid === 'search' && <Search />}
        {loggedIn ? (
          <>
            {sid === 'recently' && <Recently />}
            {sid === 'favorites' && <Favorites />}
            {sid === 'aichat' && <Aichat />}
            {sid === 'quickNotes' && <QuickNotes show={true} />}
            {sid === 'settings' && <Settings />}
            {sid === 'data' && <SectionData />}
          </>
        ) : null}
        {sid === 'user' && <UserPanel />}
      </Box>
    </Stack>
  );
};

export default C2;
