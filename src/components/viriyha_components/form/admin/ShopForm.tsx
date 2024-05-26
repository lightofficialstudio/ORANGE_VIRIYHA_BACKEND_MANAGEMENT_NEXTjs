import * as React from 'react';
import { useState } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
import JWTContext from 'contexts/JWTContext';
import { Grid, TextField, Typography, Button, Autocomplete, Stack } from '@mui/material';
import axiosServices from 'utils/axios';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import InputLabel from 'ui-component/extended/Form/InputLabel';
// import value from 'scss/_themes-vars.module.scss';
// Dialog
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';
// Mockup Logo
const MockupLogo = '/assets/default-img/shop.jpg';
// third-party - validation
import { useFormik } from 'formik';
import * as yup from 'yup';
// autocomplete options

const StatusOption = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

type ShopFormProps = {
  titleMessage: string;
  confirmMessage?: string;
  shopId?: string;
};

// validation schema
const validationSchema = yup.object({
  Name: yup.string().required('กรุณาใส่ชื่อหมวดหมู่ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Status: yup.string().required('กรุณาเลือกสถานะของหมวดหมู่ให้ครบถ้วน')
});

const ShopForm = ({ titleMessage, confirmMessage, shopId }: ShopFormProps) => {
  //   const router = useRouter();
  //   const { id } = router.query;
  const context = React.useContext(JWTContext);
  const [PreviewImg, SetPreviewImg] = useState(MockupLogo);
  const [Name, setName] = useState('');
  const [ImageShop, setImageShop] = useState<File | null>(null);
  const [Status, setStatus] = useState('');
  const MadeById = context?.user?.userInfo?.id;
  if (!MadeById) {
    window.location.reload();
  }
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // validation
  const formik = useFormik({
    initialValues: {
      Name: Name,
      Status: Status
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      try {
      } catch (error: any) {}
    }
  });
  React.useEffect(() => {
    const imgUrl = process.env.IMAGE_VIRIYHA_URL + '/images/shop';

    if (shopId) {
      axiosServices.get(`/api/shop/${shopId}`).then((response) => {
        console.log(response);
        setName(response.data.name);
        setStatus(response.data.status);
        response.data.image ? SetPreviewImg(`${imgUrl}/${response.data.image}`) : SetPreviewImg(MockupLogo);
      });
    }
  }, [shopId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ไม่เกิน 4MB
      const isFileSizeValid = file.size <= 4 * 1024 * 1024; // 4MB
      // ตรวจสอบนามสกุลไฟล์
      const isFileTypeValid = /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (!isFileSizeValid) {
        setErrorMessage('ขนาดไฟล์รูปภาพต้องไม่เกิน 4MB');
        setOpenErrorDialog(true);
        return; // หยุดการทำงานถัดไปหากขนาดไฟล์ไม่ถูกต้อง
      }

      if (!isFileTypeValid) {
        setErrorMessage('รูปภาพต้องเป็นไฟล์ .jpg, .jpeg, .png, .webp เท่านั้น');
        setOpenErrorDialog(true);
        return; // หยุดการทำงานถัดไปหากนามสกุลไฟล์ไม่ถูกต้อง
      }

      // ถ้าเงื่อนไขทั้งหมดถูกต้อง, ดำเนินการต่อ
      const reader = new FileReader();
      const fileName = file.name;
      setImageShop(file);
      console.log(fileName);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          SetPreviewImg(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!Name || !Status) {
      setOpenErrorDialog(true);
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', Name);
    formData.append('status', Status);
    formData.append('file', ImageShop ?? '');
    formData.append('createdById', String(MadeById));

    try {
      let response;
      if (shopId) {
        response = await axiosServices.put(`/api/shop/update/${shopId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        if (!ImageShop) {
          setOpenErrorDialog(true);
          setErrorMessage('กรุณาอัพโหลดรูปภาพ');
          return;
        }
        response = await axiosServices.post('/api/shop/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      console.log(response);
      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/admin/shop';
      } else {
        setOpenErrorDialog(true);
        setErrorMessage(response.statusText);
      }
    } catch (error: any) {
      setOpenErrorDialog(true);
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };
  return (
    <>
      <MainCard>
        <MainCard title={titleMessage} content={true}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={4}>
              <SubCard title="อัพโหลดรูปภาพ" contentSX={{ textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                      <img alt="User 1" src={PreviewImg} width={251} height={331} style={{ margin: '0 auto' }} />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" align="center" style={{ color: 'red' }}>
                      *จำกัดขนาด 4MB และ รูปภาพต้องเป็นไฟล์ . jpg, .jpeg, .png .webp เท่านั้น <br></br>
                      *รูปภาพต้องมีขนาด 300 x 300 Pixel
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AnimateButton>
                      {/* <Button variant="contained" size="small">
                        อัพโหลดรูปภาพ
                      </Button> */}
                      <InputLabel style={{ textAlign: 'left' }}>Logo</InputLabel>
                      <TextField
                        fullWidth
                        type="file"
                        name="shopImage"
                        onChange={handleImageChange}
                        // helperText={'*รูปภาพต้องมีขนาด 300 x 300 Pixel และขนาดไม่เกิน 4MB'}
                      ></TextField>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={6} md={8}>
              <SubCard title={titleMessage}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อแบรนด์</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="เช่น Central"
                      value={Name}
                      name="Name"
                      onChange={(event: any) => {
                        setName(event.target.value);
                        formik.handleChange(event);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Name && Boolean(formik.errors.Name)}
                      helperText={formik.touched.Name && formik.errors.Name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>สถานะ</InputLabel>
                    <Autocomplete
                      options={StatusOption}
                      getOptionLabel={(option) => (option ? option.status_name : '')}
                      value={StatusOption.find((option) => option.status === Status) || null}
                      onChange={(event, newValue) => {
                        setStatus(newValue ? newValue.status : '');
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </SubCard>
              <Grid container justifyContent="right" alignItems="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Stack direction="row" spacing={2}>
                    <AnimateButton>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                      >
                        {confirmMessage}
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button href={`/admin/shop/`} variant="contained" color="error">
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
      <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
    </>
  );
};

export default ShopForm;
