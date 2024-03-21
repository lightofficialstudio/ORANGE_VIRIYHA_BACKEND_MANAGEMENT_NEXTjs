import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ShopForm from 'components/viriyha_components/form/admin/ShopForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// project tables
import BranchListTable from 'components/viriyha_components/table/BranchTable';

// ==============================|| ORDER LIST ||============================== //

const ShopDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="รายละเอียดของร้านค้า (Shop Detail)">
      <GoBackButton Link={'/admin/shop/'} />
      <ShopForm titleMessage={'แก้ไขข้อมูลร้านค้า (Edit Shop)'} confirmMessage={'แก้ไขข้อมูลสาขา'} shopId={id as string} />
      {/* table */}
      <Grid mt={5}></Grid>
      <MainCard title="สาขาทั้งหมด (Branch)" content={false}>
        <BranchListTable shopId={id as string} />
      </MainCard>
    </Page>
  );
};

ShopDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopDetailPage;
