import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Grid, TextField, Autocomplete } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DashboardColumnGraph = ({ data }: any) => {
  const [comparisonType, setComparisonType] = useState<string>('Campaign');
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);

  // Mockup brand data
  const mockBrands = [
    { id: 'brandA', name: 'Brand A', transactions: 50 },
    { id: 'brandB', name: 'Brand B', transactions: 75 },
    { id: 'brandC', name: 'Brand C', transactions: 25 }
  ];

  useEffect(() => {
    if (comparisonType === 'Campaign' && data) {
      setOptions(data.map((item: any) => ({ id: item.CampaignId, name: item.CampaignName, transactions: item.Transaction_Count })));
    } else if (comparisonType === 'Brand') {
      setOptions(mockBrands);
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

  const handleComparisonChange = (event: any, newValue: any) => {
    setComparisonType(newValue);
    setSelectedOptions([]); // Clear the selected options when the type changes
  };

  return (
    <div id="chart">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={['Campaign', 'Brand']}
            value={comparisonType}
            onChange={handleComparisonChange}
            renderInput={(params) => <TextField {...params} label="เปรียบเทียบโดย" />}
          />
        </Grid>
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

export default DashboardColumnGraph;
