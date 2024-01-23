import * as React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';

export default function SuccessDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  return (
    <>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        {open && (
          <>
            <DialogTitle>ทำรายการสำเร็จ</DialogTitle>
            <DialogContent>
              <DialogContentText>คุณได้สร้างข้อมูลใหม่เรียบร้อยแล้ว!</DialogContentText>
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
