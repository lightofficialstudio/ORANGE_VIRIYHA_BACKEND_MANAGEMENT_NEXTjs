import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Grid, TextField, Autocomplete } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DashboardLocationGraph = ({ data }: any) => {
  const comparisonType = 'Campaign';
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);

  useEffect(() => {
    if (comparisonType === 'Campaign' && data) {
      setOptions(data.map((item: any) => ({ id: item.CampaignId, name: item.CampaignName, transactions: item.Transaction_Count })));
    }
  }, [data, comparisonType]);

  const chartOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: selectedOptions.map((option: any) => option.name)
    },
    yaxis: {
      title: {
        text: 'Transactions'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val: any) => `${val} ครั้ง`
      }
    },
    legend: {
      show: true,
      position: 'bottom' as 'bottom' // Explicitly casting the type to match the expected literal type
    }
  };

  const series = [
    {
      name: 'Transactions',
      data: selectedOptions.map((option: any) => option.transactions)
    }
  ];

  return (
    <div id="chart">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedOptions}
            onChange={(event, newValue) => {
              setSelectedOptions(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="ตัวเลือก" />}
          />
        </Grid>
      </Grid>
      <ReactApexChart options={chartOptions} type="bar" series={series} height={350} />
    </div>
  );
};

export default DashboardLocationGraph;
