import React, { useEffect, useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useInViewport } from 'react-in-viewport';
import themeBase from './base.module.css';
import clsx from 'clsx';
import { getFileExtension } from 'src/common/utils/string';
import LinkIconPreview from '../LinkIconPreview';
import { Link } from 'react-router-dom';

const CustomLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  className,
  href,
  ...props
}) => {
  const isUploadedFile = href?.startsWith('/uploads/');
  const refLink = React.useRef<HTMLAnchorElement>(null);
  const { inViewport } = useInViewport(refLink);
  const [viewed, setViewed] = useState(false);
  useEffect(() => {
    if (inViewport) {
      setViewed(true);
    }
  }, [inViewport]);
  if (isUploadedFile) {
    const ext = getFileExtension(href ?? '');
    return (
      <a
        {...props}
        className={clsx(className, themeBase.customrLink)}
        target="_blank"
        href={href}
        download={children}
        ref={refLink}
      >
        <FileIcon
          extension={ext}
          {...defaultStyles[ext as keyof typeof defaultStyles]}
        />
        {children}
      </a>
    );
  }
  // intranet sites
  if (href && !href.startsWith('http')) {
    return (
      <Link
        className={clsx(className, themeBase.customrLink)}
        to={href}
        {...props}
        ref={refLink}
        {...(isUploadedFile
          ? {
              download: children,
            }
          : {})}
      >
        {viewed && <LinkIconPreview href={href ?? ''} />}
        {children}
      </Link>
    );
  }
  return (
    <a
      {...props}
      className={clsx(className, themeBase.customrLink)}
      target="_blank"
      href={href}
      ref={refLink}
      {...(isUploadedFile
        ? {
            download: children,
          }
        : {})}
    >
      {viewed && <LinkIconPreview href={href ?? ''} />}
      {children}
    </a>
  );
};

export default CustomLink;
