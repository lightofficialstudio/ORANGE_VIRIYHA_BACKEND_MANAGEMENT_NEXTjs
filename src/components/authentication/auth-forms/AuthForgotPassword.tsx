import React from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
// status
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';
// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const [openSuccessDialog, setOpenSuccessDialog] = React.useState<boolean>(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { isLoggedIn, resetPassword } = useAuth();

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('ต้องอยู่ในรูปแบบอเีมลล์ที่ถูกต้อง').max(255).required('โปรดระบุอีเมลล์ให้ถูกต้อง')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await resetPassword(values.email).then(
            () => {
              setStatus({ success: true });
              setSubmitting(false);

              setOpenSuccessDialog(true);

              setTimeout(() => {
                window.location.replace(isLoggedIn ? '/auth/check-mail' : '/check-mail');
              }, 100000);

              // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
              // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
              // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
              // github issue: https://github.com/formium/formik/issues/2430
            },
            (err: any) => {
              setOpenErrorDialog(true);
              setErrorMessage(err.message);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          );
        } catch (err: any) {
          console.error(err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <SuccessDialog open={openSuccessDialog} handleClose={() => setOpenSuccessDialog(false)} />
          <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />

          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-forgot">อีเมลล์</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="โปรดกรอกอีเมลล์"
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                ส่งรหัสผ่านไปทางอีเมลล์
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForgotPassword;
