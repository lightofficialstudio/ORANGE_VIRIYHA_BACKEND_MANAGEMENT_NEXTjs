import React, { useState, ChangeEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';

// material-ui
import { Button, Grid, Stack, TextField, Autocomplete, CardMedia, FormControlLabel, Radio, RadioGroup, FormControl } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

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
  { label: 'เพศชาย', id: 1 },
  { label: 'เพศหญิง', id: 2 }
];

const CreateFormNormalCampaign = () => {
  const theme = useTheme();
  const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);
  const [valueColor, setValueColor] = useState('default');
  const [ArrayCategory, setArrayCategory] = useState<CategoryType[]>([]);
  const [ArrayShop, setArrayShop] = useState<ShopManagementType[]>([]);
  const [ArrayBranchList, setArrayBranchList] = useState<any[]>([{ id: '0', name: 'Please select a branch' }]);

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
            <TextField required inputProps={{ maxLength: 12 }} fullWidth />
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
            <TextField fullWidth type="date" id="campaign_start_date" name="campaign_start_date" label="" />{' '}
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel required>วันที่สิ้นสุด</InputLabel>
            <TextField fullWidth type="date" id="campaign_end_date" name="campaign_end_date" label="" />{' '}
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
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>{' '}
          </Grid>
          <Grid item md={6} xs={12}>
            <InputLabel required>เป้าหมายสิทธิพิเศษ (Criteria)</InputLabel>
            <Grid container direction="column" spacing={3}>
              {/* <Grid item>
                <Autocomplete
                  multiple
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  defaultValue={[top100Films[0], top100Films[4]]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid> */}
            </Grid>
          </Grid>

          <Grid item md={6} xs={12}>
            <InputLabel required>เป้าหมายสิทธิพิเศษ (Segment)</InputLabel>
            <Grid container direction="column" spacing={3}>
              {/* <Grid item>
                <Autocomplete
                  multiple
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  defaultValue={[top100Films[2], top100Films[3]]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <InputLabel required>รายละเอียด</InputLabel>
            <ReactQuill
              onChange={(value) => {
                console.log(value);
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel required>เงื่อนไข</InputLabel>
            <ReactQuill
              onChange={(value) => {
                console.log(value);
              }}
            />{' '}
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
                    <Button variant="contained" type="submit">
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
