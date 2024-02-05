import React, { useState, ChangeEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';

// material-ui
import { Button, Grid, Stack, TextField, Autocomplete, CardMedia, FormControlLabel, Radio, RadioGroup, FormControl } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// with date-fns v3.x
import { enGB } from 'date-fns/locale';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
// Dialog
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';
// third-party
import InputLabel from 'ui-component/extended/Form/InputLabel';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
import 'react-quill/dist/quill.snow.css';
import axiosServices from 'utils/axios';
// types
import { CategoryType } from 'types/viriyha_type/category';
import { ShopManagementType } from 'types/viriyha_type/shop';
import { rows } from '../../../../forms/tables/GridTable';
// styles
const ImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '4px',
  cursor: 'pointer',
  width: 55,
  height: 55,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.background.default,
  '& > svg': {
    verticalAlign: 'sub',
    marginRight: 6
  }
}));
const quotaChoose = [
  { label: 'รายวัน', id: 1 },
  { label: 'รายสัปดาห์', id: 2 },
  { label: 'รายเดือน', id: 3 },
  { label: 'ไม่จำกัด', id: 4 }
];

const maxQuotaPerPerson = [
  { label: 'คน/วัน', id: 1 },
  { label: 'คน/สัปดาห์', id: 2 },
  { label: 'คน/เดือน', id: 3 },
  { label: 'ไม่จำกัด', id: 4 }
];

const top100Films = [
  { label: 'The Shawshank Redemption', id: 1 },
  { label: 'The Godfather', id: 2 },
  { label: 'The Godfather: Part II', id: 3 },
  { label: 'The Dark Knight', id: 4 }
];

interface CreateFormNormalCampaignProps {
  primaryId: string;
}

