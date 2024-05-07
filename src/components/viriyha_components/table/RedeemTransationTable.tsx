import * as React from 'react';
// import { format } from 'date-fns';
// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
  IconButton,
  Box,
  CardContent,
  Grid,
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
  Typography,
  Tooltip
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import * as XLSX from 'xlsx';

// project imports
import { useDispatch, useSelector } from 'store';
// project data
import { CampaignType } from 'types/viriyha_type/campaign';
import { getCampaignTransaction } from 'store/slices/viriyha/campaign';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';

// assets

// icon
import SearchIcon from '@mui/icons-material/Search';
import IosShareIcon from '@mui/icons-material/IosShare';

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
    label: 'โค้ด',
    align: 'left'
  },
  {
    id: 'id_card',
    numeric: false,
    label: 'รหัสบัตรประชาชนผู้ใช้งาน',
    align: 'left'
  },
  {
    id: 'name',
    numeric: false,
    label: 'ชื่อ',
    align: 'left'
  },
  {
    id: 'surname',
    numeric: false,
    label: 'นามสกุล',
    align: 'left'
  },
  {
    id: 'code',
    numeric: false,
    label: 'โค้ดที่ใช้งาน',
    align: 'left'
  },
  {
    id: 'usedAt',
    numeric: false,
    label: 'ใช้งานเมื่อวันที่',
    align: 'left'
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
        {/* {numSelected <= 0 && (
          <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
              จัดการ
            </Typography>
          </TableCell>
        )} */}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER LIST ||============================== //

const RedeemTransactionTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<CampaignType[]>([]);
  const { campaign } = useSelector((state) => state.campaign);

  React.useEffect(() => {
    dispatch(getCampaignTransaction());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(campaign);
  }, [campaign]);
  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    const newString = event?.target.value ?? '';
    setSearch(newString);
    if (newString) {
      const newRows = rows.filter((row: KeyedObject) => {
        const code = row.Campaign_Code[0]?.code?.toString().toLowerCase() || '';
        return code.includes(newString.toLowerCase());
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
    if (!id) return 'N/A';
    const formattedId = id.toString().padStart(4, '0');
    return `T-${formattedId}`;
  };

  const censorIdCard = (idCard: string) => {
    if (idCard && idCard.length > 5) {
      return `${idCard.substring(0, idCard.length - 5)}xxxxx`;
    }
    return idCard;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([], {
      header: ['ลำดับ', 'โค้ด', 'รหัสบัตรประชาชนผู้ใช้งาน', 'ชื่อ', 'นามสกุล', 'โค้ดที่ใช้งาน', 'ใช้งานเมื่อวันที่'],
      skipHeader: false
    });

    XLSX.utils.sheet_add_json(
      ws,
      rows.map((item, index) => ({
        ลำดับ: index + 1,
        โค้ด: formatId(item.Campaign_Code[0]?.id),
        รหัสบัตรประชาชนผู้ใช้งาน: censorIdCard(item.Campaign_Code[0]?.Campaign_Transaction[0]?.id_card),
        ชื่อ: item.Campaign_Code[0]?.Campaign_Transaction[0]?.name,
        นามสกุล: item.Campaign_Code[0]?.Campaign_Transaction[0]?.surname,
        โค้ดที่ใช้งาน: item.Campaign_Code[0]?.code,
        ใช้งานเมื่อวันที่: item.Campaign_Code[0]?.Campaign_Transaction[0]?.usedAt
      })),
      { origin: -1, skipHeader: true }
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RedeemTransaction');
    const fileName = `RedeemTransactionData_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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
              placeholder="ค้นหาโค้ดที่ถูกงานใช้งาน"
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
            {/* <Tooltip title="ตัวกรอง">
              <IconButton size="large">
                <FilterListIcon />
              </IconButton>
            </Tooltip> */}
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
                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={index} selected={isItemSelected}>
                      <TableCell align="left">{formatId(row.Campaign_Code[0]?.id)}</TableCell>
                      <TableCell align="left">{censorIdCard(row.Campaign_Code[0]?.Campaign_Transaction[0]?.id_card)}</TableCell>
                      <TableCell align="left">{row.Campaign_Code[0]?.Campaign_Transaction[0]?.name}</TableCell>
                      <TableCell align="left">{row.Campaign_Code[0]?.Campaign_Transaction[0]?.surname}</TableCell>
                      <TableCell align="left">{row.Campaign_Code[0]?.code}</TableCell>
                      <TableCell align="left"> {row.Campaign_Code[0]?.Campaign_Transaction[0]?.usedAt}</TableCell>
                      {/* format(new Date(row.Campaign_Code[0].Campaign_Transaction[0]?.usedAt), 'dd/MM/yyyy')} */}
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

export default RedeemTransactionTable;
