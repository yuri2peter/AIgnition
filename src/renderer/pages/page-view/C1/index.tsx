import { ActionIcon, FloatingPosition, Stack, Tooltip } from '@mantine/core';
import React from 'react';
import {
  IconDatabase,
  IconFile,
  IconMessageChatbot,
  IconSearch,
  IconSettings,
  IconUser,
  IconStar,
  IconClipboardList,
  IconPuzzle,
} from '@tabler/icons-react';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import { useLeftsideStore } from 'src/renderer/store/useLeftsideStore';
import {
  selectAiEnabled,
  useNonSensitiveSettingsStore,
} from 'src/renderer/store/useNonSensitiveSettingsStore';
import { useUserStore } from 'src/renderer/store/useUserStore';
import Logo from '../miscs/Logo';
import { useMainLayoutStore } from 'src/renderer/store/useMainLayoutStore';

const tooltipProps = {
  position: 'right' as FloatingPosition,
  withArrow: true,
};

const C1: React.FC<{}> = () => {
  const loggedIn = useUserStore((s) => s.loggedIn);
  const sid = useLeftsideStore((s) => s.activedSectionId);
  const aiEnabled = useNonSensitiveSettingsStore(selectAiEnabled);
  const { setActivedSectionId } = useLeftsideStore((s) => s.actions);
  const {
    actions: { setShowLeft },
  } = useMainLayoutStore();
  return (
    <Stack gap={0} h={'100%'} style={{ overflow: 'hidden' }}>
      <Logo type={1} />
      <Tooltip {...tooltipProps} label="Pages">
        <ActionIcon
          {...getIconProps(sid === 'pages')}
          onClick={() => {
            setShowLeft(true);
            setActivedSectionId('pages');
          }}
        >
          <IconFile size={20} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      <Tooltip {...tooltipProps} label="Search">
        <ActionIcon
          {...getIconProps(sid === 'search')}
          onClick={() => {
            setShowLeft(true);
            setActivedSectionId('search');
          }}
        >
          <IconSearch size={20} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      {loggedIn && (
        <>
          <Tooltip {...tooltipProps} label="Favorites">
            <ActionIcon
              {...getIconProps(sid === 'favorites')}
              onClick={() => {
                setShowLeft(true);
                setActivedSectionId('favorites');
              }}
            >
              <IconStar size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip {...tooltipProps} label="AI Chat">
            <ActionIcon
              {...getIconProps(sid === 'aichat')}
              disabled={!aiEnabled}
              onClick={() => {
                setShowLeft(true);
                setActivedSectionId('aichat');
              }}
            >
              <IconMessageChatbot size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip {...tooltipProps} label="Quick Notes">
            <ActionIcon
              {...getIconProps(sid === 'quickNotes')}
              onClick={() => {
                setShowLeft(true);
                setActivedSectionId('quickNotes');
              }}
            >
              <IconClipboardList size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip {...tooltipProps} label="Web Widgets">
            <ActionIcon
              {...getIconProps(sid === 'webWidgets')}
              onClick={() => {
                setShowLeft(true);
                setActivedSectionId('webWidgets');
              }}
            >
              <IconPuzzle size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </>
      )}
      <FlexGrow />
      {loggedIn && (
        <Tooltip {...tooltipProps} label="Data">
          <ActionIcon
            {...getIconProps(sid === 'data')}
            onClick={() => {
              setShowLeft(true);
              setActivedSectionId('data');
            }}
          >
            <IconDatabase size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      <Tooltip {...tooltipProps} label="User">
        <ActionIcon
          {...getIconProps(sid === 'user')}
          onClick={() => {
            setShowLeft(true);
            setActivedSectionId('user');
          }}
        >
          <IconUser size={20} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      {loggedIn && (
        <Tooltip {...tooltipProps} label="Settings">
          <ActionIcon
            {...getIconProps(sid === 'settings')}
            onClick={() => {
              setShowLeft(true);
              setActivedSectionId('settings');
            }}
          >
            <IconSettings size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
    </Stack>
  );
};

function getIconProps(
  actived = false
): Partial<React.ComponentProps<typeof ActionIcon>> {
  return {
    size: 'xl',
    style: { borderRadius: 0 },
    ...(actived
      ? { variant: 'light', color: 'blue' }
      : { variant: 'subtle', color: 'gray' }),
  };
}

export default C1;
