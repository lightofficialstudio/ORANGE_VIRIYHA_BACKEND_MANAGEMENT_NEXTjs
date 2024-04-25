import * as React from 'react';
import { format } from 'date-fns';
// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
  Box,
  CardContent,
  Checkbox,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

import { visuallyHidden } from '@mui/utils';

// project imports
import Chip from 'ui-component/extended/Chip';
import { useDispatch, useSelector } from 'store';
// project data
import { BannerManagementType } from 'types/viriyha_type/banner';
import { getBannerList } from 'store/slices/viriyha/banner';
// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';
import AddIcon from '@mui/icons-material/AddTwoTone';
import Link from 'next/link';
import Avatar from 'ui-component/extended/Avatar';
// response
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';
// third-party
import Swal from 'sweetalert2';
import { openSnackbar } from 'store/slices/snackbar';
import axiosServices from 'utils/axios';
// modal
import ModalChangePosition from '../modal/banners/ChangePosition';
import ModalFilterStatus from '../table-filter/BannerFilter';

// table sort
function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator: GetComparator = (order, orderBy) =>
  order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array: BannerManagementType[], comparator: (a: BannerManagementType, b: BannerManagementType) => number) {
  const stabilizedThis = array?.map((el: BannerManagementType, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as BannerManagementType, b[0] as BannerManagementType);
    if (order !== 0) return order;
    return (a[1] as number) - (b[1] as number);
  });
  return stabilizedThis?.map((el) => el[0]);
}

// table header options

