import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Props as ChartProps } from 'react-apexcharts';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// project import
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { FormControl, Grid, MenuItem, Select } from '@mui/material';

// chart options
const lineChartOptions = {
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
      export: {
        csv: {
          filename: undefined,
          columnDelimiter: ',',
          headerCategory: 'วันที่',
          headerValue: 'value',
          dateFormatter(timestamp: any) {
            return new Date(timestamp).toDateString();
          }
        },
        svg: {
          filename: undefined
        },
        png: {
          filename: undefined
        }
      },
      autoSelected: 'zoom'
    }
  }
};

// ==============================|| LINE CHART ||============================== //
interface DashboardGraphProps {
  titleMessage: string;
}

interface SeriesType {
  name: string;
  data: number[];
}

const DashboardGraph = ({ titleMessage }: DashboardGraphProps) => {
  const theme = useTheme();
  const { navType } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const secondary = theme.palette.secondary.main;
  const daysInMonth = {
    Jan: 31,
    Feb: 28, // Standard non-leap year
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31,
    All: 12 // Maximum number of days in a month
  };

  const generateMockDataForMonth = (month: string): number[] => {
    const maxDays = daysInMonth[month];
    let data = [];
    let baseValue = 10000; // Starting point for data

    for (let day = 1; day <= maxDays; day++) {
      // Generate a random fluctuation
      const fluctuation = Math.floor(Math.random() * 2000 - 1000);
      baseValue += fluctuation; // Fluctuate the base value
      data.push(Math.max(0, baseValue)); // Ensure data doesn't go below 0
    }

    return data;
  };

  const [series] = useState<SeriesType[]>([
    {
      name: 'ครั้ง',
      data: generateMockDataForMonth('All')
    }
  ]);

  const [options, setOptions] = useState<ChartProps>(lineChartOptions);
  const [selectedMonth, setSelectedMonth] = useState('All'); // เริ่มต้นด้วยการแสดงทั้งหมด
  const [filteredSeries, setFilteredSeries] = useState<SeriesType[]>(series);

  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newMonth = event.target.value as string;
    setSelectedMonth(newMonth);

    // Generate new series data for the selected month
    setFilteredSeries([
      {
        name: 'ครั้ง',
        data: generateMockDataForMonth(newMonth)
      }
    ]);
  };

  React.useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [secondary],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: navType === 'dark' ? darkLight + 20 : grey200
      },
      tooltip: {
        theme: navType === 'dark' ? 'dark' : 'light'
      }
    }));
  }, [navType, primary, darkLight, grey200, secondary]);

  return (
    <MainCard title={titleMessage}>
      <Grid container spacing={1}>
        <Grid item xs={6} md={6} sx={{ marginBottom: '15px' }}>
          {' '}
          <FormControl fullWidth>
            <InputLabel id="month-selector-label">เลือกเดือน</InputLabel>
            <Select
              labelId="month-selector-label"
              id="month-selector"
              value={selectedMonth}
              label="เลือกเดือน"
              onChange={(event: any) => handleMonthChange(event)}
            >
              <MenuItem value="All">ทั้งหมด</MenuItem>
              <MenuItem value="Jan">มกราคม</MenuItem>
              <MenuItem value="Feb">กุมภาพันธ์</MenuItem>
              <MenuItem value="Mar">มีนาคม</MenuItem>
              <MenuItem value="Apr">เมษายน</MenuItem>
              <MenuItem value="May">พฤษภาคม</MenuItem>
              <MenuItem value="Jun">มิถุนายน</MenuItem>
              <MenuItem value="Jul">กรกฎาคม</MenuItem>
              <MenuItem value="Aug">สิงหาคม</MenuItem>
              <MenuItem value="Sep">กันยายน</MenuItem>
              <MenuItem value="Oct">ตุลาคม</MenuItem>
              <MenuItem value="Nov">พฤศจิกายน</MenuItem>
              <MenuItem value="Dec">ธันวาคม</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12} md={12}>
          {' '}
          <div id="chart">
            <ReactApexChart options={options} series={filteredSeries} type="line" height={350} />
          </div>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DashboardGraph;
