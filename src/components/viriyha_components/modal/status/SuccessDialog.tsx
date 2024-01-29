import * as React from 'react';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/material-ui/material-ui.scss';

type SucessDialogProps = {
  open: boolean;
  handleClose: () => void;
};

export default function SucessDialog({ open, handleClose }: SucessDialogProps) {
  React.useEffect(() => {
    if (open) {
      Swal.fire({
        title: 'ยินดีด้วย!',
        text: 'รายการนี้ทำสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#3f51b5'
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
        }
      });
    }
  }, [open, handleClose]);

  // The SucessDialog component doesn't need to render anything
  return null;
}
