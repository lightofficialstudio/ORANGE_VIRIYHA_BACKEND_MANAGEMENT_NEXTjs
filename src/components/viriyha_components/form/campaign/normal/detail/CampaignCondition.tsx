import dynamic from 'next/dynamic';
// material-ui
import { Button, Stack, Grid } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
// third-party
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
import 'react-quill/dist/quill.snow.css';

const ConditionCampaign = () => {
  return (
    <MainCard title="" content={true}>
      <Grid container spacing={gridSpacing}>
        <Grid item sm={6} md={12}>
          <SubCard title="เงื่อนไขสิทธิพิเศษ">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <ReactQuill
                  onChange={(value) => {
                    console.log(value);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row">
                  <AnimateButton>
                    <Button variant="contained">แก้ไข</Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ConditionCampaign;
