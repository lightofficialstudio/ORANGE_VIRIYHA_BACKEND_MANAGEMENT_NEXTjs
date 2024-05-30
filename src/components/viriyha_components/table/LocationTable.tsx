import * as React from 'react';
import { format } from 'date-fns';
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
  Typography,
  Autocomplete,
  Chip,
  Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// components
import InputLabel from 'ui-component/extended/Form/InputLabel';
import ErrorDialog from '../modal/status/ErrorDialog';

// project imports
import { useDispatch, useSelector } from 'store';
import { getLocationTransaction } from 'store/slices/viriyha/location';
// assets
import SearchIcon from '@mui/icons-material/Search';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';
import { LocationTransactionType } from 'types/viriyha_type/location';
import IosShareIcon from '@mui/icons-material/IosShare';
import axiosServices from 'utils/axios';
// types
import { CampaignType } from 'types/viriyha_type/campaign';

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

function stableSort(array: LocationTransactionType[], comparator: (a: LocationTransactionType, b: LocationTransactionType) => number) {
  const stabilizedThis = array?.map((el: LocationTransactionType, index: number) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0] as LocationTransactionType, b[0] as LocationTransactionType);
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
    id: 'code_used',
    numeric: false,
    label: 'โค้ดที่ถูกใช้งาน',
    align: 'left'
  },
  {
    id: 'latitude',
    numeric: false,
    label: 'ละติจูด',
    align: 'center'
  },
  {
    id: 'longitude',
    numeric: false,
    label: 'ลองจิจูด',
    align: 'center'
  },
  {
    id: 'location_name',
    numeric: false,
    label: 'สถานที่กดรับสิทธิ์',
    align: 'center'
  },
  {
    id: 'createdAt',
    numeric: true,
    label: 'รับสิทธิ์เมื่อวันที่',
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
type searchType = {
  id: string;
  name: string;
};
const searchByOptions: searchType[] = [
  {
    id: 'used_code',
    name: 'โค้ดที่ใช้งาน'
  }
];
const LocationTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  // const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<LocationTransactionType[]>([]);
  const { location_transaction } = useSelector((state) => state.location_transaction);
  // variable
  const [conditionSearch, setConditionSearch] = React.useState<boolean>(false);
  const [searchBy, setSearchBy] = React.useState<string>('โค้ดที่ใช้งาน');
  // const [searchById, setSearchById] = React.useState<string>('');
  const [campaignOption, setCampaignOption] = React.useState<CampaignType[]>([]);
  const [startDate, setStartDate] = React.useState<string>();
  const [endDate, setEndDate] = React.useState<string>();
  const [campaignId, setCampaignId] = React.useState<number>();
  // condition
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // temp data
  const [tempData, setTempData] = React.useState<LocationTransactionType[]>([]);
  const [highestUsageProvince, setHighestUsageProvince] = React.useState<string>('');
  const [lowestUsageProvince, setLowestUsageProvince] = React.useState<string>('');
  React.useEffect(() => {
    dispatch(getLocationTransaction());
  }, [dispatch]);

  // ให้แสดงตัวเลือก แคมเปญ
  React.useEffect(() => {
    const campaignOption: any[] = location_transaction.map((campaign: any) => ({
      id: campaign.id,
      name: campaign.name_called ?? 'โปรดระบุชื่อแคมเปญ'
    }));
    setCampaignOption(campaignOption);
  }, [location_transaction]);

  // ค้นหาจังหวัดที่มีการใช้งานสูงสุด และ ต่ำสุด
  React.useEffect(() => {
    if (rows.length > 0) {
      const placeCounts: Record<string, number> = {};
      rows.forEach((row) => {
        const placeName = row.location_name;
        if (placeName) {
          if (!placeCounts[placeName]) {
            placeCounts[placeName] = 0;
          }
          placeCounts[placeName]++;
        }
      });
      const sortedPlaces = Object.entries(placeCounts).sort((a, b) => b[1] - a[1]);
      setHighestUsageProvince(sortedPlaces[0]?.[0] || '');
      setLowestUsageProvince(sortedPlaces[sortedPlaces.length - 1]?.[0] || '');
    }
  }, [rows]);

  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    const newString = event?.target.value;
    // setSearch(newString || '');

    if (newString) {
      const newRows = rows.filter((row: KeyedObject) => {
        let matches = true;

        const properties = ['used_code'];
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
      setRows(tempData);
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
    return `L-${formattedId}`;
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([], {
      header: ['ลำดับ', 'โค้ด', 'โค้ดที่ถูกใช้งาน', 'ละติจูด', 'ลองจิจูด', 'สถานที่กดรับสิทธิ์', 'รับสิทธิ์เมื่อวันที่'],
      skipHeader: false
    });

    XLSX.utils.sheet_add_json(
      ws,
      rows.map((item, index) => ({
        ลำดับ: index + 1,
        โค้ด: formatId(item.id),
        โค้ดที่ถูกใช้งาน: item.code.code,
        ละติจูด: item.latitude,
        ลองจิจูด: item.longitude,
        สถานที่กดรับสิทธิ์: '-',
        รับสิทธิ์เมื่อวันที่: format(new Date(item.usedAt), 'dd MMM yyyy')
      })),
      { origin: -1, skipHeader: true }
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LocationTransactionData');
    const fileName = `LocationTransactionData_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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

    const response = await axiosServices.post('api/location_transaction/search', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const data = response.data;
      const campaign = data.Campaign_Code.flatMap((code: any) =>
        code.Campaign_Transaction.flatMap((transaction: any) => ({
          id: transaction.id,
          used_code: transaction?.code?.code,
          latitude: transaction?.latitude,
          longitude: transaction?.longitude,
          location_name: transaction.place_id ? transaction.place.name : 'ไม่ทราบ',
          usedAt: transaction.usedAt
        }))
      );
      console.log(campaign);
      setRows(campaign);

      setTempData(campaign);
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
                  // setSearchById(newValue?.id ?? '');
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
                getOptionLabel={(option: CampaignType) => option.name ?? ''} // Fix: Change the type of getOptionLabel prop
                onChange={(event, newValue) => {
                  setCampaignId(newValue?.id);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', alignItems: 'center' }}></Grid>
          </Grid>

          <Grid item xs={6} md={4} sx={{ textAlign: 'right', alignItems: 'center' }}>
            {' '}
            <Chip
              label={`ค้นหารายการรับสิทธิ์เจอทั้งหมด : ${rows.length} รายการ`}
              color="primary"
              sx={{ marginBottom: '5px', display: rows.length > 0 ? '' : 'none' }}
            />
            <Chip
              label={`จังหวัดที่มีการใช้งานสูงสุด : ${highestUsageProvince}`}
              color="success"
              sx={{ marginBottom: '5px', display: rows.length > 0 ? '' : 'none' }}
            />
            <Chip
              label={`จังหวัดที่มีการใช้งานต่ำสุด : ${lowestUsageProvince}`}
              color="error"
              sx={{ display: rows.length > 0 ? '' : 'none' }}
            />
          </Grid>

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

                      <TableCell align="center">{row?.used_code}</TableCell>
                      <TableCell align="center">{row?.latitude}</TableCell>
                      <TableCell align="center">{row?.longitude}</TableCell>
                      <TableCell align="left">{row?.location_name}</TableCell>
                      <TableCell align="right">{row.usedAt ? format(new Date(row?.usedAt), 'dd/M/yyyy') : ''}</TableCell>

                      {/* <TableCell align="right">{format(new Date(row.usedAt), 'E, MMM d yyyy')}</TableCell> */}
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

export default LocationTable;
