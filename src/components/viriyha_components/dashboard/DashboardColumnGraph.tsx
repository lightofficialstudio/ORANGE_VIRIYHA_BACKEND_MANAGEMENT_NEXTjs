import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Props as ChartProps } from 'react-apexcharts';
import dynamic from 'next/dynamic';
// project import
import { Autocomplete, Grid, TextField } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// project import
import useConfig from 'hooks/useConfig';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 350
  },
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
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  },
  yaxis: {
    title: {
      text: '$ (thousands)'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return ` ${val} ครั้ง`;
      }
    }
  },
  legend: {
    show: true,
    fontFamily: `'Roboto', sans-serif`,
    position: 'bottom',
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false
    },
    markers: {
      width: 16,
      height: 16,
      radius: 5
    },
    itemMargin: {
      horizontal: 15,
      vertical: 8
    }
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

// ==============================|| COLUMN CHART ||============================== //

const DashboardColumnGraph = () => {
  const brand = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F', 'Brand G', 'Brand H', 'Brand I'];
  const campaign = [
    'Campaign A',
    'Campaign B',
    'Campaign C',
    'Campaign D',
    'Campaign E',
    'Campaign F',
    'Campaign G',
    'Campaign H',
    'Campaign I'
  ];
  const [selectedOption, setSelectOption] = useState(1);
  const [selectedArray, setSelectedArray] = useState<string[]>([]);
  const [selectedOnlyArray, setSelectedOnlyArray] = useState<string[]>([]);

  const optionData = [
    { id: 2, name: 'สิทธิพิเศษ' },
    { id: 1, name: 'แบรนด์' }
  ];
  const theme = useTheme();
  const { navType } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];

  const secondary = theme.palette.secondary.main;
  const primaryMain = theme.palette.dark.main;
  const successDark = theme.palette.success.dark;

  const [options, setOptions] = useState<ChartProps>(columnChartOptions);
  // Generate random series data
  const generateRandomSeries = (selectedArray: string[]) => {
    const filteredSeries = selectedArray.map((item) => ({
      name: item,
      data: Array.from({ length: 9 }, () => Math.floor(Math.random() * 100) + 1)
    }));
    return filteredSeries;
  };

  const [series, setSeries] = useState(() => generateRandomSeries(brand)); // Default to brand

  React.useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [secondary, primaryMain, successDark],
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
      },
      legend: {
        labels: {
          colors: 'grey.500'
        }
      }
    }));
  }, [navType, primary, darkLight, grey200, secondary, primaryMain, successDark]);

  React.useEffect(() => {
    if (selectedOption === 1) {
      setSelectedArray(brand);
      setSeries(generateRandomSeries(brand)); // Generate random series for brand
    } else if (selectedOption === 2) {
      setSelectedArray(campaign);
      setSeries(generateRandomSeries(campaign)); // Generate random series for campaign
    }
  }, [selectedOption]);

  React.useEffect(() => {
    setSeries(generateRandomSeries(selectedArray));
  }, [selectedArray]);

  React.useEffect(() => {
    setSeries(generateRandomSeries(selectedOnlyArray));
  }, [selectedOnlyArray]);

  return (
    <div id="chart">
      <Grid container spacing={4}>
        <Grid item xs={6} md={6} sx={{ marginBottom: '15px' }}>
          <Autocomplete
            options={optionData.map((option) => option.name)}
            onChange={(e, value) => {
              const selectedOptionId = optionData.find((option) => option.name === value)?.id ?? null;
              setSelectOption(selectedOptionId as number);
            }}
            renderInput={(params) => <TextField {...params} label="เปรียบเทียบ Brand" />}
          />
        </Grid>
        <Grid item xs={6} md={6} sx={{ marginBottom: '15px' }}>
          <Autocomplete
            multiple
            options={selectedArray}
            onChange={(e, value) => {
              setSelectedOnlyArray(value);
            }}
            renderInput={(params) => <TextField {...params} label="ตัวเลือก" />}
          />
        </Grid>
      </Grid>

      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default DashboardColumnGraph;
