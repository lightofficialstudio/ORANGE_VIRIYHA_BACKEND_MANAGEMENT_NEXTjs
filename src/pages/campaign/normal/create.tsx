import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import NormalCampaignForm from 'components/viriyha_components/form/campaign/normal/CampaignNormalForm';

// ==============================|| SAMPLE PAGE ||============================== //

const CreateCampaignPage = () => (
  <Page title="Normal campaign create">
    <Typography variant="body2">
      <NormalCampaignForm title={'สร้างสิทธิพิเศษ'} />
    </Typography>
  </Page>
);

CreateCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateCampaignPage;
