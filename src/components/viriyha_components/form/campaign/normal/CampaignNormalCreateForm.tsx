import React, { useState, ChangeEvent } from 'react';
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
// example data
// autocomplete options
const top100Films = [
  { label: 'The Dark Knight', id: 1 },
  { label: 'Control with Control', id: 2 },
  { label: 'Combo with Solo', id: 3 },
  { label: 'The Dark', id: 4 },
  { label: 'Fight Club', id: 5 },
  { label: 'demo@company.com', id: 6 },
  { label: 'Pulp Fiction', id: 7 }
];
const CreateFormNormalCampaign = () => {
  const theme = useTheme();
  const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);
  const [valueColor, setValueColor] = useState('default');

  // State to hold the image URLs for preview
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

  // Event handler for file input change
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

  // Event handler for quota type change
  const handleQuotaTypeChange = (event: any, value: any) => {
    setIsQuotaDisabled(value.id === 4);
  };

  return (
    <MainCard title="">
      <form>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
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
                <CloudUploadIcon /> Drop file here to upload
              </InputLabel>
            </div>
            <Grid container spacing={3} justifyContent="center">
              {imageSrcs.map((src, index) => (
                <Grid item key={index}>
                  {/* ... image wrapper and CardMedia for each image ... */}
                  <ImageWrapper>
                    <CardMedia component="img" image={src} title={`Product ${index + 1}`} />
                  </ImageWrapper>
                </Grid>
              ))}
              {/* ... */}
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <InputLabel required>ชื่อสิทธิพิเศษ</InputLabel>
            <TextField fullWidth />
          </Grid>
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
              <Grid item>
                <Autocomplete
                  multiple
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  defaultValue={[top100Films[0], top100Films[4]]}
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
                  defaultValue={[top100Films[2], top100Films[3]]}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
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

          <Grid item xs={12} md={6} lg={6}>
            <SubCard title="ร้านค้าที่เข้าร่วม">
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    options={top100Films}
                    getOptionLabel={(option) => option.label}
                    defaultValue={top100Films[0]}
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
                    options={top100Films}
                    getOptionLabel={(option) => option.label}
                    defaultValue={[top100Films[0], top100Films[4]]}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
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
