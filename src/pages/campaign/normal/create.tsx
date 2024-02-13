import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import CreateFormNormalCampaign from 'components/viriyha_components/form/campaign/normal/CampaignNormalCreateForm';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <Page title="Normal campaign create">
    <Typography variant="body2">
      <CreateFormNormalCampaign />
    </Typography>
  </Page>
);

SamplePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SamplePage;
