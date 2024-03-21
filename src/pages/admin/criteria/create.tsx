import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import CriteriaForm from 'components/viriyha_components/form/admin/CriteriaForm';

const CriteriaCreatePage = () => {
  return (
    <Page title="สร้างการแบ่งกลุ่ม (Create Criteria)">
      <CriteriaForm titleMessage={'การแบ่งกลุ่ม (Create Criteria)'} confirmMessage={'สร้างข้อมูล'} />
    </Page>
  );
};

CriteriaCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CriteriaCreatePage;
