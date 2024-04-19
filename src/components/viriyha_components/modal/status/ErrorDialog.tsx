import * as React from 'react';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/material-ui/material-ui.scss';

type ErrorDialogProps = {
  open: boolean;
  handleClose: () => void;
  errorMessage: string;
};

export default function ErrorDialog({ open, handleClose, errorMessage }: ErrorDialogProps) {
  React.useEffect(() => {
    if (open) {
      Swal.fire({
        title: 'คำเตือน!',
        text: errorMessage,
        icon: 'info',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#f44336'
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
