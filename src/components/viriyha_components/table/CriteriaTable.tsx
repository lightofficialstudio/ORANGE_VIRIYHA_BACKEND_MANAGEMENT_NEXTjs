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
import { CriteriaType } from 'types/viriyha_type/criteria';
import { getCriteria } from 'store/slices/viriyha/criteria';
// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';

import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';
import AddIcon from '@mui/icons-material/AddTwoTone';
import Link from 'next/link';
import Swal from 'sweetalert2';
import axiosServices from 'utils/axios';

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

function stableSort(array: CriteriaType[], comparator: (a: CriteriaType, b: CriteriaType) => number) {
  const stabilizedThis = array?.map((el: CriteriaType, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as CriteriaType, b[0] as CriteriaType);
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
    id: 'name',
    numeric: false,
    label: 'ชื่อ Segment',
    align: 'left'
  },
  {
    id: 'status',
    numeric: false,
    label: 'สถานะ',
    align: 'center'
  },
  {
    id: 'createdBy',
    numeric: true,
    label: 'ผู้ที่สร้าง',
    align: 'center'
  },
  {
    id: 'updatedBy',
    numeric: true,
    label: 'ผู้ที่แก้ไขล่าสุด',
    align: 'center'
  },
  {
    id: 'updatedAt',
    numeric: true,
    label: 'วันที่แก้ไขล่าสุด',
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

const CriteriaTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<CriteriaType[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const { criteria } = useSelector((state) => state.criteria);
  //   const baseUrl = process.env.BACKEND_VIRIYHA_APP_API_URL + 'image/shop/';

  React.useEffect(() => {
    dispatch(getCriteria());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(criteria);
  }, [criteria]);
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
      setRows(criteria);
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
      console.log(newSelectedId);
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
    console.log(newSelected);

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
          axiosServices.post(`/api/criteria/delete`, { ids: selected }, header);
          Swal.fire('ลบรายการนี้เรียบร้อยแล้ว!', '', 'success');
          dispatch(getCriteria());
          setSelected([]);
        } catch (error: any) {
          setErrorMessage(error.message);
          Swal.fire({
            title: 'เกิดข้อผิดพลาดในการลบรายการนี้!',
            text: errorMessage,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'เข้าใจแล้ว'
          });
        }
      } else {
        Swal.fire('เกิดข้อผิดพลาดในการลบรายการนี้!', '', 'error');
      }
    });
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
              <IconButton size="large">
                <DeleteIcon
                  onClick={(e: any) => {
                    handleDelete(e);
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="ตัวกรอง">
              <IconButton size="large">
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            {/* product add & dialog */}
            <Link href={'/admin/criteria/create'}>
              <Tooltip title="เพิ่ม Criteria">
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
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                          {' '}
                          #{row.id}{' '}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="center">
                        {row.status === `ACTIVE` && <Chip label="เปิดการใช้งาน" size="small" chipcolor="success" />}
                        {row.status === `INACTIVE` && <Chip label="ปิดการใช้งาน" size="small" chipcolor="orange" />}
                        {row.status === null && <Chip label="ยังไม่ได้ตั้งค่า" size="small" chipcolor="error" />}
                      </TableCell>
                      <TableCell align="center">{row.createdBy.email}</TableCell>
                      <TableCell align="center">{row.updatedBy?.email}</TableCell>
                      <TableCell align="right">{format(new Date(row.updatedAt), 'E, MMM d yyyy')}</TableCell>
                      <TableCell align="center" sx={{ pr: 3 }}>
                        <Link href={`/admin/criteria/edit/${row.id}`}>
                          <IconButton color="secondary" size="large">
                            <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                          </IconButton>
                        </Link>
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

export default CriteriaTable;
