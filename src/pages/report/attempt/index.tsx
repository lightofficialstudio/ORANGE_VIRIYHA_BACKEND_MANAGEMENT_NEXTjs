import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import AttemptTable from 'components/viriyha_components/table/AttemptTable';

// ==============================|| ORDER LIST ||============================== //

const AttemptPage = () => {
  return (
    <Page title="Attmept">
      <MainCard title="Attempt Transaction" content={false}>
        {/* table */}
        <AttemptTable />
      </MainCard>
    </Page>
  );
};

AttemptPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AttemptPage;
