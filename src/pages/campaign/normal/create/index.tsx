import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';

// form import
import CreateForm from 'components/viriyha_components/form/campaign/normal/create_form'

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <Page title="Sample Page">
    <MainCard title="สร้างแคมเปญ">
      <Typography variant="body2">
       <CreateForm/>
      </Typography>
    </MainCard>
  </Page>
);

SamplePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SamplePage;
