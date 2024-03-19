import React from 'react';

// material-ui
import { CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import axiosServices from 'utils/axios';

interface ErrorFormDialogProps {
  title?: string;
  primaryId: number;
  isOpen: boolean;
  isClose: () => void;
  onSave: (response: boolean) => void;
}

export default function ErrorFormDialog({ isOpen, isClose, onSave, title, primaryId }: ErrorFormDialogProps) {
  const [error, setError] = React.useState<string>('');
  const [errorName, setErrorName] = React.useState<string>('');
  const formatId = (id: number): string => {
    const formattedId = id.toString().padStart(4, '0');
    return `#ERR-${formattedId}`;
  };
  const handleSave = () => {
    if (errorName === '') {
      setError('กรุณากรอกข้อความที่ต้องการแก้ไข');
      return;
    }
    const formData = new FormData();

    axiosServices
      .post(`/api`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.status === 200) {
          onSave(true);
          setError('');
          isClose();
        }
      });
  };

  return (
    <Grid container justifyContent="flex-end">
      <Modal
        open={isOpen}
        onClose={isClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // ปรับค่าความเข้มของสีดำที่พื้นหลัง
            backdropFilter: 'blur(2px)' // เพิ่มความเบลอ
          }
        }}
      >
        <div
          tabIndex={-1}
          style={{
            position: 'absolute',
            width: '500px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <MainCard
            title={title}
            content={false}
            secondary={
              <IconButton onClick={isClose} size="large">
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <CardContent>
              <Grid container justifyContent="end">
                <Typography variant="h4" sx={{ mb: 2 }}>
                  รหัส : {formatId(primaryId)}
                </Typography>
              </Grid>
              <InputLabel required>ข้อความที่ต้องการแก้ไข</InputLabel>
              <TextField
                fullWidth
                required
                error={!!error}
                helperText={error}
                type="text"
                inputProps={{ maxLength: 256 }}
                onChange={(event: any) => setErrorName(event.target.value)}
                value={errorName}
              />
            </CardContent>
            <Divider />
            <CardActions>
              <Grid container spacing={gridSpacing} justifyContent="end">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    แก้ไข
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={isClose}>
                    ยกเลิก
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </MainCard>
        </div>
      </Modal>
    </Grid>
  );
}
