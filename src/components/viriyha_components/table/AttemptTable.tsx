import * as React from 'react';
import { format } from 'date-fns';
// excel
import * as XLSX from 'xlsx';
// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
  Box,
  CardContent,
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
import Chip from 'ui-component/extended/Chip';

// project imports

import { useDispatch, useSelector } from 'store';
import { getAttemptTransaction } from 'store/slices/viriyha/attempt';
// assets
// import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import IosShareIcon from '@mui/icons-material/IosShare';

import SearchIcon from '@mui/icons-material/Search';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';
import { AttemptTransactionType } from 'types/viriyha_type/attempt';

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

function stableSort(array: AttemptTransactionType[], comparator: (a: AttemptTransactionType, b: AttemptTransactionType) => number) {
  const stabilizedThis = array?.map((el: AttemptTransactionType, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as AttemptTransactionType, b[0] as AttemptTransactionType);
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
    label: 'โค้ด',
    align: 'center'
  },
  {
    id: 'campaign_name',
    numeric: false,
    label: 'แคมเปญ',
    align: 'left'
  },
  {
    id: 'place',
    numeric: false,
    label: 'ข้อความ',
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
    label: 'เหตุการณ์เกิดขึ้นเมื่อวันที่',
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
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER LIST ||============================== //

const AttemptTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [countSearch, setCountSearch] = React.useState<number>(0);
  const [rows, setRows] = React.useState<AttemptTransactionType[]>([]);
  const { attempt_transaction } = useSelector((state) => state.attempt_transaction);

  React.useEffect(() => {
    dispatch(getAttemptTransaction());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(attempt_transaction);
  }, [attempt_transaction]);
  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    const newString = event?.target.value ?? '';
    setSearch(newString);
    if (newString) {
      const newRows = rows.filter((row: KeyedObject) => {
        const campaignName = row.Campaign?.name?.toString().toLowerCase() || '';
        return campaignName.includes(newString.toLowerCase());
      });
      setRows(newRows);
      setCountSearch(newRows.length);
    } else {
      setRows(attempt_transaction);
      setCountSearch(attempt_transaction.length);
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

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    if (event?.target.value) setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const formatId = (id: number): string => {
    const formattedId = id.toString().padStart(4, '0');
    return `AT-${formattedId}`;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([], {
      header: ['ลำดับ', 'แคมเปญ', 'ข้อความ', 'สถานะ', 'เหตุการณ์เกิดขึ้นเมื่อวันที่'],
      skipHeader: false
    });

    XLSX.utils.sheet_add_json(
      ws,
      rows.map((item, index) => ({
        ลำดับ: index + 1,
        แคมเปญ: item.Campaign.name,
        ข้อความ: item.message,
        สถานะ: 'ล้มเหลว',
        เหตุการณ์เกิดขึ้นเมื่อวันที่: format(new Date(item.createdAt), 'd MMM yyyy')
      })),
      { origin: -1, skipHeader: true }
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AttemptTransactionData');
    const fileName = `AttemptTransactionData_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
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
            <Tooltip title="ส่งออกเอกสาร">
              <IconButton size="large" onClick={exportToExcel}>
                <IosShareIcon />
              </IconButton>
            </Tooltip>
            <Chip label={`รายการที่ล้มเหลวทั้งหมด : ${countSearch}`} size="medium" chipcolor="error" />
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

                  return (
                    <TableRow hover aria-checked={isItemSelected} tabIndex={-1} key={index} selected={isItemSelected}>
                      <TableCell align="center">
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                          {' '}
                          {formatId(row.id)}{' '}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">{row.Campaign.name}</TableCell>
                      <TableCell align="center">{row.message}</TableCell>
                      <TableCell align="center">
                        {' '}
                        <Chip label="ล้มเหลว" size="small" chipcolor="orange" />{' '}
                      </TableCell>

                      <TableCell align="right">{format(new Date(row.createdAt), 'E, MMM d yyyy')}</TableCell>
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

export default AttemptTable;
