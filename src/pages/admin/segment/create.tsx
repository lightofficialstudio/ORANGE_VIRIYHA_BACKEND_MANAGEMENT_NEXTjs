import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import SegmentForm from 'components/viriyha_components/form/admin/SegmentForm';

const SegmentCreatePage = () => {
  return (
    <Page title="สร้างร้านค้า">
      <SegmentForm titleMessage={'สร้าง Segment'} confirmMessage={'สร้างข้อมูล'} />
    </Page>
  );
};

SegmentCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SegmentCreatePage;