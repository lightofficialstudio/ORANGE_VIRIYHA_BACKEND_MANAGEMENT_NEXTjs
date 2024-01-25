import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import GoBackButton from 'components/viriyha_components/button/go_back';
import BackendUserForm from 'components/viriyha_components/form/user/BackendUserForm';

// Type

const BannerCreatePage = () => {
  return (
    <Page title="สร้างแบนเนอร์">
      <GoBackButton Link={`/admin/banners/`} />
      <MainCard>
        <BackendUserForm titleMessage={'สร้างผู้ใช้ใหม่'} confirmMessage={'สร้างข้อมูล'} />
      </MainCard>
    </Page>
  );
};

BannerCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BannerCreatePage;
