// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="#" target="_blank" underline="hover">
      วิริยะ
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://orange-thailand.com/" target="_blank" underline="hover">
      2024 © ORANGE TECHNOLOGY SOLUTION COMPANY LIMITED ALL RIGHTS RESERVED
    </Typography>
  </Stack>
);

export default AuthFooter;
