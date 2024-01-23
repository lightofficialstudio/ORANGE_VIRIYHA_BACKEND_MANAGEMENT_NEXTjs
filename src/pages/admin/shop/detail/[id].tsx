import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BranchForm from 'components/viriyha_components/form/shop/BranchForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// project tables
import BranchListTable from 'components/viriyha_components/table/BranchTable';

// ==============================|| ORDER LIST ||============================== //

const ShopDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return (
    <Page title="Shop Detail">
      <GoBackButton Link={`/admin/category/`} />
      <BranchForm titleMessage={'แก้ไขร้านค้า'} />
      {/* table */}
      <Grid mt={5}></Grid>
      <MainCard title="Branch List" content={false}>
        <BranchListTable />
      </MainCard>
    </Page>
  );
};

ShopDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopDetailPage;
