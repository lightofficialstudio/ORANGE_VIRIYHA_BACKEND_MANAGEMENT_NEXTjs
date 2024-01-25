import * as React from 'react';
import Swal from 'sweetalert2';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';
export default function SuccessDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  return (
    <>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        {open && (
          <>
            <DialogTitle>ยินดีด้วย!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {' '}
                <Alert variant="filled" severity="success">
                  <b>คุณทำรายการสำเร็จ! </b> 
                </Alert>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>ปิด</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
