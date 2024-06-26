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

const DetailCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="Normal Campaign Edit">
      <Typography variant="body2">
        <CampaignForm title={'รายละเอียดสิทธิพิเศษ'} primaryId={id as string} type={'normal'} />
      </Typography>
    </Page>
  );
};

DetailCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DetailCampaignPage;
