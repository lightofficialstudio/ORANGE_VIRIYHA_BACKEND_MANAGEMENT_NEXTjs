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

interface ModalChangePositionProps {
  type: string;
  title?: string;
  primaryId: number;
  position: string;
  isOpen: boolean;
  isClose: () => void;
  onSave: (response: boolean) => void;
}

export default function ModalChangePosition({ isOpen, isClose, onSave, title, primaryId, position, type }: ModalChangePositionProps) {
  const [newPosition, setNewPosition] = React.useState(position);
  const [error, setError] = React.useState<string>('');

  const handleSave = () => {
    if (newPosition === position) {
      setError('ตำแหน่งเดิมกับตำแหน่งใหม่ตรงกัน โปรดเปลี่ยนตำแหน่งใหม่');
    } else {
      const formData = new FormData();

      formData.append('old_position', position);
      formData.append('new_position', newPosition);

      axiosServices
        .post('api/' + type + '/update/' + primaryId + '/position', formData, {
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
    }
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
            title={'แก้ไขตำแหน่งของ ' + title}
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
                  ตำแหน่งปัจจุบัน : {position}
                </Typography>
              </Grid>
              <InputLabel required>ตำแหน่งใหม่</InputLabel>
              <TextField
                fullWidth
                required
                error={!!error}
                helperText={error}
                type="number"
                inputProps={{ maxLength: 3 }}
                onChange={(event: any) => {
                  setNewPosition(event.target.value);
                }}
                value={newPosition}
              />
            </CardContent>
            <Divider />
            <CardActions>
              <Grid container spacing={gridSpacing} justifyContent="end">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    แก้ไขตำแหน่ง
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
