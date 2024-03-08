import React from 'react';

// material-ui
import { CardContent, CardActions, Divider, Grid, IconButton, Modal, TextField, Button, Autocomplete } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';

interface ModalFilterStatusProps {
  isOpen: boolean;
  isClose: () => void;
  onSave: (status: string) => void;
}

const status = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
];

export default function ModalFilterStatus({ isOpen, isClose, onSave }: ModalFilterStatusProps) {
  const [localStatus, setLocalStatus] = React.useState<string>('');

  const handleSave = () => {
    onSave(localStatus);
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
            title="แก้ไขโควต้า"
            content={false}
            secondary={
              <IconButton onClick={isClose} size="large">
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <CardContent>
              <Autocomplete
                options={status}
                getOptionLabel={(option) => option.label}
                onChange={(_event, value) => {
                  setLocalStatus(value?.value as string);
                }}
                renderInput={(params) => <TextField {...params} label="สถานะ" />}
              />
            </CardContent>
            <Divider />
            <CardActions>
              <Grid container spacing={gridSpacing} justifyContent="end">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    ยืนยัน
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
