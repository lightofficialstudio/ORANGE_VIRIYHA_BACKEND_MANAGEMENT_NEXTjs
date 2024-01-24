// react
import { useState } from 'react';
// material-ui
import { Button, Grid, TextField, Typography, Autocomplete } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
// icon
import InputLabel from 'ui-component/extended/Form/InputLabel';
// Avatar
const Avatar1 = '/assets/images/users/avatar-1.png';
const quotaChoose = [
  { label: 'รายวัน', id: 1 },
  { label: 'รายสัปดาห์', id: 2 },
  { label: 'รายเดือน', id: 3 },
  { label: 'ไม่จำกัด', id: 4 }
];

const top100Films = [
  { label: 'The Dark Knight', id: 1 },
  { label: 'Control with Control', id: 2 },
  { label: 'Combo with Solo', id: 3 },
  { label: 'The Dark', id: 4 },
  { label: 'Fight Club', id: 5 },
  { label: 'demo@company.com', id: 6 },
  { label: 'Pulp Fiction', id: 7 }
];

const maxQuotaPerPerson = [
  { label: 'คน/วัน', id: 1 },
  { label: 'คน/สัปดาห์', id: 2 },
  { label: 'คน/เดือน', id: 3 },
  { label: 'ไม่จำกัด', id: 4 }
];
const DetailCampaignCard = () => {
  const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);

  // Event handler for quota type change
  const handleQuotaTypeChange = (event: any, value: any) => {
    setIsQuotaDisabled(value.id === 4);
  };
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
