import Swal from 'sweetalert2';
import '@sweetalert2/themes/material-ui/material-ui.scss';
import axiosServices from 'utils/axios';
import * as React from 'react';

type DeleteDialogProps = {
  open: boolean;
  handleClose: () => void;
  message?: string;
  id: number[];
  link: string;
  status: (statusDelete: boolean) => void;
};

export default function DeleteDialog({ open, handleClose, message, id, link, status }: DeleteDialogProps) {
  const htmlMessage = Array.isArray(message) ? message.map((m) => `<p>${m}</p>`).join('') : message;
  const [statusDelete, setStatusDelete] = React.useState<Boolean>(false);
  React.useEffect(() => {
    const deleteId = async () => {
      const data = { ids: id };
      const response = await axiosServices.post(link, data, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 200) {
        Swal.fire({
          title: 'ลบข้อมูลสำเร็จ!',
          html: response.data.message,
          icon: 'success',
          confirmButtonText: 'เข้าใจแล้ว',
          confirmButtonColor: '#3f51b5'
        });
        setStatusDelete(true);
        status(true);
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถลบข้อมูลได้',
          icon: 'error',
          confirmButtonText: 'เข้าใจแล้ว',
          confirmButtonColor: '#f44336'
        });
        setStatusDelete(false);
        status(false);
      }
    };

    const alert = async () => {
      Swal.fire({
        icon: 'warning',
        title: 'คำเตือน!',
        html: htmlMessage,
        showCancelButton: true,
        confirmButtonText: 'ใช่, ลบ!',
        confirmButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        cancelButtonColor: '#3f51b5'
      }).then(async (result) => {
        if (result.isConfirmed || result.isDismissed) {
          await deleteId();
          handleClose();
        }
        handleClose();
      });
    };
    if (open && id?.length > 0) {
      alert();
    } else if (open && id?.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณาเลือกข้อมูลที่ต้องการลบ',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#f44336'
      });
    }
    handleClose();
  }, [open, handleClose, id, link, htmlMessage]);

  return null;
}
