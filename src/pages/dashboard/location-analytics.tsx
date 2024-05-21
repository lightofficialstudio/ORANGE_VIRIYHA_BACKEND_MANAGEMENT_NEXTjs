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
  const [maxPlace, setMaxPlace] = useState<string>('');
  const [countMaxPlace, setCountMaxPlace] = useState<number>(0);
  const [minPlace, setMinPlace] = useState<string>('');
  const [countMinPlace, setCountMinPlace] = useState<number>(0);

  if (!MadeById) {
    window.location.reload();
  }

  const processData = (data: any) => {
    const placeCount: Record<string, number> = {};
    data.forEach((data: any) => {
      data.Campaign_Code?.forEach((campaign: any) => {
        campaign.Campaign_Transaction.forEach((transaction: any) => {
          const placeName = transaction.place?.name;
          if (placeName) {
            if (!placeCount[placeName]) {
              placeCount[placeName] = 0;
            }
            placeCount[placeName]++;
          }
        });
      });
    });

    let maxPlace = '';
    let minPlace = '';
    let maxCount = 0;
    let minCount = Infinity;

    for (const place in placeCount) {
      if (placeCount[place] > maxCount) {
        maxCount = placeCount[place];
        maxPlace = place;
      }
      if (placeCount[place] < minCount) {
        minCount = placeCount[place];
        minPlace = place;
      }
    }

    setMaxPlace(maxPlace);
    setMinPlace(minPlace);
    setCountMaxPlace(maxCount);
    setCountMinPlace(minCount);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosServices.get('/api/location_transaction');
        const responseData = response?.data;
        setData(responseData);
        processData(responseData);
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
              <DashboardCard
                isLoading={isLoading}
                param={countMaxPlace.toString()}
                titleMessage={`จังหวัดที่มีการเข้าชมสูงสุด : ${maxPlace}`}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <DashboardCard
                isLoading={isLoading}
                param={countMinPlace.toString()}
                titleMessage={`จังหวัดที่มีการเข้าชมต่ำสุด : ${minPlace}`}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <DashboardLocationGraph titleMessage={'กราฟการเข้าชมแคมเปญ'} data={data} />
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
