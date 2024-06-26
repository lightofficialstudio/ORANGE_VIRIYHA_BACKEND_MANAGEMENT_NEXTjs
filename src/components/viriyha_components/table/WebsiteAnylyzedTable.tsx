import * as React from 'react';
// import { format } from 'date-fns';
import * as XLSX from 'xlsx';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
  Autocomplete,
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

// project imports
import { useDispatch, useSelector } from 'store';
// project data
import { CampaignType } from 'types/viriyha_type/campaign';
import { getCampaignAll } from 'store/slices/viriyha/campaign';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';

// assets

// icon
import SearchIcon from '@mui/icons-material/Search';
import IosShareIcon from '@mui/icons-material/IosShare';
import InputLabel from 'ui-component/extended/Form/InputLabel';
const optionRank = [
  { id: 'All', name: 'ทั้งหมด' },
  { id: 'Top_View', name: 'อันดับยอดวิวรายครั้งสูงสุด' },
  { id: 'Bottom_View', name: 'อันดับยอดวิวรายครั้งต่ำสุด' },
  { id: 'Top_Unique_View', name: 'อันดับยอดวิวรายคนสูงสุด' },
  { id: 'Bottom_Unique_View', name: 'อันดับยอดวิวรายคนต่ำสุด' }
];
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
    label: 'รหัสรับสิทธิ์',
    align: 'left'
  },
  {
    id: 'brand',
    numeric: false,
    label: 'แบรนด์',
    align: 'left'
  },
  {
    id: 'name',
    numeric: false,
    label: 'แคมเปญ',
    align: 'left'
  },
  {
    id: 'shop_name',
    numeric: false,
    label: 'จำนวนครั้งที่เข้าชม (Total View)',
    align: 'left'
  },
  {
    id: 'start_Date',
    numeric: false,
    label: 'จำนวนคนที่เข้าชม (Unique View)',
    align: 'left'
  }

  // {
  //   id: 'status',
  //   numeric: false,
  //   label: 'สถานะ',
  //   align: 'center'
  // }
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

const WebsiteAnalyzedTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('calories');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<CampaignType[]>([]);
  const [rank, setRank] = React.useState<string>('All');

  const { campaign } = useSelector((state) => state.campaign);

  React.useEffect(() => {
    dispatch(getCampaignAll());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(campaign);
  }, [campaign]);
  React.useEffect(() => {
    handleSettingRank();
  }, [rank]);
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

  const handleSettingRank = () => {
    if (rank === 'All') {
      setRows(campaign);
    } else if (rank === 'Top_View') {
      setRows([...rows].sort((a, b) => b.view - a.view));
    } else if (rank === 'Bottom_View') {
      setRows([...rows].sort((a, b) => a.view - b.view));
    } else if (rank === 'Top_Unique_View') {
      setRows([...rows].sort((a, b) => b.unique_view - a.unique_view));
    } else if (rank === 'Bottom_Unique_View') {
      setRows([...rows].sort((a, b) => a.unique_view - b.unique_view));
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
    const formattedId = id.toString().padStart(4, '0');
    return `NMC-${formattedId}`;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([], {
      header: ['ลำดับ', 'รหัสรับสิทธิ์', 'สิทธิพิเศษ', 'จำนวนครั้งที่เข้าชม (Total View)', 'จำนวนคนที่เข้าชม (Unique View)'],
      skipHeader: false
    });

    XLSX.utils.sheet_add_json(
      ws,
      rows.map((item, index) => ({
        ลำดับ: index + 1,
        รหัสรับสิทธิ์: formatId(item.id),
        สิทธิพิเศษ: item.name,
        'จำนวนครั้งที่เข้าชม (Total View)': item.view,
        'จำนวนคนที่เข้าชม (Unique View)': item.unique_view
        // สถานะ: item.status === `ACTIVE` ? 'เปิดการใช้งาน' : item.status === `INACTIVE` ? 'ปิดการใช้งาน' : 'ยังไม่ได้ตั้งค่า'
      })),
      { origin: -1, skipHeader: true }
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'WebsiteAnalyzedData');
    const fileName = `WebsiteAnalyzedData_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2} marginBottom={3}>
          <Grid item xs={12} sm={4}>
            <InputLabel>ค้นหารายการ</InputLabel>

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
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8} container spacing={2}>
          <Grid item xs={6}>
            <InputLabel>แสดงอันดับสูงสุด</InputLabel>
            <Autocomplete
              fullWidth
              options={optionRank}
              getOptionLabel={(option) => option.name}
              value={optionRank.find((option) => option.id === rank) || optionRank[0]}
              onChange={(event, newValue: any) => {
                setRank(newValue?.id);
              }}
              renderInput={(params) => <TextField {...params} />}
            />{' '}
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
                      <TableCell align="left">{formatId(row.id)}</TableCell>
                      <TableCell align="left">
                        {row.Campaign_Shop.map((shop, index) => {
                          if (index < row.Campaign_Shop.length - 1) {
                            return shop.Shop.name + ', ';
                          } else {
                            return shop.Shop.name;
                          }
                        })}
                      </TableCell>
                      <TableCell align="left">{row.name_called}</TableCell>
                      <TableCell align="center">{row.view}</TableCell>
                      <TableCell align="center">{row.unique_view}</TableCell>
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

export default WebsiteAnalyzedTable;
