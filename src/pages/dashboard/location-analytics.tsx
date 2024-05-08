import React, { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import axiosServices from 'utils/axios';

// dashboard
import DashboardLocationGraph from 'components/viriyha_components/dashboard/DashboardLocationGraph';
import DashboardLocationCard from 'components/viriyha_components/dashboard/DashboardLocationCard';
const LocationAnalyticsTransaction = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosServices.get('/api/dashboard/redeem');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <Page title="Default Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={8}>
          <MainCard title="กราฟรายงานสถานที่กดรับสิทธิ์">
            <DashboardLocationGraph data={data?.Campaign_Count} />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid item sm={6} xs={12} md={12} lg={12}>
            <DashboardLocationCard
              isLoading={isLoading}
              titleMessage={'จังหวัดที่มีการกดรับสิทธิ์สูงสุด '}
              param={data?.Campaign_Transaction?.Weekly_Transaction ?? 'Loading...'}
              province={'กรุงเทพมหานคร'}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={12} lg={12} marginTop={'2rem'}>
            <DashboardLocationCard
              isLoading={isLoading}
              titleMessage={'จังหวัดที่มีการกดรับสิทธิ์ต่ำสุด'}
              param={data?.Campaign_Transaction?.Weekly_Transaction ?? 'Loading...'}
              province={'สงขลา'}
            />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

LocationAnalyticsTransaction.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LocationAnalyticsTransaction;
