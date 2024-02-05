import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CategoryForm from 'components/viriyha_components/form/admin/CategoryForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// ==============================|| ORDER LIST ||============================== //

const ShopDetailPage = () => {
  return (
    <Page title="Shop Detail">
      <GoBackButton Link={`/admin/category/`} />
      <CategoryForm titleMessage={'สร้างหมวดหมู่'} confirmMessage={'สร้างข้อมูล'} />
    </Page>
  );
};

ShopDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopDetailPage;
