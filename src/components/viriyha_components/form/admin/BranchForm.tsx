import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import JWTContext from 'contexts/JWTContext';
import { Grid, TextField, Button, Autocomplete, Stack } from '@mui/material';
import axiosServices from 'utils/axios';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import InputLabel from 'ui-component/extended/Form/InputLabel';
// Dialog
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';

const StatusOption = [
  { status_name: 'เปิดใช้งาน', status: 'ACTIVE' },
  { status_name: 'ปิดใช้งาน', status: 'INACTIVE' }
];

type BranchFormProps = {
  titleMessage: string;
  confirmMessage?: string;
  shopId?: string;
  branchId?: string;
};

const BranchForm = ({ titleMessage, confirmMessage, shopId, branchId }: BranchFormProps) => {
  const router = useRouter();
  const { id } = router.query;
  const context = React.useContext(JWTContext);
  const [titleShop, setTitleShop] = useState('');
  const [BranchName, setBranchName] = useState('');
  const [PlaceId, setPlaceId] = useState('');
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');
  const [Status, setStatus] = useState('');
  // ตัวเลือก
  const [provinceOption, setProvinceOption] = useState([] as any[]);
  const MadeById = context?.user?.userInfo?.id;
  if (!MadeById) {
    window.location.reload();
  }
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (shopId) {
      axiosServices.get(`/api/shop/${shopId}`).then((response) => {
        setTitleShop(response.data.name);
      });

      // ดึงข้อมูลจังหวัดมาแสดงผล
      axiosServices.get('/api/province').then((response) => {
        setProvinceOption(response.data);
      });
    }
    if (branchId) {
      axiosServices.get(`/api/branch/${branchId}`).then((response) => {
        console.log(response);
        setBranchName(response.data.name);
        setLatitude(response.data.latitude);
        setLongitude(response.data.longitude);
        setStatus(response.data.status);
        setPlaceId(response.data.place_id);
      });
    }
  }, [branchId, shopId]);

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!BranchName || !Status) {
      setOpenErrorDialog(true);
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    event.preventDefault();
    const formData = new FormData();
    formData.append('shopId', shopId ?? '');
    formData.append('name', BranchName);
    formData.append('place_id', PlaceId);
    formData.append('latitude', Latitude);
    formData.append('longitude', Longitude);
    formData.append('status', Status);
    formData.append('createdById', String(MadeById));

    try {
      let response;
      const header = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (branchId) {
        response = await axiosServices.put(`/api/branch/update/${id}`, formData, header);
      } else {
        response = await axiosServices.post('/api/branch/create', formData, header);
      }
      console.log(response);
      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/admin/shop/detail/' + shopId;
      } else {
        setOpenErrorDialog(true);
        setErrorMessage(response.statusText);
      }
    } catch (error: any) {
      setOpenErrorDialog(true);
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };
  return (
    <>
      <MainCard>
        <MainCard title={titleMessage} content={true}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={12}>
              <SubCard title={`${titleMessage} ภายใต้ร้านค้า [${titleShop}]`}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputLabel required>ชื่อสาขา</InputLabel>
                    <TextField
                      fullWidth
                      placeholder="เช่น KFC นวลจันทร์ , McDonald พระราม 2"
                      value={BranchName}
                      onChange={(event: any) => {
                        setBranchName(event.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel required>จังหวัด</InputLabel>
                    <Autocomplete
                      options={provinceOption}
                      getOptionLabel={(option) => (option ? option.name : '')}
                      value={provinceOption.find((option) => option.id === PlaceId) || null}
                      onChange={(event, newValue) => {
                        setPlaceId(newValue ? newValue.id : '');
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <InputLabel>ละติจูด</InputLabel>
                    <TextField
                      fullWidth
                      placeholder=""
                      value={Latitude}
                      onChange={(event: any) => {
                        setLatitude(event.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <InputLabel>ลองติจูด</InputLabel>
                    <TextField
                      fullWidth
                      placeholder=""
                      value={Longitude}
                      onChange={(event: any) => {
                        setLongitude(event.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel required>สถานะ</InputLabel>
                    <Autocomplete
                      options={StatusOption}
                      getOptionLabel={(option) => (option ? option.status_name : '')}
                      value={StatusOption.find((option) => option.status === Status) || null}
                      onChange={(event, newValue) => {
                        setStatus(newValue ? newValue.status : '');
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </SubCard>
              <Grid container justifyContent="right" alignItems="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Stack direction="row" spacing={2}>
                    <AnimateButton>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                      >
                        {confirmMessage}
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button href={`/admin/shop/detail/${shopId}`} variant="contained" color="error">
                        ยกเลิก
                      </Button>
                    </AnimateButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </MainCard>
      <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
    </>
  );
};

export default BranchForm;
