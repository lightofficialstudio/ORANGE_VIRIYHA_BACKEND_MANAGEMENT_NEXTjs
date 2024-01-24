// react
import { useState } from 'react';
// material-ui
import { Button, Grid, TextField, Typography, Autocomplete, FormControlLabel, Radio, RadioGroup, FormControl } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);
  const [valueColor, setValueColor] = useState('default');

  // Event handler for quota type change
  const handleQuotaTypeChange = (event: any, value: any) => {
    setIsQuotaDisabled(value.id === 4);
  };
  return (
    <MainCard title="" content={true}>
      <Grid container spacing={gridSpacing}>
        <Grid item sm={6} md={4}>
          <SubCard title="รูปภาพสิทธิพิเศษ" contentSX={{ textAlign: 'center' }}>
            <Grid container spacing={2}>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item>
                  <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                </Grid>

                <Grid item>
                  <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                </Grid>

                <Grid item>
                  <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                </Grid>

                <Grid item>
                  <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" align="center">
                  อัพโหลด/เปลี่ยน รูปภาพของสิทธิพิเศษ
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button variant="contained" size="small">
                    อัพโหลดรูปภาพ
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item sm={6} md={8}>
          <SubCard title="รายละเอียดสิทธิพิเศษ">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={12}>
                <InputLabel required>ชื่อสิทธิพิเศษ</InputLabel>
                <TextField fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel required>วันที่เริ่มต้น</InputLabel>
                <TextField fullWidth type="date" id="campaign_start_date" name="campaign_start_date" />{' '}
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel required>วันที่สิ้นสุด</InputLabel>
                <TextField fullWidth type="date" id="campaign_end_date" name="campaign_end_date" label="" />{' '}
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel required>จำนวนสิทธิพิเศษรวมทั้งโครงการ </InputLabel>
                <TextField fullWidth placeholder="จำนวนคน" disabled={isQuotaDisabled} />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel required>ประเภทสิทธิพิเศษ</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      options={quotaChoose}
                      getOptionLabel={(option) => option.label}
                      onChange={handleQuotaTypeChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>{' '}
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel required>จำกัดจำนวน</InputLabel>
                <TextField fullWidth placeholder="จำนวนคน" />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel required>การจำกัดของสิทธิพิเศษ</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      options={maxQuotaPerPerson}
                      getOptionLabel={(option) => option.label}
                      onChange={handleQuotaTypeChange}
                      defaultValue={maxQuotaPerPerson[0]}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>{' '}
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel required>เป้าหมายสิทธิพิเศษ (Criteria)</InputLabel>
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
              </Grid>

              <Grid item md={6} xs={12}>
                <InputLabel required>เป้าหมายสิทธิพิเศษ (Segment)</InputLabel>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      multiple
                      options={top100Films}
                      getOptionLabel={(option) => option.label}
                      defaultValue={[top100Films[2], top100Films[3]]}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} lg={6}>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <InputLabel required>ร้านค้าที่เข้าร่วม</InputLabel>
                    <Autocomplete
                      options={top100Films}
                      getOptionLabel={(option) => option.label}
                      defaultValue={top100Films[0]}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} lg={6}>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <InputLabel required>สาขา</InputLabel>
                    <Grid item>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-label="shopIncludeExclude"
                          value={valueColor}
                          onChange={(e) => setValueColor(e.target.value)}
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="include"
                            control={
                              <Radio
                                sx={{
                                  color: theme.palette.success.main,
                                  '&.Mui-checked': { color: theme.palette.success.main }
                                }}
                              />
                            }
                            label="สาขาที่เข้าร่วม"
                          />
                          <FormControlLabel
                            value="exclude"
                            control={
                              <Radio
                                sx={{
                                  color: theme.palette.error.main,
                                  '&.Mui-checked': { color: theme.palette.error.main }
                                }}
                              />
                            }
                            label="สาขาที่ยกเว้น"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Autocomplete
                      multiple
                      options={top100Films}
                      getOptionLabel={(option) => option.label}
                      defaultValue={[top100Films[0], top100Films[4]]}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
                <AnimateButton>
                  <Button variant="contained">แก้ไข</Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DetailCampaignCard;
