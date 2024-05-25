import React, { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import DashboardLightCard from 'components/viriyha_components/dashboard/DashboardLightCard';
import MainCard from 'ui-component/cards/MainCard';
import DashboardRedeemGraph from 'components/viriyha_components/dashboard/DashboardRedeemGraph';
import axiosServices from 'utils/axios';

const DashboardRedeemTransaction = () => {
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
    <Page title=" Dashboard">
      <Grid container spacing={2} marginBottom={2}>
        <Grid item sm={3} xs={3} md={3} lg={3}>
          <DashboardLightCard
            isLoading={isLoading}
            titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้ววันนี้'}
            param={data?.Campaign_Transaction?.Daily_Transaction ?? 'Loading...'}
          />
        </Grid>
        <Grid item sm={3} xs={3} md={3} lg={3}>
          <DashboardLightCard
            isLoading={isLoading}
            titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วสัปดาห์นี้'}
            param={data?.Campaign_Transaction?.Weekly_Transaction ?? 'Loading...'}
          />
        </Grid>
        <Grid item sm={3} xs={3} md={3} lg={3}>
          <DashboardLightCard
            isLoading={isLoading}
            titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วเดือนนี้'}
            param={data?.Campaign_Transaction?.Monthly_Transaction ?? 'Loading...'}
          />
        </Grid>
        <Grid item sm={3} xs={3} md={3} lg={3}>
          <DashboardLightCard
            isLoading={isLoading}
            titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วทั้งหมด'}
            param={data?.Campaign_Transaction?.Total_Transaction ?? 'Loading...'}
          />
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12} lg={12}>
          <MainCard title="กราฟแสดงการรับสิทธิ์">
            <DashboardRedeemGraph data={data?.Campaign_Count} />
          </MainCard>
        </Grid>
      </Grid>
    </Page>
  );
};

DashboardRedeemTransaction.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardRedeemTransaction;
