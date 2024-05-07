import React, { useEffect, useState, ReactElement, useContext } from 'react';
import { Grid } from '@mui/material';

// Import your components and context
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import DashboardCard from 'components/viriyha_components/dashboard/DashboardCard';
import DashboardLightCard from 'components/viriyha_components/dashboard/DashboardLightCard';
import DashboardGraph from 'components/viriyha_components/dashboard/DashboardGraph';
import JWTContext from 'contexts/JWTContext';
import axiosServices from 'utils/axios';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({
    viewsToday: 0,
    viewsWeek: 0,
    viewsMonth: 0,
    viewsTotal: 0,
    viewMonthSummary: []
  });

  const context = useContext(JWTContext);
  const MadeById = context?.user?.userInfo?.id;

  if (!MadeById) {
    window.location.reload();
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosServices.get('/api/dashboard/website');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  return (
    <Page title="Default Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard isLoading={isLoading} param={data.viewsTotal.toLocaleString()} titleMessage={'การเข้าชมเว็บไซต์ทั้งหมด'} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard
                isLoading={isLoading}
                param={data.viewsMonth.toLocaleString() ? data.viewsMonth.toLocaleString() : '0'}
                titleMessage={'การเข้าชมเว็บไซต์เดือนนี้'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <DashboardGraph
                titleMessage={'กราฟการเข้าใช้งานเว็บไซต์'}
                month={data.viewMonthSummary} // Pass the array directly
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardCard isLoading={isLoading} param={data.viewsToday.toLocaleString()} titleMessage={'การเข้าชมเว็บไซต์วันนี้'} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard
                    isLoading={isLoading}
                    param={data.viewsWeek.toLocaleString()}
                    titleMessage={'การเข้าชมเว็บไซต์สัปดาห์นี้'}
                  />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard
                    isLoading={isLoading}
                    param={data.viewsMonth.toLocaleString() ? data.viewsMonth.toLocaleString() : '0'}
                    titleMessage={'การเข้าชมเว็บไซต์เดือนนี้'}
                  />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard
                    isLoading={isLoading}
                    param={data.viewsTotal.toLocaleString()}
                    titleMessage={'การเข้าชมเว็บไซต์ทั้งหมด'}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
