import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import DashboardCard from 'components/viriyha_components/dashboard/DashboardCard';
import DashboardCard2 from 'components/viriyha_components/dashboard/DashboardCard2';
import DashboardCard3 from 'components/viriyha_components/dashboard/DashboardCard3';
import DashboardGraph from 'components/viriyha_components/dashboard/DashboardGraph';
import DashboardLightCard from 'components/viriyha_components/dashboard/DashboardLightCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Page title="Default Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard2 isLoading={isLoading} />
            </Grid>
            {/* <Grid item lg={4} md={12} sm={12} xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardCard3 isLoading={isLoading} titleMessage={'การเยี่ยมชมเว็บไซต์วันนี้'} paramClick={'23,142'} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardCard3 isLoading={isLoading} titleMessage={'การเยี่ยมชมเว็บไซต์ทั้งหมด'} paramClick={'1,273,156'} />
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <DashboardGraph titleMessage={'กราฟการเข้าใช้งานเว็บไซต์'} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardCard3 isLoading={isLoading} titleMessage={'การเข้าชมเว็บไซต์วันนี้'} paramClick={'23,423'} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'การเข้าชมเว็บไซต์อาทิตย์นี้'} paramClick={'302,532'} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'การเข้าชมเว็บไซต์เดือนนี้'} paramClick={'582,532'} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'การเข้าชมเว็บไซต์ทั้งหมด'} paramClick={'802,532'} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <DashboardGraph titleMessage={'กราฟการใช้งานโค้ด'} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardCard3 isLoading={isLoading} titleMessage={'โค้ดที่ใช้งานแล้ว วันนี้'} paramClick={'23,423'} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'โค้ดที่ยังไม่ถูกใช้งาน วันนี้'} paramClick={'802,532'} />
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
