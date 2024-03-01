import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import SpecialCampaignForm from 'components/viriyha_components/form/campaign/special/CampaignSpecialForm';
// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <Page title="Special Campaign Create">
    <Typography variant="body2">
      <SpecialCampaignForm title={'สร้างสิทธิพิเศษ (Special)'} />
    </Typography>
  </Page>
);

SamplePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SamplePage;
