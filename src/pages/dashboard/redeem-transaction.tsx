import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import DashboardCard3 from 'components/viriyha_components/dashboard/DashboardCard3';
import DashboardLightCard from 'components/viriyha_components/dashboard/DashboardLightCard';
import MainCard from 'ui-component/cards/MainCard';
import DashboardColumnGraph from 'components/viriyha_components/dashboard/DashboardColumnGraph';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const DashboardRedeemTransaction = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Page title="Default Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
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
              <MainCard title="กราฟการใช้งานสิทธิพิเศษ">
                <DashboardColumnGraph />
              </MainCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={12} lg={12}>
                  <DashboardCard3 isLoading={isLoading} titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้ววันนี้'} paramClick={'23,423'} />
                </Grid>
                <Grid item sm={6} xs={12} md={12} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วสัปดาห์นี้'} paramClick={'302,532'} />
                </Grid>
                <Grid item sm={6} xs={12} md={12} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วเดือนนี้'} paramClick={'582,532'} />
                </Grid>
                <Grid item sm={6} xs={12} md={12} lg={12}>
                  <DashboardLightCard isLoading={isLoading} titleMessage={'มีสิทธิ์ที่ถูกใช้งานแล้วทั้งหมด'} paramClick={'802,532'} />
                </Grid>
              </Grid>
            </Grid>
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
