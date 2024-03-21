import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CriteriaForm from 'components/viriyha_components/form/admin/CriteriaForm';

const CriteriaCreatePage = () => {
  const rounter = useRouter();
  const { id } = rounter.query;
  return (
    <Page title="แก้ไขการแบ่งกลุ่ม (Edit Criteria)">
      <CriteriaForm titleMessage={'แก้ไขการแบ่งกลุ่ม (Edit Criteria)'} confirmMessage={'สร้างข้อมูล'} primaryId={id as string} />
    </Page>
  );
};

CriteriaCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CriteriaCreatePage;
