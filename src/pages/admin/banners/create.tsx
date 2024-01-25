import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import GoBackButton from 'components/viriyha_components/button/go_back';
import BannerForm from 'components/viriyha_components/form/banner/BannerCreateForm';

// Type

const BannerCreatePage = () => {
  return (
    <Page title="สร้างแบนเนอร์">
      <GoBackButton Link={`/admin/banners/`} />
      <MainCard>
        <BannerForm titleMessage={'สร้างแบนเนอร์'} confirmMessage={'สร้างข้อมูล'} />
      </MainCard>
    </Page>
  );
};

BannerCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BannerCreatePage;
