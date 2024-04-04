import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
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
const MockupLogo = '/assets/mockup/shop.png';
// third-party - validation
import { useFormik } from 'formik';
import * as yup from 'yup';
// autocomplete options

const StatusOption = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

type CategoryFormProps = {
  titleMessage: string;
  confirmMessage?: string;
  categoryId?: string;
};
// validation schema
const validationSchema = yup.object({
  Name: yup.string().required('กรุณาใส่ชื่อหมวดหมู่ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Position: yup
    .number()
    .typeError('ตำแหน่งต้องเป็นตัวเลขเท่านั้นไม่สามารถเป็นตัวอักษรได้')
    .required('กรุณาใส่ตำแหน่งหมวดหมู่ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Status: yup.string().required('กรุณาเลือกสถานะของหมวดหมู่ให้ครบถ้วน')
});

const CategoryForm = ({ titleMessage, confirmMessage, categoryId }: CategoryFormProps) => {
  const context = React.useContext(JWTContext);
  const [PreviewImg, SetPreviewImg] = useState(MockupLogo);
  const [Name, setName] = useState('');
  const [Position, setPosition] = useState('');
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const [Status, setStatus] = useState('');
  const MadeById = context?.user?.userInfo?.id;
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // validation
  const formik = useFormik({
    initialValues: {
      Name: Name,
      Position: Position,
      Status: Status
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      try {
      } catch (error: any) {}
    }
  });
  React.useEffect(() => {
    const imgUrl = process.env.IMAGE_VIRIYHA_URL + 'images/category';
    if (categoryId) {
      axiosServices.get(`/api/category/${categoryId}`).then((response) => {
        console.log(response);
        setName(response.data.name);
        setPosition(response.data.position);
        setStatus(response.data.status);
        SetPreviewImg(`${imgUrl}/${response.data.image}`);
      });
    }
  }, [categoryId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const fileName = file.name;
      setImageFile(file);
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
    if (!Name || !Position || !Status) {
      setOpenErrorDialog(true);
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    } else if (formik.errors.Name || formik.errors.Position) {
      setOpenErrorDialog(true);
      setErrorMessage(String(formik.errors.Name || formik.errors.Position));
      return;
    } else if (!ImageFile) {
      setOpenErrorDialog(true);
      setErrorMessage('กรุณาเลือกรูปภาพ');
      return;
    }

    event.preventDefault();
    const formData = new FormData();
    formData.append('name', Name);
    formData.append('position', Position);
    formData.append('status', Status);
    formData.append('file', ImageFile ?? '');
    formData.append('createdById', String(MadeById));

    try {
      let response;
      if (categoryId) {
        response = await axiosServices.put(`/api/category/update/${categoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosServices.post('/api/category/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      console.log(response);
      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/admin/category';
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
              <SubCard title="รูปภาพ" contentSX={{ textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                      <Image alt="User 1" src={PreviewImg} width={251} height={331} style={{ margin: '0 auto' }} />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" align="center" style={{ color: 'red' }}>
                      *จำกัดขนาด 4MB และ รูปภาพต้องเป็นไฟล์ . jpg, .jpeg, .png .webp เท่านั้น <br></br>
                      *รูปภาพต้องมีขนาด 251 x 331 Pixel
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AnimateButton>
                      {/* <Button variant="contained" size="small">
                        อัพโหลดรูปภาพ
                      </Button> */}
                      <InputLabel style={{ textAlign: 'left' }}>รูปภาพ</InputLabel>
                      <TextField
                        fullWidth
                        type="file"
                        name="shopImage"
                        onChange={handleImageChange}
                        helperText={'*รูปภาพต้องมีขนาด 251 x 331 Pixel และขนาดไม่เกิน 4MB'}
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
                    <InputLabel required>ชื่อหมวดหมู่</InputLabel>
                    <TextField
                      fullWidth
                      name="Name"
                      placeholder="เช่น ร้านค้า,ท่องเที่ยว,อาหารและเครื่องดื่ม"
                      value={Name}
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
                    <InputLabel required>ลำดับการแสดงผล</InputLabel>
                    <TextField
                      fullWidth
                      name="Position"
                      placeholder="เช่น 1,2,3"
                      value={Position}
                      onChange={(event: any) => {
                        setPosition(event.target.value);
                        formik.handleChange(event);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Position && Boolean(formik.errors.Position)}
                      helperText={formik.touched.Position && formik.errors.Position}
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
      <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
    </>
  );
};

export default CategoryForm;
