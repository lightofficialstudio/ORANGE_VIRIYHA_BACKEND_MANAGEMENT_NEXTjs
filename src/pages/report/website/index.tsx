import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import WebsiteAnalyzedTable from '../../../components/viriyha_components/table/WebsiteAnylyzedTable';

// ==============================|| ORDER LIST ||============================== //

const WebsiteAnalyzedPage = () => {
  return (
    <Page title="Website Analyzed">
      <MainCard title="Website Analyzed" content={false}>
        {/* table */}
        <WebsiteAnalyzedTable />
      </MainCard>
    </Page>
  );
};

WebsiteAnalyzedPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WebsiteAnalyzedPage;
