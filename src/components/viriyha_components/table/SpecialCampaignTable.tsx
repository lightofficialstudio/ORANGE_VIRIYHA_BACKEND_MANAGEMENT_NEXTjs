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
import { visuallyHidden } from '@mui/utils';

// project imports
import Chip from 'ui-component/extended/Chip';
import { useDispatch, useSelector } from 'store';
// project data
import { CampaignType } from 'types/viriyha_type/campaign';
import { getCampaignList } from 'store/slices/viriyha/campaign_special';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
// icon
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/AddTwoTone';
import Link from 'next/link';
// services
import axiosServices from 'utils/axios';
import Swal from 'sweetalert2';

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

function stableSort(array: CampaignType[], comparator: (a: CampaignType, b: CampaignType) => number) {
  const stabilizedThis = array?.map((el: CampaignType, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as CampaignType, b[0] as CampaignType);
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
    label: 'Code',
    align: 'left'
  },
  {
    id: 'name',
    numeric: false,
    label: 'ชื่อสิทธิพิเศษ',
    align: 'left'
  },
  {
    id: 'shop_name',
    numeric: false,
    label: 'ร้านค้าที่เข้าร่วม',
    align: 'left'
  },
  {
    id: 'start_Date',
    numeric: false,
    label: 'วันที่เริ่มต้น',
    align: 'left'
  },
  {
    id: 'end_date',
    numeric: false,
    label: 'วันที่สิ้นสุด',
    align: 'left'
  },
  {
    id: 'quotaLeft',
    numeric: true,
    label: 'จำนวนสิทธิพิเศษ',
    align: 'center'
  },

  {
    id: 'status',
    numeric: false,
    label: 'สถานะ',
    align: 'center'
  },
  {
    id: 'updatedBy',
    numeric: true,
    label: 'ผู้ที่อัพเดทล่าสุด',
    align: 'right'
  },
  {
    id: 'createdAt',
    numeric: true,
    label: 'วันที่อัพเดทล่าสุด',
    align: 'right'
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
  </Toolbar>
);

// ==============================|| TABLE HEADER ||============================== //

interface OrderListEnhancedTableHeadProps extends EnhancedTableHeadProps {
  theme: Theme;
  selected: number[];
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

const SpecialCampaignTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('calories');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<CampaignType[]>([]);
  const { campaign } = useSelector((state) => state.special_campaign);

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    dispatch(getCampaignList());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(campaign);
  }, [campaign]);
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
      setRows(campaign);
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

  const handleClick = (event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

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

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // function
  const formatId = (id: number): string => {
    const formattedId = id.toString().padStart(4, '0');
    return `SMC-${formattedId}`;
  };

  // delete
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
          axiosServices.post(`/api/campaign/normal/delete`, { ids: selected }, header).then((response: any) => {
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
            dispatch(getCampaignList());
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

  return (
    <>
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
              <IconButton size="large" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="ตัวกรอง">
              <IconButton size="large">
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            {/* product add & dialog */}
            <Link href={'/campaign/special/create'}>
              <Tooltip title="เพิ่มสิทธิพิเศษ">
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
                      <TableCell align="left">{formatId(row.id)}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{String(row.Campaign_Shop[0].Shop.name)}</TableCell>
                      <TableCell align="left">{format(new Date(row.startDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell align="left">{format(new Date(row.endDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell align="center">
                        <Chip label={`${row.quantity - row.used_quantity}/${row.quantity}`} size="small" chipcolor="primary"></Chip>
                      </TableCell>
                      <TableCell align="right">
                        {row.status === `ACTIVE` && <Chip label="เปิดการใช้งาน" size="small" chipcolor="success" />}
                        {row.status === `INACTIVE` && <Chip label="ปิดการใช้งาน" size="small" chipcolor="orange" />}
                        {row.status === null && <Chip label="ยังไม่ได้ตั้งค่า" size="small" chipcolor="error" />}
                      </TableCell>
                      <TableCell align="right">{row.updatedBy?.name != null ? row.updatedBy?.name : row.createdBy?.name}</TableCell>

                      <TableCell align="right">{format(new Date(row.updatedAt), 'dd/MM/yyyy')}</TableCell>

                      <TableCell align="center" sx={{ pr: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <Link href={`/campaign/special/detail/${row.id}`}>
                              <Tooltip title="แก้ไขสิทธิพิเศษ">
                                <IconButton color="secondary" size="large">
                                  <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Link href={`/campaign/special/clone/${row.id}`}>
                              <Tooltip title="คัดลอกสิทธิพิเศษ">
                                <IconButton color="secondary" size="large">
                                  <ContentCopyIcon sx={{ fontSize: '1.3rem' }} />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Tooltip title="คัดลอกลิงก์">
                              <IconButton color="secondary" size="large">
                                <LinkIcon sx={{ fontSize: '1.3rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
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

export default SpecialCampaignTable;
