import * as React from 'react';
import { useState } from 'react';
// import { useRouter } from 'next/router';
import JWTContext from 'contexts/JWTContext';
import { Grid, TextField, Button, Autocomplete, Stack } from '@mui/material';
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
// third-party - validation
import { useFormik } from 'formik';
import * as yup from 'yup';
// autocomplete options

const StatusOption = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

type CriteriaFormProps = {
  titleMessage: string;
  confirmMessage?: string;
  primaryId?: string;
};
// validation schema
const validationSchema = yup.object({
  Name: yup.string().required('กรุณาใส่ชื่อหมวดหมู่ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Position: yup.number().required('กรุณาใส่ตำแหน่งหมวดหมู่ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  Status: yup.string().required('กรุณาเลือกสถานะของหมวดหมู่ให้ครบถ้วน')
});
const CriteriaForm = ({ titleMessage, confirmMessage, primaryId }: CriteriaFormProps) => {
  //   const router = useRouter();
  //   const { id } = router.query;
  const context = React.useContext(JWTContext);
  const [Name, setName] = useState('');
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
    if (primaryId) {
      axiosServices.get(`/api/criteria/${primaryId}`).then((response) => {
        console.log(response);
        setName(response.data.name);
        setStatus(response.data.status);
      });
    }
  }, [primaryId]);

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

    try {
      let response;
      if (primaryId) {
        formData.append('updatedById', String(MadeById));

        response = await axiosServices.put(`/api/criteria/update/${primaryId}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        formData.append('createdById', String(MadeById));

        response = await axiosServices.post('/api/criteria/create', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/admin/criteria';
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
            <Grid item xs={12} md={12}>
              <SubCard title={false}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel required>ชื่อ Criteria</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="เช่น ประกันรถยนต์, ประกันสุขภาพ"
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
                      <Button href={`/admin/criteria/`} variant="contained" color="error">
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

export default CriteriaForm;
