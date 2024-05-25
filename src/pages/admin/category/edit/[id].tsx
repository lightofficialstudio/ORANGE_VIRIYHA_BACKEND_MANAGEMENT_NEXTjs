import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CategoryForm from 'components/viriyha_components/form/admin/CategoryForm';
import GoBackButton from 'components/viriyha_components/button/go_back';

// ==============================|| ORDER LIST ||============================== //

const EditCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="แก้ไขหมวดหมู่">
      <GoBackButton Link={`/admin/category/`} />
      <CategoryForm titleMessage={'แก้ไขหมวดหมู่'} confirmMessage={'ยืนยัน'} categoryId={id as string} />
    </Page>
  );
};

EditCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditCategoryPage;
