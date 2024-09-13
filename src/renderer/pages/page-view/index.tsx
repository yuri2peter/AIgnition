import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from 'src/renderer/layouts/MainLayout';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import C3 from './C3';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import Backgound from './Backgound';
import { Helmet } from 'react-helmet';
import { getPageTitleFixed } from 'src/renderer/helpers/miscs';
import C4 from './C4';
import { useUserStore } from 'src/renderer/store/useUserStore';
import useIsLargeScreen from 'src/renderer/hooks/screenSize/useIsLargeScreen';
import { eventEmitter } from 'src/renderer/hooks/useEvent';
import { EVENT_FOCUS_PAGE } from './C2/panels/PageNav/events';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import C1 from './C1';
import C2 from './C2';

const PageViewPage: React.FC<{}> = () => {
  const loggedIn = useUserStore((s) => s.loggedIn);
  return loggedIn ? <LoggedInViewPage /> : <LoggedOutViewPage />;
};

const LoggedInViewPage: React.FC<{}> = () => {
  const { id = ROOT_PAGE_ID } = useParams();
  const isLargeScreen = useIsLargeScreen();
  const currentPage = usePageStore(selectCurrentPage);
  const { setCurrentPageId, pullPage, pullPages, clearPages } = usePageStore(
    (s) => s.actions
  );
  const title = currentPage ? getPageTitleFixed(currentPage.title) : '';
  useEffect(() => {
    if (id) {
      setCurrentPageId(id);
      eventEmitter.emit(EVENT_FOCUS_PAGE, id);
      pullPage(id)
        .then(() => {})
        .catch(apiErrorHandler);
    }
  }, [id, pullPage, setCurrentPageId]);
  useEffect(() => {
    pullPages();
  }, [pullPages]);
  useEffect(() => {
    return () => {
      clearPages();
    };
  }, [clearPages]);
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MainLayout
        c1={<C1 />}
        c2={<C2 />}
        c3={<C3 />}
        c4={isLargeScreen && <C4 />}
        background={<Backgound />}
      />
    </>
  );
};

const LoggedOutViewPage: React.FC<{}> = () => {
  const { id = ROOT_PAGE_ID } = useParams();
  const refIdChangedFlag = useRef(false);
  const currentPage = usePageStore(selectCurrentPage);
  const { setCurrentPageId, pullGuestPages, setPagesLoaded, clearPages } =
    usePageStore((s) => s.actions);
  const title = currentPage ? getPageTitleFixed(currentPage.title) : '';
  useEffect(() => {
    setCurrentPageId(id);
    eventEmitter.emit(EVENT_FOCUS_PAGE, id);
    if (
      !refIdChangedFlag.current ||
      usePageStore.getState().pages.every((t) => t.id !== id)
    ) {
      pullGuestPages(id)
        .then(() => {})
        .catch(() => {
          setPagesLoaded(true);
        });
    }
    refIdChangedFlag.current = true;
  }, [id, pullGuestPages, setPagesLoaded, setCurrentPageId]);
  useEffect(() => {
    return () => {
      clearPages();
    };
  }, [clearPages]);
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MainLayout
        c1={<C1 />}
        c2={<C2 />}
        c3={<C3 />}
        background={<Backgound />}
      />
    </>
  );
};

export default PageViewPage;
