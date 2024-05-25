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
    <Page title="เพิ่มผู้ใช้งานใหม่">
      <GoBackButton Link={`/admin/users/backend/`} />
      <MainCard>
        <BackendUserForm titleMessage={'เพิ่มผู้ใช้งานใหม่'} confirmMessage={'ยืนยัน'} />
      </MainCard>
    </Page>
  );
};

BannerCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BannerCreatePage;
