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

const SpecialCloneCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const type = 'clone';
  return (
    <Page title="Normal campaign create">
      <Typography variant="body2">
        <CampaignForm title={'รายละเอียดสิทธิพิเศษ'} primaryId={id as string} type={type} />
      </Typography>
    </Page>
  );
};

SpecialCloneCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SpecialCloneCampaignPage;
