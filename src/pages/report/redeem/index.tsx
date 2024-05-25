import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import RedeemTransactionTable from 'components/viriyha_components/table/RedeemTransationTable';

// ==============================|| ORDER LIST ||============================== //

const RedeemTransactionPage = () => {
  return (
    <Page title="รายงานการใช้สิทธิพิเศษ (Redemption Report)">
      <MainCard title="รายงานการใช้สิทธิพิเศษ (Redemption Report)" content={false}>
        {/* table */}
        <RedeemTransactionTable />
      </MainCard>
    </Page>
  );
};

RedeemTransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RedeemTransactionPage;