const CreateFormNormalCampaign = ({ primaryId }: CreateFormNormalCampaignProps) => {
  const theme = useTheme();
  const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);
  const [valueColor, setValueColor] = useState('default');
  // array
  const [ArrayCategory, setArrayCategory] = useState<CategoryType[]>([]);
  const [ArrayShop, setArrayShop] = useState<ShopManagementType[]>([]);
  const [ArrayBranchList, setArrayBranchList] = useState<any[]>([{ id: '0', name: 'Please select a branch' }]);
  // variable
  const [Name, setName] = useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>();
  // condition
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const imgUrl = process.env.BACKEND_VIRIYHA_APP_API_URL + 'image/banner';

  React.useEffect(() => {
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
    const formData = new FormData();
    formData.append('name', Name);
    // formData.append('status', Status);
    // formData.append('link', LinkNav);
    // formData.append('position', Position);
    // formData.append('bannerImage', ImageFile ?? '');
    // formData.append('createdById', MadeById ?? '');
    console.log(Name);
    // try {
    //   let response;
    //   if (primaryId) {
    //     response = await axiosServices.put(`/api/banner/update/${primaryId}`, formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });
    //   } else {
    //     response = await axiosServices.post('/api/banner/create', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });
    //   }
    //   console.log(response);
    //   if (response.status === 200) {
    //     setOpenSuccessDialog(true);
    //     window.location.href = '/admin/banners';
    //   } else {
    //     setOpenErrorDialog(true);
    //     setErrorMessage(response.statusText);
    //   }
    // } catch (error: any) {
    //   setOpenErrorDialog(true);
    //   console.log(error.message);
    //   setErrorMessage(error.message);
    // }
  };

  useEffect(() => {
    const CategoryList = async () => {
      const res = await axiosServices.get('/api/category');
      try {
        const categoryArray = res.data.map((item: CategoryType) => ({
          id: item.id,
          name: item.name
        }));
        setArrayCategory(categoryArray);
        console.log(categoryArray);
      } catch (error) {
        console.log(error);
      }
    };

    const ShopList = async () => {
      const res = await axiosServices.get('/api/shop');
      try {
        const shopArray = res.data.map((item: CategoryType) => ({
          id: item.id,
          name: item.name
        }));
        setArrayShop(shopArray);
        console.log(shopArray);
      } catch (error) {
        console.log(error);
      }
    };

    CategoryList();
    ShopList();
  }, []);

  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return; // No files selected
    }

    const files = Array.from(e.target.files).slice(0, 5); // Get first 5 files if there are more

    // Ensure each file is actually a File object
    const newImageSrcs: string[] = [];
    files.forEach((file) => {
      // Ensure that each file is a Blob
      if (file instanceof Blob) {
        // This is where you ensure the file is a Blob
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          // Ensure that the result is a string
          if (typeof e.target?.result === 'string') {
            newImageSrcs.push(e.target.result);
          }
          if (newImageSrcs.length === files.length) {
            setImageSrcs(newImageSrcs); // Update the image srcs state
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleQuotaTypeChange = (event: any, value: any) => {
    setIsQuotaDisabled(value.id === 4);
  };

  const handleShopChange = async (event: any, value: any) => {
    const res = await axiosServices.get(`/api/branch/${value.id}`);
    try {
      const branchArray = res.data.map((item: any) => ({
        id: item.id,
        name: item.name
      }));
      setArrayBranchList(branchArray);
      console.log(branchArray);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainCard title="">
      <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
      <form>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={6}>
            <SubCard title="ร้านค้าที่เข้าร่วม">
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    options={ArrayShop}
                    getOptionLabel={(option) => option.name}
                    onChange={handleShopChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </SubCard>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SubCard title="สาขา">
              <Grid item>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="shopIncludeExclude"
                    value={valueColor}
                    onChange={(e) => setValueColor(e.target.value)}
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="include"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.success.main,
                            '&.Mui-checked': { color: theme.palette.success.main }
                          }}
                        />
                      }
                      label="สาขาที่เข้าร่วม"
                    />
                    <FormControlLabel
                      value="exclude"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.error.main,
                            '&.Mui-checked': { color: theme.palette.error.main }
                          }}
                        />
                      }
                      label="สาขาที่ยกเว้น"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    multiple
                    options={ArrayBranchList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </SubCard>
          </Grid>

          <Grid item xs={12} md={12}>
            <InputLabel required>ชื่อสิทธิพิเศษ</InputLabel>
            <TextField
              required
              inputProps={{ maxLength: 12 }}
              fullWidth
              value={Name}
              onChange={(event: any) => {
                setName(event.target.value);
              }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <InputLabel required>หมวดหมู่สิทธิพิเศษ</InputLabel>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  options={ArrayCategory}
                  getOptionLabel={(option) => option.name}
                  onChange={handleQuotaTypeChange}
                  defaultValue={ArrayCategory[0]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>{' '}
          </Grid>
          <Grid xs={6} md={6} />
          <Grid item xs={12} md={6}>
            <InputLabel required>วันที่เริ่มต้น</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
              <DateTimePicker
                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                value={startDate}
                onChange={(newValue: Date | null) => {
                  setStartDate(newValue);
                }}
              />
            </LocalizationProvider>{' '}
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel required>วันที่สิ้นสุด</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
              <DateTimePicker
                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                value={endDate}
                onChange={(newValue: Date | null) => {
                  setEndDate(newValue);
                }}
              />
            </LocalizationProvider>{' '}
          </Grid>
          <Grid item md={6} xs={12}>
            <InputLabel required>จำนวนสิทธิพิเศษรวมทั้งโครงการ </InputLabel>
            <TextField fullWidth placeholder="จำนวนคน" disabled={isQuotaDisabled} />
          </Grid>
          <Grid item md={6} xs={12}>
            <InputLabel required>ประเภทสิทธิพิเศษ</InputLabel>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  options={quotaChoose}
                  getOptionLabel={(option) => option.label}
                  onChange={handleQuotaTypeChange}
                  defaultValue={quotaChoose[0]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>{' '}
          </Grid>
          <Grid item md={6} xs={12}>
            <InputLabel required>จำกัดจำนวน</InputLabel>
            <TextField fullWidth placeholder="จำนวนคน" />
          </Grid>
          <Grid item md={6} xs={12}>
            <InputLabel required>การจำกัดของสิทธิพิเศษ</InputLabel>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  options={maxQuotaPerPerson}
                  getOptionLabel={(option) => option.label}
                  onChange={handleQuotaTypeChange}
                  defaultValue={maxQuotaPerPerson[0]}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>{' '}
          </Grid>
          <Grid item md={6} xs={12}>
            <InputLabel required>เป้าหมายสิทธิพิเศษ (Criteria)</InputLabel>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  multiple
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={6} xs={12}>
            <InputLabel required>เป้าหมายสิทธิพิเศษ (Segment)</InputLabel>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  multiple
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <InputLabel required>รายละเอียด</InputLabel>
            <div style={{ height: '150px' }}>
              <ReactQuill
                style={{ height: '100px' }}
                onChange={(value) => {
                  console.log(value);
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <InputLabel required>เงื่อนไข</InputLabel>
            <div style={{ height: '150px' }}>
              <ReactQuill
                style={{ height: '100px' }}
                onChange={(value) => {
                  console.log(value);
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <SubCard title="อัพโหลดรูปภาพ">
              <div>
                <TextField
                  type="file"
                  id="file-upload"
                  fullWidth
                  label="Enter SKU"
                  sx={{ display: 'none' }}
                  onChange={handleFileChange}
                  inputProps={{ multiple: true }} // Allows multiple file selection
                />
                <InputLabel
                  htmlFor="file-upload"
                  sx={{
                    background: theme.palette.background.default,
                    py: 3.75,
                    px: 0,
                    textAlign: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    mb: 3,
                    '& > svg': {
                      verticalAlign: 'sub',
                      mr: 0.5
                    }
                  }}
                >
                  <CloudUploadIcon /> คลิกเพื่ออัพโหลดรูปภาพ
                </InputLabel>
              </div>
              <Grid container spacing={3} justifyContent="center">
                {imageSrcs.map((src, index) => (
                  <Grid item key={index}>
                    <ImageWrapper>
                      <CardMedia component="img" image={src} title={`Product ${index + 1}`} />
                    </ImageWrapper>
                  </Grid>
                ))}
                {/* ... */}
              </Grid>
            </SubCard>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="end">
              <Grid item>
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
                    <Button variant="contained" type="submit" onClick={handleSubmit}>
                      ยืนยัน
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  href="/campaign/normal"
                  sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
                >
                  ย้อนกลับ
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

export default CreateFormNormalCampaign;
