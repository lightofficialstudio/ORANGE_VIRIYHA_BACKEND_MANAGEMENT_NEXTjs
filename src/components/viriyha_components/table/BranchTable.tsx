import * as React from 'react';
import { format } from 'date-fns';
import JWTContext from 'contexts/JWTContext';

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
import { BranchType } from 'types/viriyha_type/branch';
import { getBranchFromShopBy } from 'store/slices/viriyha/branch';
// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import IosShareIcon from '@mui/icons-material/IosShare';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';
import AddIcon from '@mui/icons-material/AddTwoTone';
import Link from 'next/link';
// excel
import * as XLSX from 'xlsx';
import axiosServices from 'utils/axios';
// dialog
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import DeleteDialog from 'components/viriyha_components/modal/status/DeleteDialog';
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

function stableSort(array: BranchType[], comparator: (a: BranchType, b: BranchType) => number) {
  const stabilizedThis = array?.map((el: BranchType, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as BranchType, b[0] as BranchType);
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
    label: 'ชื่อสาขา',
    align: 'left'
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
  },
  {
    id: 'createdAt',
    numeric: true,
    label: 'สร้างเมื่อวันที่',
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
type BranchListTableProps = { shopId: string };
const BranchListTable = ({ shopId }: BranchListTableProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const context = React.useContext(JWTContext);
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('position');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<BranchType[]>([]);
  const { branch } = useSelector((state) => state.branch);
  const paramShopId = parseInt(shopId);
  // import varaible
  const [branchExcelFile, setBranchExcelFile] = React.useState<File | null>(null);
  const [branchExcelData, setBranchExcelData] = React.useState<BranchType[]>([]);
  const createdById = context?.user?.id;
  // condition
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  React.useEffect(() => {
    dispatch(getBranchFromShopBy(paramShopId));
  }, [dispatch, paramShopId]);
  React.useEffect(() => {
    setRows(branch);
  }, [branch]);
  React.useEffect(() => {
    if (branchExcelData.length > 0) {
      handleSubmitExcelFileBranch(branchExcelData);
    }
  });
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
      setRows(branch);
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

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // function : import
  const handleExcelFileBranchClick = () => {
    document.getElementById('excelFile')?.click();
  };

  const handleExcelFileBranchChange = (event: any) => {
    const file = event.target.files;
    if (file) {
      setBranchExcelFile(file[0]);
      console.log(branchExcelFile);
      handleExcelFileBranchUpload(file[0]);
      event.target.value = null;
    }
  };

  const handleExcelFileBranchUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const dataParse = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const arrayBranch: BranchType[] = dataParse.map((item: any) => ({
        id: item[0],
        name: item[1],
        latitude: item[2],
        longitude: item[3],
        status: 'ACTIVE'
      }));
      setBranchExcelData(arrayBranch);
      console.log(branchExcelData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmitExcelFileBranch = async (branchExcelData: BranchType[]) => {
    const data = {
      shop_id: paramShopId,
      createdById: createdById,
      branch: branchExcelData
    };

    try {
      const response = await axiosServices.post(`/api/shop/import/branch/${shopId}`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        dispatch(getBranchFromShopBy(paramShopId));
        setOpenSuccessDialog(true);
        if (response.data.branch) {
          // สร้างข้อความ HTML จากอาร์เรย์ของข้อความ
          const htmlMessage = response.data.branch.map((branchMsg: string) => `${branchMsg}<br>`).join('');
          setSuccessMessage(htmlMessage);
        } else {
          setSuccessMessage('ดำเนินการเสร็จสิ้น!');
        }
      } else {
        setOpenErrorDialog(true);
        setErrorMessage(response.statusText);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    }
  };

  const handleDelete = async () => {
    setOpenDeleteDialog(true);
  };

  return (
    <>
      <SuccessDialog open={openSuccessDialog} handleClose={() => setOpenSuccessDialog(false)} message={successMessage} />
      <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        message={`คุณต้องการลบรายการที่เลือกไว้หรือไม่? `}
        id={selected}
        link={'/api/branch/delete'}
        status={(statusDelete) => {
          if (statusDelete) {
            dispatch(getBranchFromShopBy(paramShopId));
          }
        }}
      />
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
            <Tooltip title="นำเข้าเอกสาร">
              <IconButton size="large" onClick={handleExcelFileBranchClick}>
                <FileOpenIcon />
                <input type="file" id="excelFile" style={{ display: 'none' }} onChange={handleExcelFileBranchChange} />
              </IconButton>
            </Tooltip>
            <Tooltip title="ส่งออกเอกสาร">
              <IconButton size="large">
                <IosShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="ตัวกรอง">
              <IconButton size="large">
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            {/* product add & dialog */}
            <Link href={`/admin/shop/detail/create_branch/${shopId}`}>
              <Tooltip title="เพิ่มสาขา">
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
                        onClick={(event) => handleClick(event, row.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                          {' '}
                          #{row.id}{' '}
                        </Typography>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        onClick={(event) => handleClick(event, row.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                          {' '}
                          {row.name}{' '}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{row.createdBy?.username}</TableCell>
                      <TableCell align="center">
                        {row.status === `ACTIVE` && <Chip label="เปิดการใช้งาน" size="small" chipcolor="success" />}
                        {row.status === `INACTIVE` && <Chip label="ปิดการใช้งาน" size="small" chipcolor="orange" />}
                        {row.status === null && <Chip label="ยังไม่ได้ตั้งค่า" size="small" chipcolor="error" />}
                      </TableCell>
                      <TableCell align="right">{row.createdAt ? format(new Date(row.createdAt), 'E, MMM d yyyy') : ''}</TableCell>
                      <TableCell align="center" sx={{ pr: 3 }}>
                        <Link href={`/admin/shop/detail/edit_branch/${row.id}`}>
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

export default BranchListTable;
