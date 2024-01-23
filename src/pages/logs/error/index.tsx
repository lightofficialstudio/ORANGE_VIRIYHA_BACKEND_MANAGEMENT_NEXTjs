import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import ErrorLogTable from 'components/viriyha_components/table/ErrorLogsTable';

// ==============================|| ORDER LIST ||============================== //

const ErrorLogPage = () => {
  return (
    <Page title="Error Logs">
      <MainCard title="Error Logs" content={false}>
        {/* table */}
        <ErrorLogTable />
      </MainCard>
    </Page>
  );
};

ErrorLogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ErrorLogPage;
