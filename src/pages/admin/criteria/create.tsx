import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CriteriaForm from 'components/viriyha_components/form/admin/CriteriaForm';

const CriteriaCreatePage = () => {
  return (
    <Page title="สร้างกำหนดกลุ่มผลิตภัณฑ์ (Criteria)">
      <CriteriaForm titleMessage={'กำหนดกลุ่มผลิตภัณฑ์ (Criteria)'} confirmMessage={'ยืนยัน'} />
    </Page>
  );
};

CriteriaCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CriteriaCreatePage;
