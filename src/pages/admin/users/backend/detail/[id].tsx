import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import GoBackButton from 'components/viriyha_components/button/go_back';
import BackendUserForm from 'components/viriyha_components/form/user/BackendUserForm';

// Type

const BannerCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="แก้ไขผู้ใช้งาน">
      <GoBackButton Link={`/admin/users/backend/`} />
      <MainCard>
        <BackendUserForm titleMessage={'แก้ไขผู้ใช้งาน'} confirmMessage={'ยืนยัน'} primaryId={id as string} />
      </MainCard>
    </Page>
  );
};

BannerCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BannerCreatePage;
