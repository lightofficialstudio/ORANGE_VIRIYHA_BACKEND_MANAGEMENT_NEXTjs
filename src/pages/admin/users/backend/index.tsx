import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import BackendUserTable from 'components/viriyha_components/table/BackendUserTable';

// ==============================|| ORDER LIST ||============================== //

const BackendUserPage = () => {
  return (
    <Page title="Shop List">
      <MainCard title="Shop List" content={false}>
        {/* table */}
        <BackendUserTable />
      </MainCard>
    </Page>
  );
};

BackendUserPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BackendUserPage;
