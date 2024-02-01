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
    <Page title="ประวัติการใช้งานโค้ดสิทธิพิเศษ">
      <MainCard title="ประวัติการใช้งานโค้ดสิทธิพิเศษ (Redeem Transaction)" content={false}>
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
