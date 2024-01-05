import { Button, Grid } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';

interface GoBackButtonProps {
  Link: string;
}

const GoBackButton = ({ Link }: GoBackButtonProps) => {
  return (
    <Grid container justifyContent="right" alignItems="center" padding={2}>
      <Grid item>
        <AnimateButton>
          <Button href={Link} variant="contained" color="primary">
            ย้อนกลับ
          </Button>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default GoBackButton;
