import * as React from 'react';
import { ReactElement } from 'react';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import SegmentForm from 'components/viriyha_components/form/admin/SegmentForm';

const SegmentCreatePage = () => {
  return (
    <Page title="สร้างกลุ่มการตลาด (Create Segment)">
      <SegmentForm titleMessage={'สร้างกลุ่มการตลาด (Create Segment)'} confirmMessage={'สร้างข้อมูลใหม่'} />
    </Page>
  );
};

SegmentCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SegmentCreatePage;
