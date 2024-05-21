import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Grid, TextField, Autocomplete, Button } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import ErrorDialog from '../modal/status/ErrorDialog';
import axiosServices from 'utils/axios';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
// const dateFormat = [
//   {
//     id: 'daily',
//     name: 'รายวัน'
//   },
//   {
//     id: 'weekly',
//     name: 'รายอาทิตย์'
//   },
//   {
//     id: 'monthly',
//     name: 'รายเดือน'
//   }
// ];
const DashboardRedeemGraph = ({ data }: any) => {
  const [comparisonType, setComparisonType] = useState<string>('Campaign');
  const [compareDataOptions, setCompareDataOptions] = useState<any>([]);
  // condition
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // variable
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [compareData, setCompareData] = useState<any[]>([]);
  // temp data
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [brandData, setBrandData] = useState<any[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'; // Return 'N/A' or some placeholder if the date is not valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date'; // Check if the date is invalid
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (comparisonType === 'Campaign') {
      setCompareDataOptions(
        campaignData.map((option: any) => ({
          CampaignId: option.CampaignId,
          CampaignName: option.CampaignName,
          Transaction_Count: option.Transaction_Count
        }))
      );
    } else if (comparisonType === 'Brand') {
      setCompareDataOptions(
        brandData.map((option: any) => ({
          CampaignId: option.CampaignId,
          CampaignName: option.CampaignName,
          Transaction_Count: option.Transaction_Count
        }))
      );
    }
  }, [data, comparisonType, campaignData, brandData]);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setErrorMessage('กรุณากรอกวันที่เริ่มต้นและสิ้นสุด');
      setOpenErrorDialog(true);
      return;
    }

    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    // formData.append('compareType', comparisonType);
    // formData.append('compareData', JSON.stringify(compareData));
    const response = await axiosServices.post('/api/dashboard/redeem/search', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setCompareData([]);
    // แทนตัวแปรสำหรับ Campaign
    setCampaignData(
      response.data.Campaign_Count.map((campaign: any) => {
        return {
          CampaignId: campaign.CampaignId,
          CampaignName: campaign.CampaignName,
          Transaction_Count: campaign.Transaction_Count
        };
      })
    );
    // แทนตัวแปรสำหรับ Brand
    setBrandData(
      response.data.Shop_Summary.map((brand: any) => {
        return {
          CampaignId: brand.CampaignId,
          CampaignName: brand.ShopName,
          Transaction_Count: brand.Total_Transaction_Count
        };
      })
    );
  };

  const chartOptions = {
    title: {
      text: `Redeem Transaction  - กราฟรายงานสถานที่รับสิทธิ์ ตั้งแต่ ${formatDate(startDate)} ถึง ${formatDate(endDate)}`,
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: compareData.map((item: any) => item.CampaignName)
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(0); // Format numbers to show as integers
      }
    },
    yaxis: {
      labels: {
        formatter: function (val: any) {
          return typeof val === 'number' ? val.toFixed(0) : val; // Ensure y-axis labels are integers
        }
      }
    }
  };

  const series = [
    {
      name: 'Transactions',
      data: compareData.map((option: any) => option.Transaction_Count)
    }
  ];

  const handleComparisonChange = (event: any, newValue: any) => {
    setComparisonType(newValue);
    setCompareData([]);
  };

  return (
    <div id="chart">
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <InputLabel>วันที่เริ่มต้น</InputLabel>
          <TextField
            fullWidth
            type="date"
            value={startDate}
            size="medium"
            variant="outlined"
            onChange={(event: any) => {
              setStartDate(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>วันที่สิ้นสุด</InputLabel>
          <TextField
            fullWidth
            type="date"
            value={endDate}
            size="medium"
            variant="outlined"
            onChange={(event: any) => {
              const newEndDate = event.target.value;
              if (newEndDate <= (startDate ?? '')) {
                setEndDate('');
                setErrorMessage('วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด');
                setOpenErrorDialog(true);
              } else {
                setEndDate(newEndDate);
              }
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={'20px'}>
        <Grid item xs={12} md={6}>
          <InputLabel>เปรียบเทียบโดย</InputLabel>

          <Autocomplete
            options={['Campaign', 'Brand']}
            value={comparisonType}
            onChange={handleComparisonChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>ตัวเลือก</InputLabel>
          <Autocomplete
            multiple
            options={compareDataOptions}
            getOptionLabel={(option) => option.CampaignName}
            value={compareData}
            onChange={(event, newValue: any) => {
              setCompareData(
                newValue.map((item: any) => ({
                  CampaignId: item.CampaignId,
                  CampaignName: item.CampaignName,
                  Transaction_Count: item.Transaction_Count
                }))
              );
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} marginTop={'20px'} marginBottom={'20px'}>
        <Grid item xs={12} md={12} alignContent={'center'} justifyContent={'center'} textAlign={'center'}>
          <Button fullWidth variant="contained" type="button" component="button" onClick={handleSubmit}>
            ค้นหา
          </Button>
        </Grid>
      </Grid>

      <ReactApexChart
        options={{
          ...chartOptions,
          title: {
            text: `Redeem Transaction - กราฟรายงานสถานที่รับสิทธิ์ ตั้งแต่วันที่ ${formatDate(startDate || '')} ถึง ${formatDate(
              endDate || ''
            )}`,
            align: 'center',
            style: {
              fontSize: '20px',
              fontWeight: 'bold'
            }
          },
          chart: { type: 'bar', height: 350, width: 1200 }
        }}
        type="bar"
        series={series}
        height={700}
        width={1000}
      />
    </div>
  );
};

export default DashboardRedeemGraph;
