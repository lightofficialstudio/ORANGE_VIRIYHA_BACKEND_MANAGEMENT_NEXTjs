const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  if (selected.length === 0) {
    Swal.fire({
      title: 'โปรดเลือกรายการที่ต้องการลบก่อน!',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'เข้าใจแล้ว'
    });
    return;
  }
  Swal.fire({
    title: 'คุณต้องการลบรายการที่เลือกไว้ใช้หรือไม่?',
    text: 'โปรดระวังการลบข้อมูลเป็นเรื่องที่ละเอียดอ่อน!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบทันที!',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      const header = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = axiosServices.post(`/api/shop/delete`, { ids: selected }, header);
      Swal.fire('ลบรายการนี้เรียบร้อยแล้ว!' + response, '', 'success');
      dispatch(getShopList());
      console.log(selected.join(','));
    }
  });
};
