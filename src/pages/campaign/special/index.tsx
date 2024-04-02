import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import SpecialCampaignTable from 'components/viriyha_components/table/SpecialCampaignTable';

// ==============================|| ORDER LIST ||============================== //

const SpecialCampagePage = () => {
  return (
    <Page title="สิทธิพิเศษแบบพิเศษ (Special Campaign)">
      <MainCard title="สิทธิพิเศษแบบพิเศษ (Special Campaign)" content={false}>
        {/* table */}
        <SpecialCampaignTable />
      </MainCard>
    </Page>
  );
};

SpecialCampagePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SpecialCampagePage;
