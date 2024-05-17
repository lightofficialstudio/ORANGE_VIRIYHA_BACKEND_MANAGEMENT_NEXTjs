import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// material-ui

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';

// form import
import BranchForm from 'components/viriyha_components/form/admin/BranchForm';

// ==============================|| SAMPLE PAGE ||============================== //

const CreateBranchPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="สร้างสาขา (Create Branch)">
      <BranchForm confirmMessage={'สร้างสาขา '} titleMessage={'สร้างสาขา '} shopId={id as string} />
    </Page>
  );
};

CreateBranchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateBranchPage;
