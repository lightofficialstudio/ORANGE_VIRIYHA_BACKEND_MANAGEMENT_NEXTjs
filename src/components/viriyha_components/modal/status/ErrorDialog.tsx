import * as React from 'react';
import Swal from 'sweetalert2';

type ErrorDialogProps = {
  open: boolean;
  handleClose: () => void;
  errorMessage: string;
};

export default function ErrorDialog({ open, handleClose, errorMessage }: ErrorDialogProps) {
  React.useEffect(() => {
    if (open) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#2196f3'
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
        }
      });
    }
  }, [open, errorMessage, handleClose]);

  // The ErrorDialog component doesn't need to render anything
  return null;
}
