import * as React from 'react';
import { ReactElement } from 'react';
import Link from 'Link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Tabs, Tab } from '@mui/material';

// project imports
import Page from 'components/ui-component/Page';

import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';

// viriyha components imports
import CodeTable from 'components/viriyha_components/form/campaign/code_table';
import DetailCampaignCard from 'components/viriyha_components/form/campaign/normal/detail/CampaignDetail';
import ConditionCampaign from 'components/viriyha_components/form/campaign/normal/detail/CampaignCondition';
import DescriptionCampaign from 'components/viriyha_components/form/campaign/normal/detail/CampaignDescription';

// assets

// types
import { TabsProps } from 'types';
import GoBackButton from 'components/viriyha_components/button/go_back';

// tabs
function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const NormalCampaignPage = () => {
  const theme = useTheme();

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Page title="รายละเอียดสิทธิพิเศษ">
      <GoBackButton Link={'/campaign/normal'} />

      <MainCard>
        <div>
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={handleChange}
            sx={{
              mb: 3,
              minHeight: 'auto',
              '& button': {
                minWidth: 100
              },
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900'
              },
              '& a.Mui-selected': {
                color: 'primary.main'
              }
            }}
            aria-label="simple tabs example"
            variant="scrollable"
          >
            <Tab component={Link} href="#" label="ข้อมูลสิทธิพิเศษ" {...a11yProps(0)} />
            <Tab component={Link} href="#" label="รายละเอียด" {...a11yProps(1)} />
            <Tab component={Link} href="#" label="เงื่อนไข" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <DetailCampaignCard />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DescriptionCampaign />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ConditionCampaign />
          </TabPanel>
        </div>
      </MainCard>
      <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
        <CodeTable />
      </Grid>

      <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
        <CodeTable />
      </Grid>
    </Page>
  );
};

NormalCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NormalCampaignPage;
