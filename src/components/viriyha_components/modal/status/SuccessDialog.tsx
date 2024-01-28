import * as React from 'react';
import Swal from 'sweetalert2';

type ErrorDialogProps = {
  open: boolean;
  handleClose: () => void;
};

export default function ErrorDialog({ open, handleClose }: ErrorDialogProps) {
  React.useEffect(() => {
    if (open) {
      Swal.fire({
        title: 'ยินดีด้วย!',
        text: 'รายการนี้ทำสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#2196f3'
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
        }
      });
    }
  }, [open, handleClose]);

  // The ErrorDialog component doesn't need to render anything
  return null;
}
