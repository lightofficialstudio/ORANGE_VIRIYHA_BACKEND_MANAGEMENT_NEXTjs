import { useDispatch } from 'store';
import React from 'react';

// material-ui
import { Button, Grid, Stack, TextField , Autocomplete } from '@mui/material';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import { gridSpacing } from 'store/constant';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

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



  return (
    <MainCard title="">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={gridSpacing}>
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
            <label htmlFor="campaign_start_date">วันที่เริ่มต้น</label>
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
            <label htmlFor="campaign_end_date">วันที่สิ้นสุด</label>
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
            <SubCard title="ร้านค้าที่เข้าร่วมแคมเปญ">
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
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" type="submit">
                  ยืนยัน
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

export default InstantFeedback;
