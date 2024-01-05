import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
// import AddIcon from '@mui/icons-material/AddTwoTone';
// import SubCard from 'ui-component/cards/SubCard';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import AlertErrorDialog from 'components/viriyha_components/alert/error';
// import { header } from 'pages/forms/tables/tbl-basic';
// import axios from 'axios';
// import value from 'scss/_themes-vars.module.scss';

interface OpenDialogProps {
  open: boolean;
  onClose: () => void;
  position: string;
}

const ActiveSelection = [
  {
    value: '1',
    label: '1'
  },
  {
    value: '2',
    label: '2'
  }
];

// ===============================|| UI DIALOG - FORMS ||=============================== //

const ChangeBannerPositionDialog = ({ open, onClose, position }: OpenDialogProps) => {
  const theme = useTheme();
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
 console.log(position);
 
  const handleCloseError = () => {
    setOpenError(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      //   const response = await axios.post('http://localhost:3000/api/v1/categories', formData);
    } catch (error: any) {
      console.error('สาเหตุ :', error);
      const errorMessage = error.response?.data?.message || error.message;
      setErrorMessage(errorMessage);
      setOpenError(true);
    }
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        {open && (
          <>
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">สลับตำแหน่งของแบนเนอร์</DialogTitle>
              <DialogContent>
                <Stack spacing={3}>
                  <DialogContentText></DialogContentText>
                  <FormControlSelect
                    id="banner_position"
                    name="banner_position"
                    captionLabel="ตำแหน่ง"
                    currencies={ActiveSelection}
                    selected={position}
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ pr: 2.5 }}>
                <Button sx={{ color: theme.palette.error.dark }} onClick={onClose} color="secondary">
                  ยกเลิก
                </Button>
                <Button variant="contained" size="small" type="submit">
                  สลับตำแหน่ง
                </Button>
              </DialogActions>
            </form>
          </>
        )}
      </Dialog>
      {openError && <AlertErrorDialog Open={openError} Close={handleCloseError} Message={errorMessage} />}
    </div>
  );
};

export default ChangeBannerPositionDialog;
