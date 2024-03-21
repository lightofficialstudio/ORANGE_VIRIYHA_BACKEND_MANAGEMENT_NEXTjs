import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import CategoryTable from 'components/viriyha_components/table/CategoryTable';

// ==============================|| ORDER LIST ||============================== //

const CategoryPage = () => {
  return (
    <Page title="จัดการหมวดหมู่ (Category Management)">
      <MainCard title="จัดการหมวดหมู่ (Category Management)" content={false}>
        {/* table */}
        <CategoryTable />
      </MainCard>
    </Page>
  );
};

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CategoryPage;
