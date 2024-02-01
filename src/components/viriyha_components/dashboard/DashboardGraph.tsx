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

// chart options
const lineChartOptions = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  }
};

// ==============================|| LINE CHART ||============================== //
interface DashboardGraphProps {
  titleMessage: string;
}

const DashboardGraph = ({ titleMessage }: DashboardGraphProps) => {
  const theme = useTheme();
  const { navType } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const secondary = theme.palette.secondary.main;

  const [series] = useState([
    {
      name: 'ครั้ง',
      data: [10342, 41421, 35634, 51213, 49232, 62123, 69523, 91325, 90234]
    }
  ]);

  const [options, setOptions] = useState<ChartProps>(lineChartOptions);

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
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={350} />
      </div>
    </MainCard>
  );
};

export default DashboardGraph;
