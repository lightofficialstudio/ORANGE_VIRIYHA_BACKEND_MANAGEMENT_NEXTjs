// next import
import * as React from 'react';
import { useState } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
// material-ui
import { Button, Stack, Grid, TextField, Typography, Autocomplete } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Link from 'next/link';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import Image from 'next/image';

// Type
// interface ShopBranchType {
//   status_id: number;
//   status_name: string;
// }

// Avatar
const Avatar1 = '/assets/images/users/avatar-2.png';
// autocomplete options

const ShopStatus = [
  { status_name: 'เปิดให้บริการ', value: 1 },
  { status_name: 'ปิดให้บริการ', value: 2 }
];

const ShopEdit = () => {
  // const router = useRouter();
  // const { id } = router.query;
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
    <Grid container spacing={3}>
      <Grid item sm={6} md={4}>
        <SubCard title="รูปภาพร้านค้า" contentSX={{ textAlign: 'center' }}>
          <Grid container spacing={2}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item>
                <Image alt="User 1" src={PreviewImg} style={{ margin: '0 auto' }} width={200} height={200} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="left" style={{ color: 'red' }}>
                *จำกัดขนาด 2MB และ รูปภาพต้องเป็นไฟล์ .jpg .png เท่านั้น <br></br>
                *รูปภาพต้องมีขนาดตั้งแต่ 500 x 500 ขึ้นไป
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                {/* <Button variant="contained" size="small">
                        อัพโหลดรูปภาพ
                      </Button> */}

                <InputLabel required style={{ textAlign: 'left' }}>
                  ที่อยู่รูปภาพ
                </InputLabel>
                <TextField fullWidth type="file" name="shop_image" onChange={handleImageChange}></TextField>
              </AnimateButton>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item sm={6} md={8}>
        <SubCard title="รายละเอียดร้านค้า">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel required>ชื่อร้านค้า</InputLabel>
              <TextField id="outlined-basic1" fullWidth placeholder="เช่น ร้านค้า KFC , Mcdonald" />
            </Grid>
            <Grid item xs={12}>
              <InputLabel required>หมวดหมู่</InputLabel>
              <Autocomplete
                options={ShopStatus}
                getOptionLabel={(option) => option.status_name}
                defaultValue={ShopStatus[0]}
                renderInput={(params) => <TextField {...params} />}
              />{' '}
            </Grid>
            <Grid item xs={12}>
              <InputLabel required>สถานะร้านค้า</InputLabel>
              <Autocomplete
                options={ShopStatus}
                getOptionLabel={(option) => option.status_name}
                defaultValue={ShopStatus[0]}
                renderInput={(params) => <TextField {...params} />}
              />{' '}
            </Grid>
            {/* <Grid item md={6} xs={12}>
                    <TextField fullWidth label="ละติจูด" name="shop_latitude"></TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField fullWidth label="ลองติจูด" name="shop_longtitude"></TextField>
                  </Grid> */}

            <Grid item xs={12}>
              <InputLabel required>รายละเอียดร้านค้า</InputLabel>

              <TextField multiline rows={3} id="outlined-basic8" fullWidth placeholder="รายละเอียดของร้านค้า เช่น ร้านค้า KFC" />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <AnimateButton>
                  <Button variant="contained" color="info">
                    แก้ไขร้านค้า
                  </Button>
                </AnimateButton>
                <Link href={'/admin/shop'}>
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
  );
};

export default ShopEdit;
