import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';

// import { useRouter } from 'next/router';
// import JWTContext from 'contexts/JWTContext';
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
// Avatar
const Avatar1 = '/assets/images/users/avatar-2.png';
// autocomplete options

const EnumStatus = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

const EnumRole = [
  { role_name: 'ผู้ดูแลระบบ', role: 'ADMIN' },
  { role_name: 'ผู้ใช้งานทั่วไป', role: 'BACKEND_USER' }
];

type CategoryFormProps = {
  titleMessage: string;
  confirmMessage?: string;
  primaryId?: string;
};

const BackendUserForm = ({ titleMessage, confirmMessage, primaryId }: CategoryFormProps) => {
  const [error, setError] = useState('');
  // const context = React.useContext(JWTContext);
  const [PreviewImg, SetPreviewImg] = useState(Avatar1);
  const [Name, setName] = useState('');
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const [Status, setStatus] = useState('');
  const [Role, setRole] = useState('');
  const [Description, setDescription] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const imgUrl = process.env.BACKEND_VIRIYHA_APP_API_URL + 'image/category';

  React.useEffect(() => {
    if (primaryId) {
      axiosServices.get(`/api/category/${primaryId}`).then((response) => {
        console.log(response);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setName(response.data.name);
        setStatus(response.data.status);
        setRole(response.data.role);
        SetPreviewImg(`${imgUrl}/${response.data.image}`);
      });
    }
  }, [primaryId, imgUrl]);

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
    event.preventDefault();
    if (!Username || !Email || !Password || !Status || !Role) {
      setError('Please enter a value.'); // Set an error message if the input is empty
      setOpenErrorDialog(true);
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    } else {
      setError('');
    }

    const formData = new FormData();
    formData.append('username', Username);
    formData.append('email', Email);
    formData.append('password', Password);
    formData.append('name', Name);
    formData.append('status', Status);
    formData.append('role', Role);
    formData.append('description', Description);
    formData.append('user_backendImage', ImageFile ?? '');

    try {
      let response;
      if (primaryId) {
        response = await axiosServices.put(`/api/user_backend/update/${primaryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosServices.post('/api/user_backend/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      console.log(response);
      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/admin/users/backend';
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
                      <TextField fullWidth type="file" name="shopImage" onChange={handleImageChange}></TextField>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={6} md={8}>
              <SubCard title={titleMessage}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อผู้เข้าใช้งานระบบ</InputLabel>
                    <TextField
                      fullWidth
                      error={!!error}
                      placeholder="Username"
                      value={Username}
                      onChange={(event: any) => {
                        setUsername(event.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>รหัสผ่าน</InputLabel>
                    <TextField
                      fullWidth
                      error={!!error}
                      placeholder="Password"
                      value={Password}
                      onChange={(event: any) => {
                        setPassword(event.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>อีเมลล์</InputLabel>
                    <TextField
                      fullWidth
                      error={!!error}
                      placeholder="viriyha@mail.com"
                      value={Email}
                      onChange={(event: any) => {
                        setEmail(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>ระดับสิทธิ์ผู้ใช้งาน</InputLabel>
                    <Autocomplete
                      options={EnumRole}
                      getOptionLabel={(option) => (option ? option.role_name : '')}
                      value={EnumRole.find((option) => option.role === Role) || null}
                      onChange={(event, roleValue) => {
                        setRole(roleValue ? roleValue.role : '');
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>สถานะผู้ใช้งาน</InputLabel>
                    <Autocomplete
                      options={EnumStatus}
                      getOptionLabel={(option) => (option ? option.status_name : '')}
                      value={EnumStatus.find((option) => option.status === Status) || null}
                      onChange={(event, newValue) => {
                        setStatus(newValue ? newValue.status : '');
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel>รายละเอียด</InputLabel>
                    <TextField
                      error={!!error}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="เช่น สิ่งที่อยากบันทึกเก็บไว้"
                      value={Description}
                      onChange={(event: any) => {
                        setDescription(event.target.value);
                      }}
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
                      <Button href={`/admin/users/backend`} variant="contained" color="error">
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

export default BackendUserForm;
