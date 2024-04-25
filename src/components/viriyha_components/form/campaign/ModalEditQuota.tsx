import React, { useEffect } from 'react';

// material-ui
import { CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';

interface ModalEditQuotaProps {
  isOpen: boolean;
  isClose: () => void;
  onSave: (id: number, quota: number) => void;
  primaryId: number;
  quantity: number;
}

export default function ModalEditQuota({ isOpen, isClose, onSave, primaryId, quantity }: ModalEditQuotaProps) {
  const [localQuota, setLocalQuota] = React.useState<number>(0);

  useEffect(() => {
    setLocalQuota(quantity);
  }, [quantity]);

  const handleSave = () => {
    onSave(primaryId, localQuota);
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
              <Grid container justifyContent="end">
                <Typography variant="h4" sx={{ mb: 2 }}>
                  จำนวนปัจจุบัน :
                </Typography>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {quantity}
                </Typography>
              </Grid>
              <InputLabel required>จำนวนที่ต้องการแก้ไข</InputLabel>
              <input type="hidden" value={primaryId} />
              <TextField
                fullWidth
                type="number"
                onChange={(event: any) => {
                  setLocalQuota(event.target.value);
                }}
                value={localQuota}
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
