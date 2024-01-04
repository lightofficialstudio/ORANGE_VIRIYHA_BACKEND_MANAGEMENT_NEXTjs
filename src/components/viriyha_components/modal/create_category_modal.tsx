import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from '@mui/material';
// import AddIcon from '@mui/icons-material/AddTwoTone';
// import SubCard from 'ui-component/cards/SubCard';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
// import { header } from 'pages/forms/tables/tbl-basic';
// import axios from 'axios';
import AlertErrorDialog from '../alert/error';

interface OpenDialogProps {
  open: boolean;
  onClose: () => void;
}

const ActiveSelection = [
  {
    value: '1',
    label: 'เปิดใช้งาน'
  },
  {
    value: '2',
    label: 'ปิดใช้งาน'
  }
];

// ===============================|| UI DIALOG - FORMS ||=============================== //

const CreateCategoryFormDialog = ({ open, onClose }: OpenDialogProps) => {
  const theme = useTheme();
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

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
              <DialogTitle id="form-dialog-title">สร้างหมวดหมู่</DialogTitle>
              <DialogContent>
                <Stack spacing={3}>
                  <DialogContentText></DialogContentText>
                  <TextField autoFocus size="medium" id="name" name="category_name" label="ชื่อหมวดหมู่" type="text" fullWidth />
                  <FormControlSelect id="status" name="category_status" captionLabel="สถานะหมวดหมู่" currencies={ActiveSelection} />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ pr: 2.5 }}>
                <Button sx={{ color: theme.palette.error.dark }} onClick={onClose} color="secondary">
                  ยกเลิก
                </Button>
                <Button variant="contained" size="small" type="submit">
                  สร้าง
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

export default CreateCategoryFormDialog;
