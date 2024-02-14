// react
// material-ui
import { Grid, TextField, Autocomplete } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
// icon
// Avatar

const top100Films = [
  { label: 'The Dark Knight', id: 1 },
  { label: 'Control with Control', id: 2 },
  { label: 'Combo with Solo', id: 3 },
  { label: 'The Dark', id: 4 },
  { label: 'Fight Club', id: 5 },
  { label: 'demo@company.com', id: 6 },
  { label: 'Pulp Fiction', id: 7 }
];

const DetailCampaignCard = () => {
  return (
    <MainCard title="" content={true}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={6} lg={6}>
          <SubCard title="ร้านค้าที่เข้าร่วม">
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  defaultValue={top100Films[0]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <SubCard title="สาขาที่เข้าร่วม">
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  multiple
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  defaultValue={[top100Films[0], top100Films[4]]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DetailCampaignCard;
