import * as React from 'react';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/material-ui/material-ui.scss';

type SuccessDialogProps = {
  open: boolean;
  handleClose: () => void;
  message?: string; // อาจจะเป็น string หรือ string[]
};

export default function SuccessDialog({ open, handleClose, message }: SuccessDialogProps) {
  React.useEffect(() => {
    if (open) {
      // สร้างเนื้อหา HTML จากอาร์เรย์ข้อความ ถ้ามันเป็นอาร์เรย์
      const formattedMessage = Array.isArray(message) ? message.map((m) => `<p>${m}</p>`).join('') : message || 'ดำเนินการเสร็จสิ้น!';

      Swal.fire({
        title: 'ยินดีด้วย!',
        html: formattedMessage, // ใช้ html แทน text
        icon: 'success',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#3f51b5'
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
        }
      });
    }
  }, [open, handleClose, message]); // เพิ่ม message ใน array ของ dependency

  // The SuccessDialog component doesn't need to render anything
  return null;
}
