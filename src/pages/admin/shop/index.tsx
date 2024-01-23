import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import ShopListTable from 'components/viriyha_components/table/ShopListTable';
// ==============================|| ORDER LIST ||============================== //

const ShopPage = () => {
  return (
    <Page title="Shop List">
      <MainCard title="Shop List" content={false}>
        {/* table */}
        <ShopListTable />
      </MainCard>
    </Page>
  );
};

ShopPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopPage;
