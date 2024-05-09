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
const DashboardColumnGraph = ({ data }: any) => {
  const [comparisonType, setComparisonType] = useState<string>('Campaign');
  const [compareDataOptions, setCompareDataOptions] = useState<any>([]);
  // condition
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // variable
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [compareData, setCompareData] = useState<any[]>([]);
  // Mockup brand data
  const mockBrands = [
    { id: 'brandA', name: 'Brand A', transactions: 50 },
    { id: 'brandB', name: 'Brand B', transactions: 75 },
    { id: 'brandC', name: 'Brand C', transactions: 25 }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'; // Return 'N/A' or some placeholder if the date is not valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date'; // Check if the date is invalid
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (comparisonType === 'Campaign' && data) {
      setCompareDataOptions(
        data.map((option: any) => ({
          CampaignId: option.CampaignId,
          CampaignName: option.CampaignName,
          Transaction_Count: option.Transaction_Count
        }))
      );
      console.log(compareDataOptions);
    } else if (comparisonType === 'Brand') {
      setCompareDataOptions(mockBrands);
    }
  }, [data, comparisonType]);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setErrorMessage('กรุณากรอกวันที่เริ่มต้นและสิ้นสุด');
      setOpenErrorDialog(true);
      return;
    }

    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('compareType', comparisonType);
    formData.append('compareData', JSON.stringify(compareData));
    const response = await axiosServices.post('/api/dashboard/redeem/search', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setCompareData(response.data);
  };

  const chartOptions = {
    chart: {
      id: 'bar-chart',
      type: 'bar' as const, // Ensuring the type is exactly 'bar'
      height: 350,
      toolbar: {
        show: true
      }
    },
    title: {
      text: `Reedem Transaction ตั้งแต่วันที่ ${formatDate(startDate || '')} ถึง ${formatDate(endDate || '')}`,
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top' // Position them on top of the bars
        }
      }
    },
    dataLabels: {
      enabled: true, // Enable data labels to show them on the bars
      formatter: function (val: number) {
        return val.toFixed(0); // Format numbers to show as integers
      },
      offsetY: -20,
      style: {
        fontSize: '18px',
        colors: ['#304758']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: compareData.map((option: any) => option.CampaignName),
      labels: {
        rotate: -90, // Rotate labels to 90 degrees for vertical display
        rotateAlways: true,
        maxHeight: 500, // Optionally adjust to ensure labels do not overlap
        style: {
          fontSize: '12px', // Adjust font size if necessary for visibility
          cssClass: 'lineSeedTH' // Custom CSS class for further styling if needed
        }
      }
    },
    yaxis: {
      title: {
        text: 'Transactions'
      },
      labels: {
        formatter: (val: number) => `${Math.round(val)}` // Ensure Y-axis labels are integers
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      enabled: false // Disable tooltips as labels are always visible
    },
    legend: {
      show: true,
      position: 'bottom' as 'bottom'
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
    setCompareData([]); // Clear the selected options when the type changes
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
        options={{ ...chartOptions, title: { ...chartOptions.title, align: 'center' } }}
        type="bar"
        series={series}
        height={700}
        width={1000}
      />
    </div>
  );
};

export default DashboardColumnGraph;
