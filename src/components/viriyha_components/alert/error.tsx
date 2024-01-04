import React from 'react';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

// ===============================|| UI DIALOG - SWEET ALERT ||=============================== //
interface AlertErrorDialogProps {
  Open: boolean;
  Message: string;
  Close: () => void;
}
const AlertErrorDialog = ({ Open, Close, Message }: AlertErrorDialogProps) => {
  return (
    <>
      <Dialog open={Open} onClose={Close} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ p: 3 }}>
        {Open && (
          <>
            <DialogTitle id="alert-dialog-title">เกิดข้อผิดพลาดขึ้น!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Typography variant="body2" component="span">
                  {Message}
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ pr: 2.5 }}>
              <Button variant="contained" size="small" onClick={Close} autoFocus>
                เข้าใจแล้ว
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AlertErrorDialog;
