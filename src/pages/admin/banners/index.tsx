import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import BannerTable from 'components/viriyha_components/table/BannerTable';

// ==============================|| ORDER LIST ||============================== //

const CategoryPage = () => {
  return (
    <Page title="Banner Management">
      <MainCard title="Banner Management" content={false}>
        {/* table */}
        <BannerTable />
      </MainCard>
    </Page>
  );
};

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CategoryPage;
