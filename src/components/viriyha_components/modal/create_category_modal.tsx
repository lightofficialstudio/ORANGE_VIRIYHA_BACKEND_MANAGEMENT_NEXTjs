import React from 'react';
import axios from 'utils/axios';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from '@mui/material';
// import AddIcon from '@mui/icons-material/AddTwoTone';
// import SubCard from 'ui-component/cards/SubCard';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
// import { header } from 'pages/forms/tables/tbl-basic';
// import axios from 'axios';
import AlertErrorDialog from '../alert/error';
// import value from 'scss/_themes-vars.module.scss';

interface OpenDialogProps {
  open: boolean;
  onClose: () => void;
}

const ActiveSelection = [
  {
    value: 'ACTIVE',
    label: 'เปิดใช้งาน'
  },
  {
    value: 'INACTIVE',
    label: 'ปิดใช้งาน'
  }
];

// ===============================|| UI DIALOG - FORMS ||=============================== //

const CreateCategoryFormDialog = ({ open, onClose }: OpenDialogProps) => {
  const theme = useTheme();
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [categoryName, setCategoryName] = React.useState('');
  const [categoryStatus, setCategoryStatus] = React.useState('ACTIVE');
  const [categoryMadeById, setCategoryMadeById] = React.useState('1');

  const handleCloseError = () => {
    setOpenError(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      name: categoryName,
      status: categoryStatus,
      createdById: categoryMadeById
    };
    try {
      const response = await axios.post('/api/category', formData);
      console.log(response);
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
                  <TextField
                    autoFocus
                    size="medium"
                    id="name"
                    name="category_name"
                    label="ชื่อหมวดหมู่"
                    type="text"
                    fullWidth
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <FormControlSelect
                    id="status"
                    name="category_status"
                    captionLabel="สถานะหมวดหมู่"
                    currencies={ActiveSelection}
                    selected={categoryStatus}
                    // onChange={(e) => setCategoryStatus(e.target.value)}
                  />
                  <TextField style={{display:'none'}} hiddenLabel type="text" value={categoryMadeById} onChange={(e) => setCategoryMadeById(e.target.value)}  />
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
