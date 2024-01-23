import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import FrontendUserTable from 'components/viriyha_components/table/FrontendUserTable';

// ==============================|| ORDER LIST ||============================== //

const FrontEndUserPage = () => {
  return (
    <Page title="Shop List">
      <MainCard title="Shop List" content={false}>
        {/* table */}
        <FrontendUserTable />
      </MainCard>
    </Page>
  );
};

FrontEndUserPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default FrontEndUserPage;
