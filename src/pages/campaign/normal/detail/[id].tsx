import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import CreateFormNormalCampaign from 'components/viriyha_components/form/campaign/normal/CampaignNormalForm';

// ==============================|| SAMPLE PAGE ||============================== //

const DetailCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="Normal campaign create">
      <Typography variant="body2">
        <CreateFormNormalCampaign title={'รายละเอียดสิทธิพิเศษ'} primaryId={id as string} />
      </Typography>
    </Page>
  );
};

DetailCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DetailCampaignPage;