const headCells: HeadCell[] = [
  {
    id: 'id',
    numeric: true,
    label: 'ID',
    align: 'left'
  },
  {
    id: 'position',
    numeric: true,
    label: 'ตำแหน่ง',
    align: 'right'
  },
  {
    id: 'image',
    numeric: false,
    label: 'รูปภาพ',
    align: 'center'
  },
  {
    id: 'name',
    numeric: false,
    label: 'ชื่อแบนเนอร์',
    align: 'left'
  },

  {
    id: 'updatedAt',
    numeric: true,
    label: 'วันที่แก้ไขล่าสุด',
    align: 'right'
  },
  {
    id: 'created_by',
    numeric: true,
    label: 'ผู้ที่สร้าง',
    align: 'center'
  },
  {
    id: 'status',
    numeric: false,
    label: 'สถานะ',
    align: 'center'
  }
];

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }: EnhancedTableToolbarProps) => (
  <Toolbar
    sx={{
      p: 0,
      pl: 1,
      pr: 1,
      ...(numSelected > 0 && {
        color: (theme) => theme.palette.secondary.main
      })
    }}
  >
    {numSelected > 0 ? (
      <Typography color="inherit" variant="h4">
        {numSelected} รายการที่เลือกไว้แล้ว
      </Typography>
    ) : (
      <Typography variant="h6" id="tableTitle">
        Nutrition
      </Typography>
    )}
    <Box sx={{ flexGrow: 1 }} />
    {numSelected > 0 && (
      <Tooltip title="ลบรายการ">
        <IconButton size="large">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
);

// ==============================|| TABLE HEADER ||============================== //

interface OrderListEnhancedTableHeadProps extends EnhancedTableHeadProps {
  theme: Theme;
  selected: string[];
}

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  theme,
  selected
}: OrderListEnhancedTableHeadProps) {
  const createSortHandler = (property: string) => (event: React.SyntheticEvent<Element, Event>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ pl: 3 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        {numSelected > 0 && (
          <TableCell padding="none" colSpan={8}>
            <EnhancedTableToolbar numSelected={selected.length} />
          </TableCell>
        )}
        {numSelected <= 0 &&
          headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        {numSelected <= 0 && (
          <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
              จัดการ
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER LIST ||============================== //

const BannerTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<BannerManagementType[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const { banner } = useSelector((state) => state.banner);
  const baseUrl = process.env.IMAGE_VIRIYHA_URL + '/images/banner/';
  console.log('baseUrl', baseUrl);
  // modal
  const [openChangePositionModal, setOpenChangePositionModal] = React.useState<boolean>(false);
  const [openFilterStatus, setOpenFilterStatus] = React.useState<boolean>(false);
  // response
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  // temp data
  const [selectedId, setSelectedId] = React.useState<number>(0);
  const [selectedPosition, setSelectedPosition] = React.useState<string>('');
  const [selectedTitle, setSelectedTitle] = React.useState<string>('');
  // filter
  const [filterStatus, setFilterStatus] = React.useState<string>('');

  React.useEffect(() => {
    dispatch(getBannerList());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(banner);
  }, [banner]);
  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    const newString = event?.target.value;
    setSearch(newString || '');

    if (newString) {
      const newRows = rows.filter((row: KeyedObject) => {
        let matches = true;

        const properties = ['name', 'id'];
        let containsQuery = false;

        properties.forEach((property) => {
          if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
        return matches;
      });
      setRows(newRows);
    } else {
      setRows(banner);
    }
  };

  const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedId = rows.map((n) => n.id);
      setSelected(newSelectedId);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    if (event?.target.value) setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (selected.length === 0) {
      Swal.fire({
        title: 'โปรดเลือกรายการที่ต้องการลบก่อน!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'เข้าใจแล้ว'
      });
      return;
    }
    Swal.fire({
      title: 'ต้องการลบรายการ?',
      text: 'โปรดระวังการลบข้อมูลเป็นเรื่องที่ละเอียดอ่อน คุณไม่สามารถกู้ข้อมูลที่ลบไปแล้วได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบทันที!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const header = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
          axiosServices.post(`/api/banner/delete`, { ids: selected }, header).then((response: any) => {
            if (response.data) {
              Swal.fire({
                title: 'คุณทำรายการสำเร็จ',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'รับทราบ!'
              });
            }
          });
          setTimeout(() => {
            dispatch(getBannerList());
          }, 1000);
          setSelected([]);
        } catch (error: any) {
          setErrorMessage(error.message);
          Swal.fire({
            title: 'เกิดข้อผิดพลาดในการลบรายการนี้!',
            text: errorMessage,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'รับทราบ!'
          });
        }
      } else {
        Swal.fire({
          title: 'การลบรายการถูกยกเลิก',
          text: '',
          icon: 'error',
          confirmButtonText: 'รับทราบ'
        });
      }
    });
  };

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    dispatch(
      openSnackbar({
        open: true,
        message: 'คัดลอกลิงก์สำเร็จ',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  // modal change position

  const handleResponsePositionModal = (response: boolean) => {
    if (response) {
      setOpenChangePositionModal(false);
      setOpenSuccessDialog(true);
      dispatch(getBannerList());
    } else {
      setOpenErrorDialog(true);
    }
  };

  // modal filter status

  const handleResponseFilterStatus = (status: string) => {
    setFilterStatus(status);
    console.log(filterStatus);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <SuccessDialog open={openSuccessDialog} handleClose={() => setOpenSuccessDialog(false)} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              onChange={handleSearch}
              placeholder="ค้นหารายการ"
              value={search}
              size="medium"
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <Tooltip title="ลบ">
              <IconButton size="large">
                <DeleteIcon
                  onClick={(e: any) => {
                    handleDelete(e);
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="ตัวกรอง" sx={{ display: 'none' }}>
              <IconButton size="large" onClick={() => setOpenFilterStatus(true)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            {/* product add & dialog */}
            <Link href={'/admin/banners/create'}>
              <Tooltip title="เพิ่มข้อมูล">
                <Fab color="primary" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}>
                  <AddIcon fontSize="small" />
                </Fab>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>
      </CardContent>

      {/* table */}
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            theme={theme}
            selected={selected}
          />
          <TableBody>
            {Array.isArray(rows) &&
              stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  /** Make sure no display bugs if row isn't an OrderData object */
                  if (typeof row === 'number') return null;

                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={index} selected={isItemSelected}>
                      <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.id)}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        onClick={(event) => handleClick(event, row.name)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                          {' '}
                          #{row.id}{' '}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{row.position}</TableCell>

                      <TableCell align="center">
                        <Avatar src={`${baseUrl}${row.image}`} size="md" variant="rounded" alt="product images" />
                      </TableCell>

                      <TableCell align="left">{row.name}</TableCell>

                      {/* <TableCell align="left">{row.link}</TableCell> */}

                      <TableCell align="right">{format(new Date(row.updatedAt), 'E, MMM d yyyy')}</TableCell>
                      <TableCell align="center">{row.createdBy?.username}</TableCell>

                      <TableCell align="center">
                        {row.status === `ACTIVE` && <Chip label="เปิดการใช้งาน" size="small" chipcolor="success" />}
                        {row.status === `INACTIVE` && <Chip label="ปิดการใช้งาน" size="small" chipcolor="orange" />}
                        {row.status === null && <Chip label="ยังไม่ได้ตั้งค่า" size="small" chipcolor="error" />}
                      </TableCell>
                      <TableCell align="center" sx={{ pr: 3 }}>
                        <Grid container justifyContent="center">
                          <Grid item xs={12} sm={3}>
                            <Link href={`/admin/banners/edit/${row.id}`}>
                              <Tooltip title="แก้ไขข้อมูล">
                                <IconButton color="secondary" size="large">
                                  <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Tooltip title="จัดการตำแหน่ง">
                              <IconButton
                                color="secondary"
                                size="large"
                                onClick={(event: any) => {
                                  setOpenChangePositionModal(true);
                                  setSelectedTitle(row.name);
                                  setSelectedId(parseInt(row.id));
                                  setSelectedPosition(row.position.toString());
                                }}
                              >
                                <ControlCameraIcon sx={{ fontSize: '1.3rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Tooltip title="คัดลอกลิงก์">
                              <IconButton color="secondary" size="large" onClick={() => copyToClipboard(row.link)}>
                                <LinkIcon sx={{ fontSize: '1.3rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                        <ModalChangePosition
                          isOpen={openChangePositionModal}
                          isClose={() => setOpenChangePositionModal(false)}
                          onSave={handleResponsePositionModal}
                          primaryId={selectedId}
                          position={selectedPosition}
                          title={selectedTitle}
                          type={'banner'}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* modal */}
      <ModalFilterStatus isOpen={openFilterStatus} isClose={() => setOpenFilterStatus(false)} onSave={handleResponseFilterStatus} />

      {/* table pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default BannerTable;
