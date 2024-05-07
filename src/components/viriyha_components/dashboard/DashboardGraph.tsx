import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

import MainCard from 'ui-component/cards/MainCard';

const DashboardGraph = ({ titleMessage, month }: any) => {
  const [selectedMonth, setSelectedMonth] = useState('All'); // Use 'All' to show all months initially
  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    // Update options based on the selectedMonth
    setOptions({
      chart: {
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            customIcons: []
          },
          autoSelected: 'zoom'
        }
      },
      xaxis: {
        categories:
          selectedMonth === 'All'
            ? month.map((_: any, idx: any) => `เดือนที่ ${idx + 1}`)
            : month[selectedMonth].map((_: any, idx: any) => `วันที่ ${idx + 1}`)
      },
      tooltip: {
        x: {
          format: selectedMonth === 'All' ? 'MMMM' : 'MMM dd'
        }
      },
      grid: {
        borderColor: '#f1f1f1'
      }
    });

    if (selectedMonth === 'All') {
      setSeries([
        {
          name: 'ยอดการเข้าชมทั้งหมด',
          data: month.map((m: any) => m.reduce((a: any, b: any) => a + b, 0))
        }
      ]);
    } else {
      setSeries([
        {
          name: 'Daily Views',
          data: month[selectedMonth]
        }
      ]);
    }
  }, [selectedMonth, month]);

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <MainCard title={titleMessage}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">เลือกเดือนแสดงผล</Typography>
          <FormControl fullWidth>
            <Select labelId="month-select-label" id="month-select" value={selectedMonth} onChange={handleMonthChange}>
              <MenuItem value="All">ทั้งหมด</MenuItem>
              {month.map((_: any, index: any) => (
                <MenuItem key={index} value={index}>{`เดือนที่ ${index + 1}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <ReactApexChart options={options} series={series} type="line" height={350} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DashboardGraph;
