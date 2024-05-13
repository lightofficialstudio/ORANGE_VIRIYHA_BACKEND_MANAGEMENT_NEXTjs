import React, { useEffect } from 'react';

// material-ui
import { CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';

interface ModalEditCodeNumberProps {
  isOpen: boolean;
  isClose: () => void;
  onSave: (id: number, code_number: string) => void;
  primaryId: number;
  code_number: string;
}

export default function ModalEditCodeNumber({ isOpen, isClose, onSave, primaryId, code_number }: ModalEditCodeNumberProps) {
  const [localCodeNumber, setLocalCodeNumber] = React.useState<string>('');

  useEffect(() => {
    setLocalCodeNumber(code_number);
  }, [code_number]);

  const handleSave = () => {
    onSave(primaryId, localCodeNumber);
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
            title="แก้ไขโค้ด"
            content={false}
            secondary={
              <IconButton onClick={isClose} size="large">
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <CardContent>
              <Grid container justifyContent="end">
                <Grid md={12} sm={12}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    โค้ดปัจจุบัน
                  </Typography>
                </Grid>
                <Grid md={12} sm={12}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {code_number}
                  </Typography>
                </Grid>
              </Grid>
              <InputLabel required>โค้ดที่ต้องการแก้ไข</InputLabel>
              <input type="hidden" value={primaryId} />
              <TextField
                fullWidth
                type="text"
                onChange={(event: any) => {
                  setLocalCodeNumber(event.target.value);
                }}
                value={localCodeNumber}
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
