import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import SegmentForm from 'components/viriyha_components/form/admin/SegmentForm';

const SegmentEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Page title="สร้างร้านค้า">
      <SegmentForm titleMessage={'แก้ไข Segment'} confirmMessage={'แก้ไขข้อมูล'} primaryId={id as string} />
    </Page>
  );
};

SegmentEditPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SegmentEditPage;
