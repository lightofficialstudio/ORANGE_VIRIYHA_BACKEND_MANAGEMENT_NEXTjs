import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import ShopForm from 'components/viriyha_components/form/shop/ShopForm';

const ShopCreatePage = () => {
  return (
    <Page title="สร้างร้านค้า">
      <ShopForm titleMessage={'สร้างร้านค้า'} confirmMessage={'สร้างร้านค้า'} />
    </Page>
  );
};

ShopCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopCreatePage;
