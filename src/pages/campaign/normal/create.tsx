import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';

// form import
import CreateFormNormalCampaign from 'components/viriyha_components/form/campaign/normal/CampaignNormalCreateForm';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <Page title="Normal campaign create">
    <MainCard title="สร้างสิทธิพิเศษธรรมดา">
      <Typography variant="body2">
        <CreateFormNormalCampaign />
      </Typography>
    </MainCard>
  </Page>
);

SamplePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SamplePage;
