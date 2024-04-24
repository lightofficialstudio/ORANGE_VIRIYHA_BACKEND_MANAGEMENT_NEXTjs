import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import CampaignForm from 'components/viriyha_components/form/campaign/CampaignForm';

// ==============================|| SAMPLE PAGE ||============================== //

const CloneCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const type = 'clone';
  return (
    <Page title="Normal Campaign Clone">
      <Typography variant="body2">
        <CampaignForm title={'รายละเอียดสิทธิพิเศษ'} primaryId={id as string} type={type} />
      </Typography>
    </Page>
  );
};

CloneCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CloneCampaignPage;
