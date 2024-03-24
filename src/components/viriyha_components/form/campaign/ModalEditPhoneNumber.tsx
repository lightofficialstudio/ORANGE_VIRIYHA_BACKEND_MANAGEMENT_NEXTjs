import React, { useEffect } from 'react';

// material-ui
import { CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';

interface ModalEditPhoneNumberProps {
  isOpen: boolean;
  isClose: () => void;
  onSave: (id: number, phonenumber: string) => void;
  primaryId: number;
  phonenumber: string;
}

export default function ModalEditPhoneNumber({ isOpen, isClose, onSave, primaryId, phonenumber }: ModalEditPhoneNumberProps) {
  const [localPhoneNumber, setLocalPhoneNumber] = React.useState<string>('');

  useEffect(() => {
    setLocalPhoneNumber(phonenumber);
  }, [phonenumber]);

  const handleSave = () => {
    onSave(primaryId, localPhoneNumber);
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
            title="แก้ไขเบอร์มือถือ"
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
                  เบอร์ปัจจุบัน :
                </Typography>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {phonenumber}
                </Typography>
              </Grid>
              <InputLabel required>เบอร์มือถือที่ต้องการแก้ไข</InputLabel>
              <input type="hidden" value={primaryId} />
              <TextField
                fullWidth
                type="text"
                onChange={(event: any) => {
                  setLocalPhoneNumber(event.target.value);
                }}
                value={localPhoneNumber}
              />
            </CardContent>
            <Divider />
            <CardActions>
              <Grid container spacing={gridSpacing} justifyContent="end">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    แก้ไขข้อมูล
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
