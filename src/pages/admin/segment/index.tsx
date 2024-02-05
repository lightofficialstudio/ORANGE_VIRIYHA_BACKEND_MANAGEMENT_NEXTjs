import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import SegmentTable from 'components/viriyha_components/table/SegmentTable';
// ==============================|| ORDER LIST ||============================== //

const ShopPage = () => {
  return (
    <Page title="Segment">
      <MainCard title="Segment" content={false}>
        <SegmentTable />
      </MainCard>
    </Page>
  );
};

ShopPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopPage;
