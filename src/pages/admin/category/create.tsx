import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CategoryForm from 'components/viriyha_components/form/admin/CategoryForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// ==============================|| ORDER LIST ||============================== //

const CreateCategoryPage = () => {
  return (
    <Page title="เพิ่มหมวดหมู่ (Create Category)">
      <GoBackButton Link={`/admin/category/`} />
      <CategoryForm titleMessage={'เพิ่มหมวดหมู่ (Create Category)'} confirmMessage={'สร้างหมวดหมู่'} />
    </Page>
  );
};

CreateCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreateCategoryPage;
