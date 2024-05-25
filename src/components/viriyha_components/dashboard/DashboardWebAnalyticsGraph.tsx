import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Autocomplete, Grid, InputLabel, TextField } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// components
import MainCard from 'ui-component/cards/MainCard';
import ErrorDialog from '../modal/status/ErrorDialog';

const optionRank = [
  { id: 'All', name: 'ทั้งหมด' },
  { id: 'Top_View', name: 'อันดับยอดวิวรายครั้งสูงสุด' },
  { id: 'Bottom_View', name: 'อันดับยอดวิวรายครั้งต่ำสุด' },
  { id: 'Top_Unique_View', name: 'อันดับยอดวิวรายคนสูงสุด' },
  { id: 'Bottom_Unique_View', name: 'อันดับยอดวิวรายคนสูงสุด' }
];

const DashboardWebAnalyticsGraph = ({ titleMessage, data }: any) => {
  // condition
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [campaignOptions, setCampaignOptions] = useState<any[]>([]);
  // variable
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [rank, setRank] = useState<string>('All');
  const [rankValue, setRankValue] = useState<number>(10);
  const [selectedCampaigns, setSelectedCampaigns] = useState<any>([]);

  const processData = (campaignData: any) => {
    let processedData = [...data];
    if (campaignData.length > 0) {
      processedData = [...campaignData];
    }
    if (rank === 'All') {
      processedData = processedData;
    } else if (rank === 'Top_View') {
      processedData = processedData.sort((a, b) => b.view - a.view);
    } else if (rank === 'Top_Unique_View') {
      processedData = processedData.sort((a, b) => b.unique_view - a.unique_view);
    } else if (rank === 'Bottom_View') {
      processedData = processedData.sort((a, b) => a.view - b.view);
    } else if (rank === 'Bottom_Unique_View') {
      processedData = processedData.sort((a, b) => a.unique_view - b.unique_view);
    }
    processedData = processedData.slice(0, rankValue);
    return processedData;
  };

  useEffect(() => {
    if (data) {
      setSelectedCampaigns(processData(campaigns));
      setCampaignOptions(data);
      setErrorMessage('');
    }
  }, [rank, data, campaigns, rankValue]);

  const chartOptions = {
    title: {
      text: `Web report dashboard - รายงานเกี่ยวกับเว็บไซต์`,
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
      categories: selectedCampaigns.map((c: any) => c.name)
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
    }
  };

  const series = [
    {
      name: 'Views',
      data: selectedCampaigns.map((c: any) => c.view)
    },
    {
      name: 'Unique Views',
      data: selectedCampaigns.map((c: any) => c.unique_view)
    }
  ];

  return (
    <MainCard title={titleMessage}>
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={12} marginBottom={2}>
          <InputLabel>แคมเปญ</InputLabel>
          <Autocomplete
            fullWidth
            multiple
            options={campaignOptions}
            getOptionLabel={(option) => option.name}
            value={campaigns}
            onChange={(event, newValue: any) => {
              setCampaigns(
                newValue.map((data: any) => ({
                  id: data.id,
                  name: data.name,
                  view: data.view,
                  unique_view: data.unique_view
                }))
              );
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
        <Grid item xs={12} md={4} marginBottom={5}>
          <InputLabel>เปรียบเทียบโดย</InputLabel>
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
        <ReactApexChart
          options={{ ...chartOptions, title: { align: 'center' }, chart: { type: 'bar', height: 350 } }}
          type="bar"
          series={series}
        />{' '}
      </Grid>
    </MainCard>
  );
};

export default DashboardWebAnalyticsGraph;
