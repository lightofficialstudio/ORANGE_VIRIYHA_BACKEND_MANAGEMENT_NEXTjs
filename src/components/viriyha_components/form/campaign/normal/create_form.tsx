import { useDispatch } from 'store';
import React, { useState } from 'react';

// material-ui
import { Button, Grid, Stack, TextField , Autocomplete , CardMedia, Fab, CircularProgress } from '@mui/material';
import { useTheme , styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import { gridSpacing } from 'store/constant';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';

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

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
  campaign_name: yup.string().required('จำเป็นต้องใส่ชื่อแคมเปญ'),
  campaign_description: yup.string().required('จำเป็นต้องใส่รายละเอียด'),
  campaign_condition: yup.string().required('จำเป็นต้องใส่เงื่อนไข'),
  campaign_start_date: yup.string().required('จำเป็นต้องใส่วันเริ่มต้นแคมเปญ'),
  campaign_end_date: yup.string().required('จำเป็นต้องใส่วันสิ้นสุดแคมเปญ'),

});


 
// ==============================|| FORM VALIDATION - INSTANT FEEDBACK FORMIK ||============================== //

const InstantFeedback = () => {
  const dispatch = useDispatch();
  const theme = useTheme();


  const formik = useFormik({
    initialValues: {
      campaign_name: '',
      campaign_description: '',
      campaign_condition: '',
      campaign_start_date: '',
      campaign_end_date: '',

    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'On Leave - Submit Success',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
  });

   // State to hold the image URLs for preview
  const [imageSrcs, setImageSrcs] = useState([]);

  // Event handler for file input change
  const handleFileChange = (e:any) => {
    const files = Array.from(e.target.files).slice(0, 5); // Get first 5 files if there are more
    const newImageSrcs = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImageSrcs.push(e.target.result);
        if (newImageSrcs.length === files.length) {
          setImageSrcs(newImageSrcs); // Update the image srcs state
        }
      };
      reader.readAsDataURL(file);
    });
  };



  return (
    <MainCard title="">
     
      <form onSubmit={formik.handleSubmit}>
     
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="campaign_name"
              name="campaign_name"
              label="ชื่อแคมเปญ"
              value={formik.values.campaign_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.campaign_name && Boolean(formik.errors.campaign_name)}
              helperText={formik.touched.campaign_name && formik.errors.campaign_name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
          <InputLabel required>วันที่เริ่มต้น</InputLabel>
            
          <TextField
              fullWidth
              type="date"
              id="campaign_start_date"
              name="campaign_start_date"
              label=""
              value={formik.values.campaign_start_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.campaign_start_date && Boolean(formik.errors.campaign_start_date)}
              helperText={formik.touched.campaign_start_date && formik.errors.campaign_start_date}
            />          </Grid>
            <Grid item xs={12} md={6}>
          <InputLabel required>วันที่สิ้นสุด</InputLabel>
          <TextField
              fullWidth
              type="date"
              id="campaign_end_date"
              name="campaign_end_date"
              label=""
              value={formik.values.campaign_end_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.campaign_end_date && Boolean(formik.errors.campaign_end_date)}
              helperText={formik.touched.campaign_end_date && formik.errors.campaign_end_date}
            />          </Grid>
          <Grid item xs={12}>
                <TextField 
                fullWidth 
                id="campaign_description" 
                name="campaign_description" 
                label="รายละเอียด" multiline rows={3} defaultValue="" 
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 error={formik.touched.campaign_description && Boolean(formik.errors.campaign_description)}
                 helperText={formik.touched.campaign_description && formik.errors.campaign_description}/>
              </Grid>

              <Grid item xs={12}>
                <TextField 
                fullWidth 
                id="campaign_condition" 
                name="campaign_condition" 
                label="เงื่อนไข" multiline rows={3} defaultValue="" 
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 error={formik.touched.campaign_condition && Boolean(formik.errors.campaign_condition)}
                 helperText={formik.touched.campaign_condition && formik.errors.campaign_condition}/>
              </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SubCard title="ร้านค้าที่เข้าร่วม">
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    
                    options={top100Films}
                    getOptionLabel={(option) => option.label}
                    defaultValue={[top100Films[0], top100Films[4]]}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </SubCard>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SubCard title="สาขาที่เข้าร่วม">
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

          <Grid item xs={12} >
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
                  <Button variant="contained"
                  href="/campaign/normal"
                  sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
                  >ย้อนกลับ</Button>
                  </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

export default InstantFeedback;
