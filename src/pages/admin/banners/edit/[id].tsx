import * as React from 'react';
import { useState } from 'react';
import { ReactElement } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Grid, TextField, Typography, Button, Autocomplete, Stack } from '@mui/material';

// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import GoBackButton from 'components/viriyha_components/button/go_back';

// Type
interface ShopBranchType {
  status_id: number;
  status_name: string;
}

// Avatar
const Avatar1 = '/assets/images/users/avatar-2.png';
// autocomplete options

const BannerStatus = [
  { status_name: 'เปิดใช้งาน', status_id: 1 },
  { status_name: 'ปิดใช้งาน', status_id: 2 }
];

const BannerEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const [PreviewImg, SetPreviewImg] = useState(Avatar1);
  const [FormSelectedShopStatus, SetFormSelectedShopStatus] = useState<ShopBranchType[]>([]);
  console.log(FormSelectedShopStatus);

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
    <Page title="สร้างแบนเนอร์">
      <GoBackButton Link={`/admin/banners/`} />
      <MainCard>
        <MainCard title="สร้างแบนเนอร์" content={true}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <SubCard title="รูปภาพแบนเนอร์" contentSX={{ textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                      <Image alt="User 1" src={PreviewImg} width={200} height={200} style={{ margin: '0 auto' }} />
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
                      {/* <Button variant="contained" size="small">
                        อัพโหลดรูปภาพ
                      </Button> */}
                      <TextField fullWidth label="ที่อยู่รูปภาพ" type="file" name="shop_image" onChange={handleImageChange}></TextField>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item md={12}>
              <SubCard title="รายละเอียดแบนเนอร์">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic1"
                      name="banner_name"
                      fullWidth
                      label="ชื่อแบนเนอร์"
                      placeholder="เช่น แบนเบอร์ฉลองครบรอบ 10 ปี วิริยะ"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic1"
                      name="shop_branch_name"
                      fullWidth
                      label="ลิงก์สิทธิพิเศษที่เชื่อมต่อ"
                      placeholder="เช่น https://www.viriyah.co.th/privilege/1234567890"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      options={BannerStatus}
                      getOptionLabel={(option) => option.status_name}
                      onChange={(event: any, value: any) => {
                        SetFormSelectedShopStatus(value);
                      }}
                      renderInput={(params) => <TextField {...params} label="สถานะ" />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      multiline
                      rows={3}
                      id="outlined-basic8"
                      fullWidth
                      label="รายละเอียด"
                      placeholder="เช่น ร้านค้า KFC สาขานวลจันทร์ มีสิทธิพิเศษ ซื้อ 1 แถม 1 ทุกวันจันทร์ ถึง วันศุกร์ ตั้งแต่เวลา 10.00 - 14.00 น. สำหรับสมาชิกที่มีสิทธิพิเศษเท่านั้น"
                    />
                  </Grid>
                </Grid>
              </SubCard>
              <Grid container justifyContent="right" alignItems="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Stack direction="row" spacing={2}>
                    <AnimateButton>
                      <Button variant="contained" color="info">
                        แก้ไขแบนเนอร์
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button href={`/admin/banners/`} variant="contained" color="error">
                        ยกเลิก
                      </Button>
                    </AnimateButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </MainCard>
    </Page>
  );
};

BannerEditPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BannerEditPage;
