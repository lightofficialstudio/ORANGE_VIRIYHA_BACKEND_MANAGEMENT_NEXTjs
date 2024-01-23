import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
// project tables
import LocationTable from 'components/viriyha_components/table/LocationTable';

// ==============================|| ORDER LIST ||============================== //

const LocationPage = () => {
  return (
    <Page title="Location Transaction">
      <MainCard title="Location Transaction" content={false}>
        {/* table */}
        <LocationTable />
      </MainCard>
    </Page>
  );
};

LocationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LocationPage;
