import React, { useEffect, useState, ReactElement, useContext } from 'react';
import { Grid } from '@mui/material';

// Import your components and context
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import { gridSpacing } from 'store/constant';
import DashboardCard from 'components/viriyha_components/dashboard/DashboardCard';
import JWTContext from 'contexts/JWTContext';
import axiosServices from 'utils/axios';
import DashboardLocationGraph from 'components/viriyha_components/dashboard/DashboardLocationGraph';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const context = useContext(JWTContext);
  const MadeById = context?.user?.userInfo?.id;

  // variable

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
    console.log(data);
  }, []);

  return (
    <Page title="Default Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard
                isLoading={isLoading}
                param={data.All_Viewed?.total_view.toLocaleString()}
                titleMessage={'จังหวัดที่มีการเข้าชมสูงสุด : กรุงเทพมหานคร '}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard
                isLoading={isLoading}
                param={data.All_Viewed?.total_unique_view.toLocaleString()}
                titleMessage={'จังหวัดที่มีการเข้าชมต่ำสุด : สมุทรสาคร'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <DashboardLocationGraph titleMessage={'กราฟการเข้าชมแคมเปญ'} data={data.campaigns} />
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
