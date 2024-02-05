import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CategoryForm from 'components/viriyha_components/form/admin/CategoryForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// ==============================|| ORDER LIST ||============================== //

const ShopDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="Shop Detail">
      <GoBackButton Link={`/admin/category/`} />
      <CategoryForm titleMessage={'แก้ไขหมวดหมู่'} confirmMessage={'แก้ไขข้อมูล'} categoryId={id as string} />
    </Page>
  );
};

ShopDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopDetailPage;
