import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import CampaignForm from 'components/viriyha_components/form/campaign/CampaignForm';
// ==============================|| SAMPLE PAGE ||============================== //

const CreateCampaignPage = () => (
  <Page title="Normal campaign create">
    <Typography variant="body2">
      <CampaignForm title={'สร้างสิทธิพิเศษ'} type={'normal'} />
    </Typography>
  </Page>
);

CreateCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateCampaignPage;
