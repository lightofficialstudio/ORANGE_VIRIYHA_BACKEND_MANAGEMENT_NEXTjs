// material-ui
import { Button, Stack, Grid, TextField, Typography, Autocomplete } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// icon
import FormControl from 'ui-component/extended/Form/FormControl';
// Avatar
const Avatar1 = '/assets/images/users/avatar-1.png';
// autocomplete options
const top100Films = [
  { label: 'The Dark Knight', id: 1 },
  { label: 'Control with Control', id: 2 },
  { label: 'Combo with Solo', id: 3 },
  { label: 'The Dark', id: 4 },
  { label: 'Fight Club', id: 5 },
  { label: 'demo@company.com', id: 6 },
  { label: 'Pulp Fiction', id: 7 }
];

const ShopDetail = () => {
  return (
    <MainCard title="" content={true}>
      <Grid container spacing={gridSpacing}>
        <Grid item sm={6} md={4}>
          <SubCard title="รูปภาพร้านค้า" contentSX={{ textAlign: 'center' }}>
            <Grid container spacing={2}>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item>
                  <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" align="center" style={{ color: 'red' }}>
                  *จำกัดขนาด 2MB และ รูปภาพต้องเป็นไฟล์ .jpg .png เท่านั้น <br></br>
                  *รูปภาพต้องมีขนาดตั้งแต่ 500 x 500 ขึ้นไป
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
          <SubCard title="รายละเอียดร้านค้า">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <TextField id="outlined-basic1" fullWidth label="ชื่อร้านค้า" defaultValue="KFC" />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  defaultValue={top100Films[0]}
                  renderInput={(params) => <TextField {...params} label="หมวดหมู่" />}
                />{' '}
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField type="date" id="outlined-basic4" fullWidth label="วันที่เริ่มต้น" defaultValue="2024-03-01" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField type="date" id="outlined-basic5" fullWidth label="วันที่สิ้นสุด" defaultValue="2024-07-02" />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl textSecondary="คน" captionLabel="จำนวนโควต้า" placeholder="20,30" defaultValue="25" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField id="outlined-basic8" fullWidth label="Birthday" defaultValue="31/01/2001" />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <AnimateButton>
                    <Button variant="contained">แก้ไขข้อมูล</Button>
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

export default ShopDetail;
