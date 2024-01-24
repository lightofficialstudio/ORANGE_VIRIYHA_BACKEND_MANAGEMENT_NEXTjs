import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import NormalCampaignTable from 'components/viriyha_components/table/NormalCampaignTable';

// ==============================|| ORDER LIST ||============================== //

const NormalCampaignPage = () => {
  return (
    <Page title="จัดการแคมเปญ">
      <MainCard title="Normal Campaign" content={false}>
        {/* table */}
        <NormalCampaignTable />
      </MainCard>
    </Page>
  );
};

NormalCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NormalCampaignPage;
