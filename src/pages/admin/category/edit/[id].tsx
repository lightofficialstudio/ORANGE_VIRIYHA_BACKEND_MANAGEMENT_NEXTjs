import * as React from 'react';
import { useState } from 'react';
import { ReactElement } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import JWTContext from 'contexts/JWTContext';
import { Grid, TextField, Typography, Button, Autocomplete, Stack } from '@mui/material';
import axiosServices from 'utils/axios';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import GoBackButton from 'components/viriyha_components/button/go_back';
import InputLabel from 'ui-component/extended/Form/InputLabel';

// Avatar
const Avatar1 = '/assets/images/users/avatar-2.png';
// autocomplete options

const Status = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

const CategoryCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const context = React.useContext(JWTContext);
  const baseUrl = process.env.REACT_APP_API_URL + 'image/category/';
  const [CategoryImage, SetCategoryImage] = useState('');
  const [PreviewImg, SetPreviewImg] = useState(Avatar1);
  const [CategoryName, SetCategoryName] = useState('');
  const [CategoryLink, SetCategoryLink] = useState('');
  const [CategoryStatus, SetCategoryStatus] = useState('');
  const [CategoryDescription, SetCategoryDescription] = useState('');
  const [CategoryMadeById] = useState(context?.user?.id);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosServices.get(`/api/category/${id}`);
        console.log(response);
        SetCategoryName(response.data.name);
        SetCategoryLink(response.data.link);
        SetCategoryStatus(response.data.status);
        SetCategoryDescription(response.data.description);
        SetPreviewImg(baseUrl + response.data.image); // Extract the image URL from the imageResponse object
      } catch (error: any) {
        console.log('ERROR! MESSAGE : ' + error);
      }
    };
    fetchData();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const fileName = file.name;
      SetCategoryImage(fileName);
      console.log(fileName);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          SetPreviewImg(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handeSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      name: CategoryName,
      status: CategoryStatus,
      image: CategoryImage,
      link: CategoryLink,
      description: CategoryDescription,
      madeById: CategoryMadeById
    };
    console.log(formData);
    try {
      const response = await axiosServices.post('/api/category', formData);
      console.log(response);
    } catch (error: any) {
      console.log('ERROR! MESSAGE : ' + error);
    }
  };
  return (
    <Page title="สร้างหมวดหมู่">
      <GoBackButton Link={`/admin/category/`} />
      <MainCard>
        <MainCard title="สร้างหมวดหมู่" content={true}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={4}>
              <SubCard title="รูปภาพหมวดหมู่" contentSX={{ textAlign: 'center' }}>
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
                      <InputLabel style={{ textAlign: 'left' }}>รูปภาพ</InputLabel>
                      <TextField fullWidth type="file" name="shop_image" onChange={handleImageChange}></TextField>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={6} md={8}>
              <SubCard title="รายละเอียดแบนเนอร์">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อหมวดหมู่</InputLabel>
                    <TextField
                      id="outlined-basic1"
                      name="banner_name"
                      fullWidth
                      placeholder="เช่น หมวดหมู่ร้านค้า"
                      onChange={(event: any) => {
                        SetCategoryName(event.target.value);
                      }}
                      value={CategoryName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel required>ลิงก์สิทธิพิเศษที่เชื่อมต่อ</InputLabel>
                    <TextField
                      id="outlined-basic1"
                      name="shop_branch_name"
                      fullWidth
                      onChange={(event: any) => {
                        SetCategoryLink(event.target.value);
                      }}
                      placeholder="เช่น https://www.viriyah.co.th/privilege/1234567890"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>สถานะ</InputLabel>
                    <Autocomplete
                      options={Status}
                      getOptionLabel={(option) => option.status_name}
                      onChange={(event: any, value: any) => {
                        SetCategoryStatus(value.status);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel>รายละเอียด</InputLabel>
                    <TextField
                      onChange={(event: any) => {
                        SetCategoryDescription(event.target.value);
                      }}
                      multiline
                      rows={3}
                      id="outlined-basic8"
                      fullWidth
                      placeholder="เช่น ร้านค้า KFC สาขานวลจันทร์ มีสิทธิพิเศษ ซื้อ 1 แถม 1 ทุกวันจันทร์ ถึง วันศุกร์ ตั้งแต่เวลา 10.00 - 14.00 น. สำหรับสมาชิกที่มีสิทธิพิเศษเท่านั้น"
                    />
                  </Grid>
                </Grid>
              </SubCard>
              <Grid container justifyContent="right" alignItems="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Stack direction="row" spacing={2}>
                    <AnimateButton>
                      <Button variant="contained" color="primary" onClick={handeSumbit}>
                        สร้างหมวดหมู่
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button href={`/admin/category/`} variant="contained" color="error">
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

CategoryCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CategoryCreatePage;
