import { useDebouncedValue } from '@mantine/hooks';
import { IconLink } from '@tabler/icons-react';
import React, { useLayoutEffect, useState } from 'react';
import MemCache from 'src/common/libs/MemCache';
import { checkTextContainsKeywords } from 'src/common/utils/string';
import { api } from 'src/renderer/helpers/api';
import {
  selectSiteLogo,
  useNonSensitiveSettingsStore,
} from 'src/renderer/store/useNonSensitiveSettingsStore';
import { useUserStore } from 'src/renderer/store/useUserStore';
import { z } from 'zod';

const LinkIconPreview: React.FC<{ href: string }> = ({ href: oHref }) => {
  const [href] = useDebouncedValue(
    oHref.startsWith('/') ? window.location.origin + oHref : oHref,
    500,
    { leading: true }
  );
  const siteLogo = useNonSensitiveSettingsStore(selectSiteLogo);
  const [previewLink, setPreviewLink] = useState('');
  const loggedIn = useUserStore((s) => s.loggedIn);
  const { enabled, loggedInOnly, filters } = useNonSensitiveSettingsStore(
    (s) => s.settings.linkIconPreview
  );
  const shouldParse =
    enabled &&
    (loggedInOnly ? loggedIn : true) &&
    checkUrl(href) &&
    !checkTextContainsKeywords(href, filters);
  useLayoutEffect(() => {
    if (shouldParse) {
      // intranet sites
      if (new URL(href).hostname === window.location.hostname) {
        setPreviewLink(siteLogo);
        return;
      }
      const cacheKey = href;
      if (memCache.has(cacheKey)) {
        setPreviewLink(memCache.get(cacheKey));
        return;
      } else {
        api()
          .post('/api/miscs/parse-link-icon', { url: href })
          .then(({ data }) => {
            const { icon: iconHref } = z
              .object({
                icon: z.string(),
              })
              .parse(data);
            if (iconHref) {
              const img = new Image();
              img.src = iconHref;
              img.style.display = 'none';
              img.onload = () => {
                setPreviewLink(iconHref);
                memCache.set(cacheKey, iconHref, MemCache.EXPIRE_TIME.ONE_WEEK);
              };
              img.onerror = () => {
                setPreviewLink('');
                memCache.set(cacheKey, '', MemCache.EXPIRE_TIME.ONE_WEEK);
              };
            } else {
              setPreviewLink('');
              memCache.set(cacheKey, '', MemCache.EXPIRE_TIME.ONE_WEEK);
            }
          });
      }
    }
  }, [shouldParse, href, siteLogo]);
  const icon =
    shouldParse && previewLink ? (
      <img src={previewLink} alt="icon" />
    ) : (
      <IconLink />
    );
  if (!shouldParse) {
    return <IconLink />;
  }
  return icon;
};

const LinkIconPreviewMemo = React.memo(LinkIconPreview);

export default LinkIconPreviewMemo;

function checkUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}

const memCache = new MemCache();

export function clearLinkIconCache() {
  memCache.removeAll();
}
