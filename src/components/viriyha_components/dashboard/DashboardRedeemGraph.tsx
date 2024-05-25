import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Grid, TextField, Autocomplete, Button } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import ErrorDialog from '../modal/status/ErrorDialog';
import axiosServices from 'utils/axios';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DashboardRedeemGraph = ({ data }: any) => {
  const [comparisonType, setComparisonType] = useState<string>('Campaign');
  const [compareDataOptions, setCompareDataOptions] = useState<any>([]);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [compareData, setCompareData] = useState<any[]>([]);
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [brandData, setBrandData] = useState<any[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  };

  const generateMonthLabels = (startDate: any, endDate: any) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];

    for (let date = new Date(start); date <= end; date.setMonth(date.getMonth() + 1)) {
      const month = date.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
      months.push(month);
    }

    return months;
  };

  useEffect(() => {
    if (comparisonType === 'Campaign') {
      setCompareDataOptions(
        campaignData.map((option: any) => ({
          CampaignId: option.CampaignId,
          CampaignName: option.CampaignName,
          MonthlyCounts: option.MonthlyCounts
        }))
      );
    } else if (comparisonType === 'Brand') {
      setCompareDataOptions(
        brandData.map((option: any) => ({
          CampaignId: option.CampaignId,
          CampaignName: option.CampaignName,
          MonthlyCounts: option.MonthlyCounts
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

    try {
      const response = await axiosServices.post('/api/dashboard/redeem/search', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCompareData([]);

      setCampaignData(
        response.data.map((campaign: any) => ({
          CampaignId: campaign.CampaignId,
          CampaignName: campaign.CampaignName,
          MonthlyCounts: campaign.MonthlyCounts
        }))
      );

      // Assuming Shop_Summary follows a similar structure to Campaign_Count
      setBrandData(
        response.data.map((brand: any) => ({
          CampaignId: brand.CampaignId,
          CampaignName: brand.ShopName,
          MonthlyCounts: brand.MonthlyCounts
        }))
      );
    } catch (error) {
      setErrorMessage('An error occurred while fetching data.');
      setOpenErrorDialog(true);
    }
  };

  const monthLabels = generateMonthLabels(startDate, endDate);

  const chartOptions = {
    title: {
      text: `Redeem Transaction - กราฟรายงานสถานที่รับสิทธิ์ ตั้งแต่ ${formatDate(startDate)} ถึง ${formatDate(endDate)}`,
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: monthLabels
    },
    yaxis: {
      labels: {
        formatter: (val: any) => (typeof val === 'number' ? val.toFixed(0) : val)
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(0)
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 5
    }
  };

  const series = compareData.map((option: any) => ({
    name: option.CampaignName,
    data: option.MonthlyCounts
  }));

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
          <InputLabel>เปรียบเทียบโดย</InputLabel>
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
                  MonthlyCounts: item.MonthlyCounts
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
          chart: { type: 'line', height: 350, width: 1200 },
          stroke: { curve: 'smooth' } // Add this line to specify the curve type
        }}
        type="line"
        series={series}
      />
    </div>
  );
};

export default DashboardRedeemGraph;
