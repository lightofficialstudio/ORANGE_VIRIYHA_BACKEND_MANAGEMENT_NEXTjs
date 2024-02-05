import * as React from 'react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
// project imports
import Page from 'components/ui-component/Page';
import Layout from 'layout';
import BranchForm from 'components/viriyha_components/form/admin/BranchForm';
import axiosServices from 'utils/axios';
// ==============================|| ORDER LIST ||============================== //

const EditBranchPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [branchId] = React.useState(id as string);
  const [shopId, setShopId] = React.useState('');
  React.useEffect(() => {
    const getBranchBy = async (branchId: string) => {
      const response = await axiosServices.get(`/api/branch/${branchId}`);
      console.log(response);
      setShopId(response.data.Shop.id);
    };
    getBranchBy(branchId as string);
  });
  return (
    <Page title="Shop Detail">
      <BranchForm confirmMessage={'แก้ไข'} titleMessage={'แก้ไขสาขา'} shopId={shopId as string} branchId={branchId as string} />
    </Page>
  );
};

EditBranchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditBranchPage;
