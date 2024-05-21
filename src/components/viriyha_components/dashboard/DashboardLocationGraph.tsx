import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Autocomplete, Button, Grid, InputLabel, TextField } from '@mui/material';
// graph
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
// components
import MainCard from 'ui-component/cards/MainCard';
import ErrorDialog from '../modal/status/ErrorDialog';
// api
import axiosServices from 'utils/axios';

const optionRank = [
  { id: 'asc', name: ' อันดับจังหวัดที่มีการใช้งานสูงสุด' },
  { id: 'desc', name: ' อันดับจังหวัดที่มีการใช้งานต่ำสุด' }
];

const DashboardLocationGraph = ({ titleMessage, data }: any) => {
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [campaignOptions, setCampaignOptions] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  // variable
  const [rank, setRank] = useState<string>('asc');
  const [rankValue, setRankValue] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // ฟังก์ชันที่ใช้ในการประมวลผลข้อมูล
  const processData = (data: any, selectedCampaign: any, rank: string) => {
    const placeCount: Record<string, number> = {};
    data.Campaign_Code.forEach((code: any) => {
      code.Campaign_Transaction.forEach((transaction: any) => {
        if (!selectedCampaign || selectedCampaign.id === data.id) {
          const placeName = transaction.place?.name;
          if (placeName) {
            if (!placeCount[placeName]) {
              placeCount[placeName] = 0;
            }
            placeCount[placeName]++;
          }
        }
      });
    });

    const placeArray = Object.keys(placeCount).map((key) => ({
      name: key,
      count: placeCount[key]
    }));

    if (rank === 'asc') {
      placeArray.sort((a, b) => b.count - a.count);
    } else if (rank === 'desc') {
      placeArray.sort((a, b) => a.count - b.count);
    }

    if (placeArray && placeArray.length === 0) {
      setErrorMessage('ไม่พบข้อมูล');
      setOpenErrorDialog(true);
    }

    return placeArray.slice(0, rankValue);
  };
  // ฟังก์ชันที่ใช้ในการแสดงข้อมูล เฉพาะกรณี ข้อมูล หรือ แคมเปญ มีการเปลี่ยนแปลง

  // กรณี ข้อมูล หรือ แคมเปญ มีการเปลี่ยนแปลง
  useEffect(() => {
    if (Array.isArray(data)) {
      setCampaignOptions(
        data.map((campaign: any) => ({
          id: campaign.id,
          name: campaign.name
        }))
      );
    } else {
    }
  }, [data]);

  // ฟังก์ชันที่ใช้ในการแปลงวันที่
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'; // Return 'N/A' or some placeholder if the date is not valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date'; // Check if the date is invalid
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  };

  // ตัวแปรสำหรับการสร้างกราฟ
  const chartOptions = {
    title: {
      text: `Location Analytics - กราฟรายงานสถานที่รับสิทธิ์`,
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
      categories: processedData.map((item: any) => item.name)
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
      name: 'ครั้ง',
      data: processedData.map((item: any) => item.count)
    }
  ];

  // ฟังก์ชันที่ใช้ในการส่งข้อมูลไปยัง API
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setErrorMessage('กรุณากรอกวันที่เริ่มต้นและสิ้นสุด');
      setOpenErrorDialog(true);
      return;
    } else if (!rank || !rankValue) {
      setErrorMessage('กรุณาระบุเงือนไขการจัดอันดับ');
      setOpenErrorDialog(true);
      return;
    }
    // ส่งข้อมูลไปยัง API
    const formData = new FormData();
    formData.append('campaignId', selectedCampaign?.id); // ส่งข้อมูล campaignId ไปยัง API
    formData.append('rank', rank); // ส่งข้อมูล เงื่อนไข ไปยัง API
    formData.append('rankValue', rankValue.toString()); // ส่งข้อมูล อันดับ ไปยัง API
    formData.append('startDate', startDate); // ส่งข้อมูล วันที่เริ่มต้น ไปยัง API
    formData.append('endDate', endDate); // ส่งข้อมูล วันที่สิ้นสุด ไปยัง API
    const response = await axiosServices.post('/api/location_transaction/graph', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // ส่งข้อมูลที่ได้จาก API ไปยัง processData
    setProcessedData(processData(response.data, selectedCampaign, rank));
  };

  return (
    <MainCard title={titleMessage}>
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} marginBottom={2}>
          <InputLabel>แคมเปญ</InputLabel>
          <Autocomplete
            fullWidth
            options={campaignOptions}
            getOptionLabel={(option) => option.name}
            value={selectedCampaign}
            onChange={(event, newValue: any) => {
              setSelectedCampaign(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={6} md={2} marginBottom={2}>
          <InputLabel>จัดอันดับ</InputLabel>
          <TextField
            fullWidth
            type="number"
            placeholder="โปรดระบุอันดับที่ต้องการจัด"
            value={rankValue}
            onChange={(event) => {
              setRankValue(parseInt(event.target.value));
            }}
          />
        </Grid>
        <Grid item xs={6} md={4} marginBottom={2}>
          <InputLabel>เงื่อนไข</InputLabel>
          <Autocomplete
            fullWidth
            options={optionRank}
            getOptionLabel={(option) => option.name}
            value={optionRank.find((option) => option.id === rank) || optionRank[0]}
            onChange={(event, newValue: any) => {
              setRank(newValue?.id);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={6} md={6} marginBottom={5}>
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
        <Grid item xs={6} md={6} marginBottom={5}>
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
        <Grid item xs={12} md={12} marginBottom={5}>
          <Button fullWidth variant="contained" type="button" component="button" onClick={handleSubmit}>
            ค้นหา
          </Button>
        </Grid>

        <Grid item xs={12} md={12}>
          <ReactApexChart
            options={{
              ...chartOptions,
              title: {
                text: `Location Analytics - กราฟรายงานสถานที่รับสิทธิ์ ตั้งแต่วันที่ ${formatDate(startDate || '')} ถึง ${formatDate(
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
            width={1100}
          />{' '}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DashboardLocationGraph;
