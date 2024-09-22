import { Group, Avatar, Text, Anchor } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import { getPageRoute, getPageTitleFixed } from 'src/renderer/helpers/miscs';
import {
  useNonSensitiveSettingsStore,
  selectSiteName,
  selectSiteLogo,
} from 'src/renderer/store/useNonSensitiveSettingsStore';
import {
  selectRootNavNode,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { useUserStore } from 'src/renderer/store/useUserStore';

const Logo: React.FC<{ type: number }> = ({ type }) => {
  const siteName = useNonSensitiveSettingsStore(selectSiteName);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const rootNavNode = usePageStore(selectRootNavNode);
  if (loggedIn) {
    return <LogoDisplay to={ROOT_PAGE_ID} title={siteName} type={type} />;
  } else if (rootNavNode) {
    return (
      <LogoDisplay to={rootNavNode.id} title={rootNavNode.title} type={type} />
    );
  }
  return null;
};

export const LogoDisplay: React.FC<{
  to: string;
  title: string;
  type: number;
}> = ({ to, title, type }) => {
  const siteLogo = useNonSensitiveSettingsStore(selectSiteLogo);
  return (
    <Anchor component={Link} to={getPageRoute(to)}>
      <Group
        wrap="nowrap"
        px={8}
        style={{
          borderBottom: '1px solid var(--divider-color)',
          height: 56,
          flexShrink: 0,
        }}
      >
        {type === 1 && <Avatar src={siteLogo} alt="Site logo" size={28} />}
        {type === 2 && (
          <Text fw={500} size="lg" c={'gray.7'} ml={8}>
            {getPageTitleFixed(title)}
          </Text>
        )}
      </Group>
    </Anchor>
  );
};

export default Logo;
