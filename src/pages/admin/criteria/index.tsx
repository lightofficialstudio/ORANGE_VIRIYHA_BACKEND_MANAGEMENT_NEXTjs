import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import CriteriaTable from 'components/viriyha_components/table/CriteriaTable';
// ==============================|| ORDER LIST ||============================== //

const ShopPage = () => {
  return (
    <Page title="กำหนดกลุ่มผลิตภัณฑ์ (Criteria)">
      <MainCard title="กำหนดกลุ่มผลิตภัณฑ์ (Criteria)" content={false}>
        <CriteriaTable />
      </MainCard>
    </Page>
  );
};

ShopPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopPage;
