import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import ConfigErrorTable from 'components/viriyha_components/table/ConfigErrorTable';
// ==============================|| ORDER LIST ||============================== //

const ConfigErrorPage = () => {
  return (
    <Page title="Config - Error Message">
      <MainCard title="Error Message" content={false}>
        <ConfigErrorTable />
      </MainCard>
    </Page>
  );
};

ConfigErrorPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ConfigErrorPage;
