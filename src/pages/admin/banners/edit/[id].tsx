import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import GoBackButton from 'components/viriyha_components/button/go_back';
import BannerForm from 'components/viriyha_components/form/admin/BannerForm';

// Type

const BannerCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="v1 แก้ไขแบนเนอร์ (Edit Banner) ">
      <GoBackButton Link={`/admin/banners/`} />
      <MainCard>
        <BannerForm titleMessage={'แก้ไขแบนเนอร์ (Edit Banner)'} confirmMessage={'แก้ไขข้อมูลแบนเนอร์'} primaryId={id as string} />
      </MainCard>
    </Page>
  );
};

BannerCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BannerCreatePage;
