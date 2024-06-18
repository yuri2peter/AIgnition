import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from 'src/renderer/layouts/MainLayout';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import Leftside from './Leftside';
import Middle from './Middle';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import Rightside from './Rightside';

const PageViewPage: React.FC<{}> = () => {
  const { id = ROOT_PAGE_ID } = useParams();
  const pageInfos = usePageStore((s) => s.pageInfos);
  const { setCurrentPageId, pullCurrentPage, calcPageNavNodes, pullPageInfos } =
    usePageStore((s) => s.actions);
  useEffect(() => {
    if (id) {
      setCurrentPageId(id);
      pullCurrentPage().catch(apiErrorHandler);
    }
  }, [id, pullCurrentPage, setCurrentPageId]);
  useEffect(() => {
    if (id) {
      calcPageNavNodes();
    }
  }, [calcPageNavNodes, id, pageInfos]);
  useEffect(() => {
    pullPageInfos();
  }, [pullPageInfos]);

  return (
    <MainLayout
      leftside={<Leftside />}
      middle={<Middle />}
      rightside={<Rightside />}
    />
  );
};

export default PageViewPage;
