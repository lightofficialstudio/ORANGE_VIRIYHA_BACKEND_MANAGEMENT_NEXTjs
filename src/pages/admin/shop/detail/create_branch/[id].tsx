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
import InputLabel from 'ui-component/extended/Form/InputLabel';

// Type
interface ShopBranchType {
  status_id: number;
  status_name: string;
}

// Avatar
const Avatar1 = '/assets/images/users/avatar-2.png';
// autocomplete options

const ShopStatus = [
  { status_name: 'เปิดให้บริการ', status_id: 1 },
  { status_name: 'ปิดให้บริการ', status_id: 2 }
];

const ShopCreateBranchPage = () => {
  const router = useRouter();
  const { id } = router.query;
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
    <Page title="สร้างสาขาใหม่">
      <MainCard>
        <MainCard title="สร้างสาขา" content={true}>
          <Grid container spacing={3}>
            <Grid item sm={6} md={4}>
              <SubCard title="รูปภาพร้านค้า" contentSX={{ textAlign: 'center' }}>
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
            <Grid item sm={6} md={8}>
              <SubCard title="รายละเอียดสาขา">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อร้านค้า</InputLabel>
                    <TextField
                      id="outlined-basic1"
                      name="shop_name"
                      fullWidth
                      placeholder="เช่น ร้านค้า KFC , Mcdonald"
                      value="KFC"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อสาขา</InputLabel>
                    <TextField
                      id="outlined-basic1"
                      name="shop_branch_name"
                      fullWidth
                      placeholder="เช่น Mcdonald สาขาราชพฤกษ์ , KFC สาขานวลจันทร์"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>สถานะ</InputLabel>

                    <Autocomplete
                      options={ShopStatus}
                      getOptionLabel={(option) => option.status_name}
                      onChange={(event: any, value: any) => {
                        SetFormSelectedShopStatus(value);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <InputLabel required>ละติจูด</InputLabel>

                    <TextField fullWidth name="shop_latitude"></TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <InputLabel required>ลองติจูด</InputLabel>

                    <TextField fullWidth name="shop_longtitude"></TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>รายละเอียดร้านค้า</InputLabel>

                    <TextField multiline rows={3} id="outlined-basic8" fullWidth placeholder="รายละเอียดของร้านค้า เช่น ร้านค้า KFC" />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <AnimateButton>
                        <Button variant="contained" color="primary">
                          สร้างสาขา
                        </Button>
                      </AnimateButton>
                      <AnimateButton>
                        <Button href={`/admin/shop/detail/${id}`} variant="contained" color="error">
                          ยกเลิก
                        </Button>
                      </AnimateButton>
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

ShopCreateBranchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ShopCreateBranchPage;
