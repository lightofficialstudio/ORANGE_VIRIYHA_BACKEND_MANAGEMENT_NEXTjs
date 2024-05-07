import React, { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import DashboardLightCard from 'components/viriyha_components/dashboard/DashboardLightCard';
import MainCard from 'ui-component/cards/MainCard';
import DashboardColumnGraph from 'components/viriyha_components/dashboard/DashboardColumnGraph';
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
    <Page title="Default Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={8}>
          <MainCard title="กราฟการใช้งานสิทธิพิเศษ">
            <DashboardColumnGraph data={data?.Campaign_Count} />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid item sm={6} xs={12} md={12} lg={12}>
            <DashboardLightCard
              isLoading={isLoading}
              titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้ววันนี้'}
              param={data?.Campaign_Transaction?.Daily_Transaction ?? 'Loading...'}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={12} lg={12} marginTop={'2rem'}>
            <DashboardLightCard
              isLoading={isLoading}
              titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วสัปดาห์นี้'}
              param={data?.Campaign_Transaction?.Weekly_Transaction ?? 'Loading...'}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={12} lg={12} marginTop={'2rem'}>
            <DashboardLightCard
              isLoading={isLoading}
              titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วเดือนนี้'}
              param={data?.Campaign_Transaction?.Monthly_Transaction ?? 'Loading...'}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={12} lg={12} marginTop={'2rem'}>
            <DashboardLightCard
              isLoading={isLoading}
              titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วทั้งหมด'}
              param={data?.Campaign_Transaction?.Total_Transaction ?? 'Loading...'}
            />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

DashboardRedeemTransaction.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardRedeemTransaction;
