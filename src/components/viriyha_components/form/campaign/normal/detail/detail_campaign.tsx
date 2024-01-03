// material-ui
import { Button, Stack, Grid, TextField, Typography } from '@mui/material';

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

const DetailCampaignCard = () => {
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
              <Grid item xs={12}>
                <TextField id="outlined-basic1" fullWidth label="ชื่อสิทธิพิเศษ" defaultValue="test" helperText="ชื่อของสิทธิพิเศษนี้" />
              </Grid>
              <Grid item xs={12}>
                <TextField id="outlined-basic6" fullWidth label="Email address" defaultValue="name@example.com" />
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

export default DetailCampaignCard;
