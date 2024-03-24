import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // คุณสามารถเพิ่มเงื่อนไขเพิ่มเติมที่นี่ เช่น การตรวจสอบ cookie หรือ token
  // ถ้าไม่ตรงตามเงื่อนไข คุณสามารถทำการ redirect ได้

  return {
    redirect: {
      destination: '/login', // กำหนดเส้นทางที่ต้องการ redirect ไป
      permanent: false // ถ้าเป็น true, จะส่งสถานะ HTTP 301, ถ้าเป็น false จะส่งสถานะ HTTP 307
    }
  };
};

// ส่วนที่เหลือของ component หน้า
const Landing = () => {
  // โค้ดสำหรับ render หน้า
  return <div>Redirecting...</div>;
};

export default Landing;
