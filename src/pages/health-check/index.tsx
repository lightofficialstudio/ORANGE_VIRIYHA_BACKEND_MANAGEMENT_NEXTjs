import { useEffect, useState } from 'react';
import axiosServices from 'utils/axios';

const HealthCheck = () => {
  const [healthCheck, setHealthCheck] = useState<string>('Not Connected');
  const [azureHealthCheck, setAzureHealthCheck] = useState<string>('Not Connected');

  useEffect(() => {
    axiosServices.get('/api/health-check').then((response) => {
      setHealthCheck(response.data.backend);
      setAzureHealthCheck(response.data.azure);
    });
  }, []);

  return (
    <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
      <h1>Application Health Check</h1>
      <p>NEXTJS : FRONT-END</p> <p style={{ color: 'green' }}>Connected</p>
      <p>NODEJS : Backend API Health Check:</p> <p style={{ color: 'green' }}>{healthCheck}</p>
      <p>AZURE : Azure Bolb Cloud</p> <p style={{ color: 'green' }}>{azureHealthCheck}</p>
    </div>
  );
};

export default HealthCheck;
