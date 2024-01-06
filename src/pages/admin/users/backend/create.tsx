import * as React from 'react';
import { useState } from 'react';
import { ReactElement } from 'react';
import Link from 'next/link';

import { Grid, TextField, Typography, Button, Autocomplete, Stack } from '@mui/material';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
// import Avatar from 'ui-component/extended/Avatar';
import GoBackButton from 'components/viriyha_components/button/go_back';
import Image from 'next/image';

// Avatar
const Avatar1 = '/assets/images/users/avatar-5.png';
// autocomplete options
const ShopCategory = [
  { label: 'The Dark Knight', id: 1 },
  { label: 'Control with Control', id: 2 },
  { label: 'Combo with Solo', id: 3 },
  { label: 'The Dark', id: 4 },
  { label: 'Fight Club', id: 5 },
  { label: 'demo@company.com', id: 6 },
  { label: 'Pulp Fiction', id: 7 }
];

const ShopStatus = [
  { label: 'เปิดให้บริการ', id: 1 },
  { label: 'ปิดให้บริการ', id: 2 }
];

const ShopCreatePage = () => {
  const [PreviewImg, SetPreviewImg] = useState(Avatar1);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          SetPreviewImg(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Page title="สร้างผู้ใช้งานจัดการระบบหลังบ้านใหม่">
      <GoBackButton Link={'/admin/users/backend'} />
      <MainCard>
        <MainCard title="[สร้างผู้ใช้งาน] จัดการระบบหลังบ้าน" content={true}>
          <Grid container spacing={3}>
            <Grid item sm={6} md={4}>
              <SubCard title="รูปภาพประจำตัว" contentSX={{ textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                      <Image alt="User 1" src={PreviewImg} style={{ margin: '0 auto' }} width={200} height={200} />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" align="center" style={{ color: 'red' }}>
                      *จำกัดขนาด 2MB และ รูปภาพต้องเป็นไฟล์ .jpg .png เท่านั้น <br></br>
                      *รูปภาพต้องมีขนาดตั้งแต่ 200 x 200 ขึ้นไป
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AnimateButton>
                      {/* <Button variant="contained" size="small">
                        อัพโหลดรูปภาพ
                      </Button> */}
                      <TextField fullWidth label="ที่อยู่รูปภาพ" type="file" name="shop_image" onChange={handleImageChange}></TextField>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item sm={6} md={8}>
              <SubCard title="ข้อมูลผู้ใช้งาน">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField id="outlined-basic1" fullWidth label="ชื่อร้านค้า" placeholder="เช่น ร้านค้า KFC , Mcdonald" />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={ShopCategory}
                      getOptionLabel={(option) => option.label}
                      defaultValue={ShopCategory[0]}
                      renderInput={(params) => <TextField {...params} label="หมวดหมู่" />}
                    />{' '}
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={ShopStatus}
                      getOptionLabel={(option) => option.label}
                      defaultValue={ShopStatus[0]}
                      renderInput={(params) => <TextField {...params} label="สถานะ" />}
                    />{' '}
                  </Grid>
                  {/* <Grid item md={6} xs={12}>
                    <TextField fullWidth label="ละติจูด" name="shop_latitude"></TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField fullWidth label="ลองติจูด" name="shop_longtitude"></TextField>
                  </Grid> */}

                  <Grid item xs={12}>
                    <TextField
                      multiline
                      rows={3}
                      id="outlined-basic8"
                      fullWidth
                      label="รายละเอียดร้านค้า"
                      placeholder="รายละเอียดของร้านค้า เช่น ร้านค้า KFC"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <AnimateButton>
                        <Button variant="contained" color="primary">
                          สร้างร้านค้า
                        </Button>
                      </AnimateButton>
                      <Link href={'/admin/users/backend'}>
                        <AnimateButton>
                          <Button variant="contained" color="error">
                            ยกเลิก
                          </Button>
                        </AnimateButton>
                      </Link>
                    </Stack>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </MainCard>
      </MainCard>
    </Page>
  );
};

ShopCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopCreatePage;
