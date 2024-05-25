import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import ShopForm from 'components/viriyha_components/form/admin/ShopForm';

const ShopCreatePage = () => {
  return (
    <Page title="สร้างแบรนด์">
      <ShopForm titleMessage={'สร้างแบรนด์'} confirmMessage={'ยืนยัน'} />
    </Page>
  );
};

ShopCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopCreatePage;
