import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ShopForm from 'components/viriyha_components/form/shop/ShopForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// project tables
import BranchListTable from 'components/viriyha_components/table/BranchTable';

// ==============================|| ORDER LIST ||============================== //

const ShopDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="Shop Detail">
      <GoBackButton Link={`/admin/category/`} />
      <ShopForm titleMessage={'แก้ไขร้านค้า'} confirmMessage={'แก้ไขข้อมูล'} shopId={id as string} />
      {/* table */}
      <Grid mt={5}></Grid>
      <MainCard title="Branch List" content={false}>
        <BranchListTable shopId={id as string} />
      </MainCard>
    </Page>
  );
};

ShopDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopDetailPage;
