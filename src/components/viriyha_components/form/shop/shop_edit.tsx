// next import
import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
// material-ui
import { Button, Stack, Grid, TextField, Typography, Autocomplete } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';

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

const ShopEdit = () => {
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
        <SubCard title="รายละเอียดร้านค้า">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic1"
                name="shop_name"
                fullWidth
                label="ชื่อร้านค้า"
                placeholder="เช่น ร้านค้า KFC , Mcdonald"
                value="KFC"
                disabled
              />
            </Grid>
            

            <Grid item xs={12}>
              <Autocomplete
                options={ShopStatus}
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
                label="รายละเอียดร้านค้า"
                placeholder="รายละเอียดของร้านค้า เช่น ร้านค้า KFC"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <AnimateButton>
                  <Button variant="contained" color="warning">
                    แก้ไขร้านค้า
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
  );
};

export default ShopEdit;
