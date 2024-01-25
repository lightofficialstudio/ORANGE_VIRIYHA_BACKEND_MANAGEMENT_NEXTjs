import * as React from 'react';

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';

type ErrorDialogProps = {
  open: boolean;
  handleClose: () => void;
  errorMessage: string;
};

export default function ErrorDialog({ open, handleClose, errorMessage }: ErrorDialogProps) {
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  return (
    <>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        {open && (
          <>
            <DialogTitle fontSize={18}>เกิดข้อผิดพลาดขึ้น!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Alert variant="filled" severity="error">
                  <b>ข้อความที่เกิดข้อผิดพลาดขึ้นคือ </b> : {errorMessage}!
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
