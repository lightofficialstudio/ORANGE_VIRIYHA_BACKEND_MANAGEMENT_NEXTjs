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
  Tooltip,
  Autocomplete,
  Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import * as XLSX from 'xlsx';

// project imports
import { useSelector } from 'store';
// project data
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';

// assets

// icon
import SearchIcon from '@mui/icons-material/Search';
import IosShareIcon from '@mui/icons-material/IosShare';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import axiosServices from 'utils/axios';
import ErrorDialog from '../modal/status/ErrorDialog';
import Chip from 'ui-component/extended/Chip';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

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

function stableSort(array: any[], comparator: (a: any, b: any) => number) {
  const stabilizedThis = array?.map((el: any, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as any, b[0] as any);
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

// option
type searchType = {
  id: string;
  name: string;
};

const searchByOptions: searchType[] = [
  {
    id: 'name',
    name: 'ชื่อ'
  },
  {
    id: 'surname',
    name: 'นามสกุล'
  },
  {
    id: 'used_code',
    name: 'โค้ดที่ใช้งาน'
  }
];

const RedeemTransactionTable = () => {
  const theme = useTheme();
  // const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<any[]>([]);
  const { campaign } = useSelector((state) => state.campaign);
  // variable
  const [campaignOption, setCampaignOption] = React.useState<any[]>([]);
  const [campaignId, setCampaignId] = React.useState<number>();
  const [searchBy, setSearchBy] = React.useState<string>('โค้ดที่ใช้งาน');
  const [searchById, setSearchById] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>();
  const [endDate, setEndDate] = React.useState<string>();
  const [conditionSearch, setConditionSearch] = React.useState<boolean>(false);
  // condition
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // data
  const [searchData, setSearchData] = React.useState<any[]>([]);

  // React.useEffect(() => {
  //   dispatch(getCampaignTransaction());
  // }, [dispatch]);
  React.useEffect(() => {
    setRows(searchData);
  }, [searchData]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosServices.get('/api/campaign/transaction/campaign');
        const campaignArray: any[] = [];
        response.data.forEach((element: any) => {
          campaignArray.push({
            id: element.id,
            name: element.name
          });
        });
        setCampaignOption(campaignArray);

        console.log('campaignArray', campaignArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    const newString = event?.target.value.trim().toLowerCase(); // Trim and convert to lower case once.
    setSearch(newString || '');

    if (!newString) {
      console.log(search);
      setRows(campaign);
      return;
    }

    const newRows = rows.filter((row: KeyedObject) => {
      if (searchById === 'used_code') {
        // Search for matching code across all Campaign_Code entries in this row.
        return row.Campaign_Code.some((code: any) => code.code?.toString().toLowerCase().includes(newString));
      } else if (searchById === 'name' || searchById === 'surname') {
        // Search for matching name or surname across all transactions in all Campaign_Code entries.
        return row.Campaign_Code.some((code: any) =>
          code.Campaign_Transaction.some((transaction: any) => transaction[searchById]?.toLowerCase().includes(newString))
        );
      }
      return false;
    });

    setRows(newRows); // Update the state to reflect the filtered data.
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

  const handleSubmit = async () => {
    if (!campaignId) {
      setErrorMessage('กรุณาเลือกแคมเปญ');
      setOpenErrorDialog(true);
    } else if (!startDate || !endDate) {
      setErrorMessage('กรุณากรอกวันที่เริ่มต้นและสิ้นสุด');
      setOpenErrorDialog(true);
    }
    const formData = new FormData();

    formData.append('startDate', startDate?.toString() ?? '');
    formData.append('endDate', endDate?.toString() ?? '');
    formData.append('campaignId', String(campaignId));

    const response = await axiosServices.post('api/campaign/transaction/search', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      setSearchData(
        response.data.flatMap((data: any) =>
          data.Campaign_Code.flatMap((campaign_code: any) =>
            campaign_code.Campaign_Transaction.map((transaction: any) => {
              return {
                id: transaction.id,
                id_card: transaction.id_card,
                name: transaction.name,
                surname: transaction.surname,
                code: campaign_code.code,
                usedAt: transaction.usedAt
              };
            })
          )
        )
      );
      setConditionSearch(true);
      if (response.data.length === 0) {
        setErrorMessage('ไม่พบข้อมูล');
        setOpenErrorDialog(true);
        setConditionSearch(false);
      }
    }
  };

  return (
    <>
      <CardContent>
        <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />

        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8} container spacing={2} sx={conditionSearch ? { display: '' } : { display: 'none' }}>
            <Grid item xs={4}>
              <Autocomplete
                id="combo-box-demo"
                options={searchByOptions}
                getOptionLabel={(option) => option.name}
                value={searchByOptions.find((option) => option.name === searchBy)}
                onChange={(event, newValue) => {
                  setSearchBy(newValue?.name ?? '');
                  setSearchById(newValue?.id ?? '');
                }}
                renderInput={(params) => <TextField {...params} label="ค้นหาโดย" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearch}
                placeholder={`ค้นหารายการโดย ${searchBy}`}
                size="medium"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8} container spacing={2}>
            <Grid item xs={6}>
              <InputLabel>แคมเปญ</InputLabel>
              <Autocomplete
                disablePortal
                options={campaignOption}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setCampaignId(newValue?.id);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', alignItems: 'center' }}></Grid>
          </Grid>
          <Chip label={`ประวัติการใช้งานสิทธิ์ทั้งหมด : ${rows.length} รายการ`} color="primary" />

          <Grid item xs={12} sm={8} container spacing={2}>
            <Grid item xs={6}>
              <InputLabel>วันที่เริ่มต้น</InputLabel>
              <TextField
                fullWidth
                type="date"
                value={startDate}
                size="medium"
                variant="outlined"
                onChange={(event: any) => {
                  setStartDate(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>วันที่สิ้นสุด</InputLabel>
              <TextField
                fullWidth
                type="date"
                value={endDate}
                size="medium"
                variant="outlined"
                onChange={(event: any) => {
                  const newEndDate = event.target.value;
                  if (newEndDate <= (startDate ?? '')) {
                    setEndDate('');
                    setErrorMessage('วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด');
                    setOpenErrorDialog(true);
                  } else {
                    setEndDate(newEndDate);
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8} container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                onClick={handleSubmit}
                variant="contained"
                type="button"
                component="button"
                sx={{
                  background: theme.palette.dark.main,
                  '&:hover': { background: theme.palette.success.dark }
                }}
              >
                ค้นหา
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
            <Tooltip title="ส่งออกเอกสาร">
              <IconButton size="large" onClick={exportToExcel}>
                <IosShareIcon />
              </IconButton>
            </Tooltip>
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
                  // Check if row is an expected object
                  if (typeof row !== 'object') return null;
                  const isItemSelected = isSelected(row.id);
                  // Logic and JSX for TableRow
                  return (
                    <TableRow hover aria-checked={isItemSelected} tabIndex={-1} key={index} selected={isItemSelected}>
                      <TableCell align="left">{formatId(row.id)}</TableCell>
                      <TableCell align="left">{censorIdCard(row.id_card)}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.surname}</TableCell>
                      <TableCell align="left">{row.code}</TableCell>
                      <TableCell align="left">{row.usedAt}</TableCell>
                    </TableRow>
                  );
                })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
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
