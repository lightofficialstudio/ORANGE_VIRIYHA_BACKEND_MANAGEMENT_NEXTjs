import * as React from 'react';
import { useState } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
import JWTContext from 'contexts/JWTContext';
import { Grid, TextField, Typography, Button, Autocomplete, Stack, Dialog, DialogContent } from '@mui/material';
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
// Avatar
const MockupBanner = '/assets/default-img/banner.jpg';
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
  primaryId?: string;
};

// validation schema
const validationSchema = yup.object({
  Name: yup.string().required('กรุณาใส่ชื่อแบนเนอร์ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Position: yup.number().required('กรุณาใส่ตำแหน่งของแบนเนอร์'),
  Status: yup.string().required('กรุณาเลือกสถานะของแบนเนอร์')
});

const BannerForm = ({ titleMessage, confirmMessage, primaryId }: CategoryFormProps) => {
  const context = React.useContext(JWTContext);
  const [PreviewImg, SetPreviewImg] = useState(MockupBanner);
  const [Name, setName] = useState<string>('');
  const [Position, setPosition] = useState<string>('');
  const [LinkNav, setLinkNav] = useState<string>('');
  const [Status, setStatus] = useState<string>('');
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const MadeById = context?.user?.userInfo?.id;
  if (!MadeById) {
    window.location.reload();
  }
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // dialog
  const [openImageDialog, setOpenImageDialog] = React.useState<boolean>(false);
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
    const imgUrl = process.env.IMAGE_VIRIYHA_URL + '/images/banner';
    if (primaryId) {
      axiosServices.get(`/api/banner/${primaryId}`).then((response) => {
        console.log(response);
        setName(response.data.name);
        setPosition(response.data.position);
        setLinkNav(response.data.link);
        setStatus(response.data.status);
        SetPreviewImg(`${imgUrl}/${response.data.image}`);
      });
    }
  }, [primaryId]);

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
    event.preventDefault();
    if (!Name || !Position || !Status) {
      setOpenErrorDialog(true);
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const formData = new FormData();
    formData.append('name', Name);
    formData.append('status', Status);
    formData.append('link', LinkNav);
    formData.append('position', Position);
    formData.append('file', ImageFile ?? '');
    formData.append('createdById', String(MadeById));

    try {
      let response;
      if (primaryId) {
        response = await axiosServices.put(`/api/banner/update/${primaryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        if (!ImageFile) {
          setOpenErrorDialog(true);
          setErrorMessage('กรุณาเลือกรูปภาพ');
          return;
        }
        response = await axiosServices.post('/api/banner/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      console.log(response);
      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/admin/banners';
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
      <Dialog
        onClose={() => setOpenImageDialog(false)}
        open={openImageDialog}
        sx={{
          '& .MuiDialog-paper': {
            width: 1374,
            maxWidth: '100%'
          }
        }}
      >
        <DialogContent>
          <img src={PreviewImg} alt="Preview" height={542} width={1374} />
        </DialogContent>
      </Dialog>
      <MainCard>
        <MainCard title={titleMessage} content={true}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={12}>
              <SubCard title="รูปภาพ" contentSX={{ textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                      <img alt="User 1" src={PreviewImg} style={{ margin: '0 auto', marginTop: '20px' }} width={700} height={300} />
                    </Grid>
                    <Grid item>
                      <Button sx={{ display: 'none' }} variant="outlined" onClick={() => setOpenImageDialog(true)}>
                        ดูขนาดรูปภาพจริง
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" align="center" style={{ color: 'red' }}>
                      *จำกัดขนาด 4MB และ รูปภาพต้องเป็นไฟล์ . jpg, .jpeg, .png .webp เท่านั้น <br></br>
                      *รูปภาพต้องมีขนาด 1374 x 542 Pixel
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AnimateButton>
                      {/* <Button variant="contained" size="small">
                        อัพโหลดรูปภาพ
                      </Button> */}
                      <InputLabel style={{ textAlign: 'left' }} required>
                        อัพโหลดรูปภาพ
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="file"
                        name="bannerImg"
                        onChange={handleImageChange}
                        helperText={'*รูปภาพต้องมีขนาด 1374 x 542 Pixel และขนาดไม่เกิน 4MB'}
                      ></TextField>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={6} md={12}>
              <SubCard title={titleMessage}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อ Banner</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="เช่น Banner แคมเปญ Privileges @Central"
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
                    <InputLabel required>ตำแหน่งแบนเนอร์</InputLabel>
                    <TextField
                      type="number"
                      name="Position"
                      fullWidth
                      placeholder="เช่น 1,2,3,4"
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
                    <InputLabel>url link</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="เช่น www.viriyah.co.th/privilege/1"
                      value={LinkNav}
                      onChange={(event: any) => {
                        setLinkNav(event.target.value);
                      }}
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
                        formik.setFieldValue('Status', newValue ? newValue.status : '');
                      }}
                      onBlur={() => formik.setFieldTouched('Status', true)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="Status"
                          error={formik.touched.Status && Boolean(formik.errors.Status)}
                          helperText={formik.touched.Status && formik.errors.Status}
                        />
                      )}
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
      <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
    </>
  );
};

export default BannerForm;
