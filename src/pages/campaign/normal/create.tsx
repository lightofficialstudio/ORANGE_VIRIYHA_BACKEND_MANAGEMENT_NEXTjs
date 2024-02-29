import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import CreateFormNormalCampaign from 'components/viriyha_components/form/campaign/normal/CampaignNormalCreateForm';

// ==============================|| SAMPLE PAGE ||============================== //

const CreateCampaignPage = () => (
  <Page title="Normal campaign create">
    <Typography variant="body2">
      <CreateFormNormalCampaign title={'สร้างสิทธิพิเศษ'} />
    </Typography>
  </Page>
);

CreateCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateCampaignPage;
