import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';

// import { useRouter } from 'next/router';
// import JWTContext from 'contexts/JWTContext';
import { styled } from '@mui/material/styles';

import {
  Grid,
  TextField,
  Typography,
  Button,
  Autocomplete,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses
} from '@mui/material';
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
const MockupLogo = '/assets/mockup/user.png';
// third-party - validation
import { useFormik } from 'formik';
import * as yup from 'yup';
// styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}));
// autocomplete options

const EnumStatus = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

const EnumRole = [
  { role_name: 'ผู้ดูแลระบบ', role: 'ADMIN' },
  { role_name: 'ผู้ใช้งานทั่วไป', role: 'BACKEND_USER' }
];

const Permission = [
  { name: 'อนุญาต', id: 1 },
  { name: 'ไม่อนุญาต', id: 0 }
];

type CategoryFormProps = {
  titleMessage: string;
  confirmMessage?: string;
  primaryId?: string;
};

// validation schema
const validationSchema = yup.object({
  Username: yup
    .string()
    .matches(/^[A-Za-z0-9]+$/, 'กรุณากรอกชื่อผู้ใช้งานด้วยตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น')
    .required('กรุณากรอกชื่อผู้ใช้งานให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Email: yup.string().email('กรุณากรอกรูปแบบอีเมลให้ถูกต้อง').required('กรุณากรอกอีเมลให้ถูกต้อง หรือ กรอกให้ครบถ้วน')
});

// table data

const BackendUserForm = ({ titleMessage, confirmMessage, primaryId }: CategoryFormProps) => {
  const [error, setError] = useState('');
  // const context = React.useContext(JWTContext);
  const [PreviewImg, SetPreviewImg] = useState(MockupLogo);
  const [Name, setName] = useState('');
  const [Username, setUsername] = useState('');
  const [Phonenumber, setPhonenumber] = useState('');
  const [Email, setEmail] = useState('');
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const [Status, setStatus] = useState('');
  const [Role, setRole] = useState('');
  // permission
  // - Dashboard
  const [MenuWebAnalytics, setMenuWebAnalytics] = useState<number>(1);
  const [MenuDashboardCampaign, setMenuDashboardCampaign] = useState<number>(1);
  const [MenuDashboardRedeem, setMenuDashboardRedeem] = useState<number>(1);
  // - Admin
  const [MenuAdminBanner, setMenuAdminBanner] = useState<number>(1);
  const [MenuAdminCategory, setMenuAdminCategory] = useState<number>(1);
  const [MenuAdminShop, setMenuAdminShop] = useState<number>(1);
  const [MenuAdminSegment, setMenuAdminSegment] = useState<number>(1);
  const [MenuAdminCriteria, setMenuAdminCriteria] = useState<number>(1);
  const [MenuAdminFrontendUsers, setMenuAdminFrontendUsers] = useState<number>(1);
  const [MenuAdminBackendUsers, setMenuAdminBackendUsers] = useState<number>(1);
  // - Campaign
  const [MenuCampaignNormal, setMenuCampaignNormal] = useState<number>(1);
  const [MenuCampaignSpecial, setMenuCampaignSpecial] = useState<number>(1);
  // - Report
  const [MenuReportAttempt, setMenuReportAttempt] = useState<number>(1);
  const [MenuReportLocation, setMenuReportLocation] = useState<number>(1);

  // - Config
  const [MenuConfigErrorMessage, setMenuConfigErrorMessage] = useState<number>(1);
  // - Logs
  const [MenuLogsErrorLogs, setMenuLogsErrorLogs] = useState<number>(1);
  const [Description, setDescription] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const imgUrl = process.env.BACKEND_VIRIYHA_APP_API_URL + 'image/category';
  // validation
  const formik = useFormik({
    initialValues: {
      Username: Username,
      Email: Email,
      Name: Name,
      Phonenumber: Phonenumber
    },
    validationSchema: validationSchema,
    onSubmit: () => {}
  });
  React.useEffect(() => {
    if (primaryId) {
      axiosServices.get(`/api/user_backend/${primaryId}`).then((response) => {
        console.log(response);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setName(response.data.name);
        setPhonenumber(response.data.phonenumber);
        setStatus(response.data.status);
        setRole(response.data.role);
        if (response.data.image) {
          SetPreviewImg(`${imgUrl}/${response.data.image}`);
        }
        setDescription(response.data.description);
        // Permission
        let permissions: string[] = [];
        permissions = response.data.permission.map((item: { name: string }) => item.name || '');
        console.log(permissions);
        // - Dashboard
        setMenuWebAnalytics(permissions.includes('MenuWebAnalytics') ? 1 : 0);
        setMenuDashboardCampaign(permissions.includes('MenuDashboardCampaign') ? 1 : 0);
        setMenuDashboardRedeem(permissions.includes('MenuDashboardRedeem') ? 1 : 0);
        // - Admin
        setMenuAdminBanner(permissions.includes('MenuAdminBanner') ? 1 : 0);
        setMenuAdminCategory(permissions.includes('MenuAdminCategory') ? 1 : 0);
        setMenuAdminShop(permissions.includes('MenuAdminShop') ? 1 : 0);
        setMenuAdminSegment(permissions.includes('MenuAdminSegment') ? 1 : 0);
        setMenuAdminCriteria(permissions.includes('MenuAdminCriteria') ? 1 : 0);
        setMenuAdminFrontendUsers(permissions.includes('MenuAdminFrontendUsers') ? 1 : 0);
        setMenuAdminBackendUsers(permissions.includes('MenuAdminBackendUsers') ? 1 : 0);
        // - Campaign
        setMenuCampaignNormal(permissions.includes('MenuCampaignNormal') ? 1 : 0);
        setMenuCampaignSpecial(permissions.includes('MenuCampaignSpecial') ? 1 : 0);
        // - Report
        setMenuReportAttempt(permissions.includes('MenuReportAttempt') ? 1 : 0);
        setMenuReportLocation(permissions.includes('MenuReportLocation') ? 1 : 0);
        // - Config
        setMenuConfigErrorMessage(permissions.includes('MenuConfigErrorMessage') ? 1 : 0);
        // - Logs
        setMenuLogsErrorLogs(permissions.includes('MenuLogsErrorLogs') ? 1 : 0);
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
    if (!Username || !Email || !Status || !Role) {
      setOpenErrorDialog(true);
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const permissions = [];

    const formData = new FormData();
    formData.append('username', Username);
    formData.append('email', Email);
    formData.append('name', Name);
    formData.append('phonenumber', Phonenumber);
    formData.append('status', Status);
    formData.append('role', Role);
    formData.append('description', Description);
    formData.append('user_backendImage', ImageFile ?? '');
    /* Permission */
    if (MenuWebAnalytics === 1) permissions.push('MenuWebAnalytics');
    if (MenuDashboardCampaign === 1) permissions.push('MenuDashboardCampaign');
    if (MenuDashboardRedeem === 1) permissions.push('MenuDashboardRedeem');
    // - Admin
    if (MenuAdminBanner === 1) permissions.push('MenuAdminBanner');
    if (MenuAdminCategory === 1) permissions.push('MenuAdminCategory');
    if (MenuAdminShop === 1) permissions.push('MenuAdminShop');
    if (MenuAdminSegment === 1) permissions.push('MenuAdminSegment');
    if (MenuAdminCriteria === 1) permissions.push('MenuAdminCriteria');
    if (MenuAdminFrontendUsers === 1) permissions.push('MenuAdminFrontendUsers');
    if (MenuAdminBackendUsers === 1) permissions.push('MenuAdminBackendUsers');
    // - Campaign
    if (MenuCampaignNormal === 1) permissions.push('MenuCampaignNormal');
    if (MenuCampaignSpecial === 1) permissions.push('MenuCampaignSpecial');
    // - Report
    if (MenuReportAttempt === 1) permissions.push('MenuReportAttempt');
    if (MenuReportLocation === 1) permissions.push('MenuReportLocation');
    // - Config
    if (MenuConfigErrorMessage === 1) permissions.push('MenuConfigErrorMessage');
    // - Logs
    if (MenuLogsErrorLogs === 1) permissions.push('MenuLogsErrorLogs');
    formData.append('permissions', permissions.join(','));

    try {
      let response;
      if (primaryId) {
        response = await axiosServices.put(`/api/user_backend/update/${primaryId}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axiosServices.post('/api/user_backend/create', formData, {
          headers: {
            'Content-Type': 'application/json'
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
            <Grid item xs={6} md={4} sx={{ display: 'none' }}>
              <SubCard title="รูปภาพ" contentSX={{ textAlign: 'center' }}>
                <Grid container spacing={2}>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                      <Image alt="User 1" src={PreviewImg} width={200} height={200} style={{ margin: '0 auto' }} />
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
                      <InputLabel style={{ textAlign: 'left' }}>รูปภาพ</InputLabel>
                      <TextField
                        fullWidth
                        type="file"
                        name="shopImage"
                        onChange={handleImageChange}
                        helperText={'*รูปภาพต้องมีขนาด 300 x 300 Pixel และขนาดไม่เกิน 4MB'}
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
                    <InputLabel required>ชื่อผู้ใช้งาน (Username)</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="Username"
                      value={Username}
                      name="Username"
                      onChange={(event: any) => {
                        setUsername(event.target.value);
                        formik.handleChange(event);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Username && Boolean(formik.errors.Username)}
                      helperText={formik.touched.Username && formik.errors.Username}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>E-mail</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="E-mail@viriyah.co.th เท่านั้น"
                      name="Email"
                      value={Email}
                      onChange={(event: any) => {
                        setEmail(event.target.value);
                        formik.handleChange(event);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Email && Boolean(formik.errors.Email)}
                      helperText={formik.touched.Email && formik.errors.Email}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel>ชื่อ-นามสกุล</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="สมชาย ใจดี"
                      value={Name}
                      onChange={(event: any) => {
                        setName(event.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel>เบอร์โทร</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="089-123-4567"
                      value={Phonenumber}
                      onChange={(event: any) => {
                        setPhonenumber(event.target.value);
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
                      renderInput={(params) => <TextField {...params} error={!!error} />}
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
                      renderInput={(params) => <TextField {...params} error={!!error} />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel>รายละเอียดเพิ่มเติม</InputLabel>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="เช่น สิ่งที่ต้องการบันทึกเก็บไว้"
                      value={Description}
                      onChange={(event: any) => {
                        setDescription(event.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </MainCard>
        <SubCard title={'จัดการสิทธิ์การใช้งาน'}>
          <MainCard
            content={false}
            secondary={
              <Stack direction="row" spacing={2} alignItems="center">
                {/* <SecondaryAction link="https://next.material-ui.com/components/tables/" /> */}
              </Stack>
            }
          >
            <TableContainer>
              <Table sx={{ minWidth: 320 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ pl: 3 }}>ฟังก์ชั่นงาน</StyledTableCell>
                    <StyledTableCell align="left">ระดับสิทธิ์การใช้งาน</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      <b>เมนู Dashboard</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row"></StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Web Analytics
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuWebAnalytics === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuWebAnalytics) || null}
                        onChange={(event, val) => {
                          setMenuWebAnalytics(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Campaign
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuDashboardCampaign === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuDashboardCampaign) || null}
                        onChange={(event, val) => {
                          setMenuDashboardCampaign(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Redeem
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuDashboardRedeem === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuDashboardRedeem) || null}
                        onChange={(event, val) => {
                          setMenuDashboardRedeem(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      <b>เมนู Admin</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row"></StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Banner
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminBanner === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminBanner) || null}
                        onChange={(event, val) => {
                          setMenuAdminBanner(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Category
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminCategory === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminCategory) || null}
                        onChange={(event, val) => {
                          setMenuAdminCategory(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Brand
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminShop === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminShop) || null}
                        onChange={(event, val) => {
                          setMenuAdminShop(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Segment
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminSegment === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminSegment) || null}
                        onChange={(event, val) => {
                          setMenuAdminSegment(val ? val.id : 0);
                          console.log(val ? val.id : 'เอราเบะ');
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Criteria
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminCriteria === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminCriteria) || null}
                        onChange={(event, val) => {
                          setMenuAdminCriteria(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Frontend Users
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminFrontendUsers === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminFrontendUsers) || null}
                        onChange={(event, val) => {
                          setMenuAdminFrontendUsers(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Backend Users
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuAdminBackendUsers === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuAdminBackendUsers) || null}
                        onChange={(event, val) => {
                          setMenuAdminBackendUsers(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      <b>เมนู Campaign</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row"></StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Normal Campaign
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuCampaignNormal === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuCampaignNormal) || null}
                        onChange={(event, val) => {
                          setMenuCampaignNormal(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Special Campaign
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuCampaignSpecial === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuCampaignSpecial) || null}
                        onChange={(event, val) => {
                          setMenuCampaignSpecial(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      <b>เมนู Transaction</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row"></StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Attempt
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuReportAttempt === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuReportAttempt) || null}
                        onChange={(event, val) => {
                          setMenuReportAttempt(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Location
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuReportLocation === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuReportLocation) || null}
                        onChange={(event, val) => {
                          setMenuReportLocation(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      <b>เมนู Config</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row"></StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Error Message
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuConfigErrorMessage === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuConfigErrorMessage) || null}
                        onChange={(event, val) => {
                          setMenuConfigErrorMessage(val ? val.id : 0);
                          console.log(val ? val.id : 'เอราเบะ');
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      <b>เมนู Logs</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row"></StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                      - Error Logs
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: MenuLogsErrorLogs === 1 ? 'green' : 'red' }}>
                      <Autocomplete
                        options={Permission}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        value={Permission.find((option) => option.id === MenuLogsErrorLogs) || null}
                        onChange={(event, val) => {
                          setMenuLogsErrorLogs(val ? val.id : 0);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ color: option.id === 1 ? 'green' : 'red' }}>
                            {option.name}
                          </li>
                        )}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
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
      </MainCard>

      <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
    </>
  );
};

export default BackendUserForm;
