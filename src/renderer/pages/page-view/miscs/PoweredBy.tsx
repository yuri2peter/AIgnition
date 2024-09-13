import { Anchor, Button, Group, Stack, Text, Tooltip } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import currentVersionInfo from 'src/common/version.json';

type VersionInfo = typeof currentVersionInfo;

const PoweredBy: React.FC<{}> = () => {
  return (
    <Stack px={16} gap={0} align="center">
      <Group wrap="nowrap" justify="center" gap={'xs'}>
        <Text c={'gray.5'} size={'sm'}>
          Powered by{' '}
          <Anchor
            href="https://github.com/yuri2peter/AIgnition"
            c={'inherit'}
            target="_blank"
            underline="always"
          >
            AIgnition v{currentVersionInfo.version}
          </Anchor>
        </Text>
        <Updates />
      </Group>
    </Stack>
  );
};

const Updates: React.FC<{}> = () => {
  const [remoteVersionInfo, setRemoteVersionInfo] =
    useState(currentVersionInfo);
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/yuri2peter/AIgnition/main/src/common/version.json'
    )
      .then((response) => {
        response.json().then((data) => {
          setRemoteVersionInfo(data as VersionInfo);
        });
      })
      .catch((error) => {
        console.error('Fetch remote version info error', error);
      });
  }, []);
  if (remoteVersionInfo.version === currentVersionInfo.version) {
    return null;
  }
  return (
    <Tooltip
      label={
        <Stack gap={0}>
          <Text size="sm">
            {currentVersionInfo.version}
            {' ---> '}
            {remoteVersionInfo.version}
          </Text>
          <Text size="sm">Reslesed at {remoteVersionInfo.releaseDate}</Text>
          {remoteVersionInfo.updateDetails.map((t, i) => (
            <Text size="sm" key={i}>
              - {t}
            </Text>
          ))}
        </Stack>
      }
    >
      <Button
        component={'a'}
        href="https://github.com/yuri2peter/AIgnition#-Maintenance"
        target="_blank"
        size="xs"
        variant="light"
        color="orange"
      >
        UPDATE
      </Button>
    </Tooltip>
  );
};

export default PoweredBy;
