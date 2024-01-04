import * as React from 'react';
import { ReactElement } from 'react';
import Link from 'Link';

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
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import Page from 'components/ui-component/Page';
import Chip from 'ui-component/extended/Chip';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { TypeNormalCampaign } from 'types/viriyha_type/campaign';
import { useDispatch, useSelector } from 'store';
import { getOrders } from 'store/slices/customer';

// viriyha components imports
import DetailCampaignCard from 'components/viriyha_components/form/campaign/normal/detail/detail_campaign';
import ConditionCampaign from 'components/viriyha_components/form/campaign/normal/detail/condition_campaign';
import DescriptionCampaign from 'components/viriyha_components/form/campaign/normal/detail/description_campaign';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';

import SearchIcon from '@mui/icons-material/Search';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject, GetComparator, HeadCell, EnhancedTableToolbarProps } from 'types';
import AddIcon from '@mui/icons-material/AddTwoTone';
// types
import { TabsProps } from 'types';

// tabs
function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
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

function stableSort(array: TypeNormalCampaign[], comparator: (a: TypeNormalCampaign, b: TypeNormalCampaign) => number) {
  const stabilizedThis = array.map((el: TypeNormalCampaign, index: number) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0] as TypeNormalCampaign, b[0] as TypeNormalCampaign);
    if (order !== 0) return order;
    return (a[1] as number) - (b[1] as number);
  });
  return stabilizedThis.map((el) => el[0]);
}

// table header options

const headCells: HeadCell[] = [
  {
    id: 'id',
    numeric: true,
    label: 'ID',
    align: 'center'
  },
  {
    id: 'name',
    numeric: false,
    label: 'ชื่อ-นามสกุล',
    align: 'left'
  },
  {
    id: 'company',
    numeric: true,
    label: 'เบอร์โทร',
    align: 'left'
  },
  {
    id: 'type',
    numeric: true,
    label: 'Payment Type',
    align: 'left'
  },
  {
    id: 'qty',
    numeric: true,
    label: 'จำนวนผู้สนใจ',
    align: 'right'
  },
  {
    id: 'date',
    numeric: true,
    label: 'ใช้งานเมื่อวันที่',
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
            {/* <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
              Action
            </Typography> */}
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER LIST ||============================== //

const NormalCampaignPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<TypeNormalCampaign[]>([]);
  const { orders } = useSelector((state) => state.customer);
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(orders);
  }, [orders]);
  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    const newString = event?.target.value;
    setSearch(newString || '');

    if (newString) {
      const newRows = rows.filter((row: KeyedObject) => {
        let matches = true;

        const properties = ['name', 'company', 'type', 'qty', 'id'];
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
      setRows(orders);
    }
  };

  const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedId = rows.map((n) => n.name);
      setSelected(newSelectedId);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Page title="รายละเอียดสิทธิพิเศษ">
      <MainCard>
        <div>
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={handleChange}
            sx={{
              mb: 3,
              minHeight: 'auto',
              '& button': {
                minWidth: 100
              },
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900'
              },
              '& a.Mui-selected': {
                color: 'primary.main'
              }
            }}
            aria-label="simple tabs example"
            variant="scrollable"
          >
            <Tab component={Link} href="#" label="ข้อมูลสิทธิพิเศษ" {...a11yProps(0)} />
            <Tab component={Link} href="#" label="รายละเอียด" {...a11yProps(1)} />
            <Tab component={Link} href="#" label="เงื่อนไข" {...a11yProps(2)} />
            <Tab component={Link} href="#" label="จำกัดโควต้า" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <DetailCampaignCard />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DescriptionCampaign />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ConditionCampaign />
          </TabPanel>
          <TabPanel value={value} index={3}></TabPanel>
        </div>
      </MainCard>
      <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
        <MainCard title="ผู้ที่สามารถเข้าร่วมสิทธิพิเศษได้" content={false}>
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
                <Tooltip title="ลบผู้ใช้งานสิทธิ์">
                  <IconButton size="large">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="ตัวกรอง">
                  <IconButton size="large">
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
                {/* product add & dialog */}
                <Tooltip title="นำเข้าผู้ใช้งาน">
                  <IconButton size="large">
                    <AssignmentIndIcon />
                  </IconButton>
                </Tooltip>
                {/* product add & dialog */}
                <Tooltip title="เพิ่มผู้ใช้งานสิทธิ์">
                  <Fab color="primary" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}>
                    <AddIcon fontSize="small" />
                  </Fab>
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
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    /** Make sure no display bugs if row isn't an OrderData object */
                    if (typeof row === 'number') return null;

                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={index} selected={isItemSelected}>
                        <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.name)}>
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
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          onClick={(event) => handleClick(event, row.name)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                            {' '}
                            {row.name}{' '}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.company}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell align="center">
                          {row.status === 1 && <Chip label="ยังไม่ใช้งาน" size="small" chipcolor="success" />}
                          {row.status === 2 && <Chip label="ใช้งานสิทธิ์แล้ว" size="small" chipcolor="orange" />}
                          {/* {row.status === 3 && <Chip label="Processing" size="small" chipcolor="primary" />} */}
                        </TableCell>
                        {/* <TableCell align="center" sx={{ pr: 3 }}>
                        <IconButton color="primary" size="large">
                          <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </IconButton>
                        <IconButton color="secondary" size="large">
                          <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </IconButton>
                      </TableCell> */}
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
        </MainCard>
      </Grid>
    </Page>
  );
};

NormalCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NormalCampaignPage;
