import React, { useState, ChangeEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';
import JWTContext from 'contexts/JWTContext';

// material-ui
import {
  Button,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  CardMedia,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  TablePagination,
  OutlinedInput,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import Chip from 'ui-component/extended/Chip';

// Dialog
import SuccessDialog from 'components/viriyha_components/modal/status/SuccessDialog';
import ErrorDialog from 'components/viriyha_components/modal/status/ErrorDialog';
// third-party
import InputLabel from 'ui-component/extended/Form/InputLabel';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
import 'react-quill/dist/quill.snow.css';
import axiosServices from 'utils/axios';
// types
import { CategoryType } from 'types/viriyha_type/category';
import { ShopManagementType } from 'types/viriyha_type/shop';
import { BranchType } from 'types/viriyha_type/branch';
import { CriteriaType } from 'types/viriyha_type/criteria';
import { SegmentType } from 'types/viriyha_type/segment';
// modal
import ModalEditQuota from '../ModalEditQuota';
import GoBackButton from 'components/viriyha_components/button/go_back';
import { CampaignDate } from 'types/viriyha_type/campaign';
// third-party - validation
import { useFormik } from 'formik';
import * as yup from 'yup';
// styles
const ImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '4px',
  cursor: 'pointer',
  width: 55,
  height: 55,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.background.default,
  '& > svg': {
    verticalAlign: 'sub',
    marginRight: 6
  }
}));
// styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}));

// constant
const quotaChoose = [
  { label: 'รายวัน', id: 1 },
  { label: 'รายสัปดาห์', id: 2 },
  { label: 'รายเดือน', id: 3 }
];

const maxQuotaPerPerson = [
  { label: 'คน/วัน', id: 1 },
  { label: 'คน/สัปดาห์', id: 2 },
  { label: 'คน/เดือน', id: 3 },
  { label: 'ไม่จำกัด', id: 4 }
];

const WebsiteTrafficPatternList = [
  { label: 'อัตโนมัติ', value: 'Auto' },
  { label: 'ปรับด้วยตัวเอง', value: 'Manual' }
];

// validation schema
const validationSchema = yup.object({
  Name: yup.string().required('กรุณาใส่ชื่อแบนเนอร์ให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  startDate: yup.date().required('กรุณาใส่วันที่เริ่มต้น หรือ กรอกให้ครบถ้วน'),
  endDate: yup.date().required('กรุณาใส่วันที่สิ้นสุด หรือ กรอกให้ครบถ้วน')
});

// interface
interface NormalCampaignFormProps {
  primaryId?: string;
  title?: string;
}

interface GenerateQuotaTableProps {
  id: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
}

const NormalCampaignForm = ({ primaryId, title }: NormalCampaignFormProps) => {
  const theme = useTheme();
  const context = React.useContext(JWTContext);
  // const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);
  // array
  const [ArrayCategory, setArrayCategory] = useState<CategoryType[]>([]);
  const [ArrayShop, setArrayShop] = useState<ShopManagementType[]>([]);
  const [ArrayBranchList, setArrayBranchList] = useState<any[]>([{ id: '0', name: 'Please select a branch' }]);
  const [ArrayCriteria, setArrayCriteria] = useState<CriteriaType[]>([]);
  const [ArraySegment, setArraySegment] = useState<SegmentType[]>([]);

  // variable
  const [ShopId, setShopId] = useState('');
  const [BranchCondition, setBranchCondition] = useState('include');
  const [BranchId, setBranchId] = useState<number[]>([]);
  const [Name, setName] = useState('');
  const [Category, setCategory] = useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>();
  const [Quantity, setQuantity] = useState<number>(0);
  const [CategoryQuantity, setCategoryQuantity] = useState<number>();
  const [QuotaLimit, setQuotaLimit] = useState('');
  const [CategoryQuotaLimit, setCategoryQuotaLimit] = useState<number>();
  const [WebsiteTrafficPattern, setWebsiteTrafficPattern] = useState<string>('Auto');
  const [WebsiteTrafficPatternValue, setWebsiteTrafficPatternValue] = useState<number>();
  const [Segment, setSegment] = useState<number[]>([]);
  const [Criteria, setCriteria] = useState<number[]>([]);
  const [Description, setDescription] = useState('');
  const [Condition, setCondition] = useState('');
  const [fileImage, setFileImage] = useState<File[]>([]);
  const createdById = context?.user?.id;
  // variable for update
  const [primaryShopId, setPrimaryShopId] = useState<number>();
  // validation
  const formik = useFormik({
    initialValues: {
      Name: Name,
      startDate: startDate,
      endDate: endDate
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      try {
      } catch (error: any) {}
    }
  });
  // const [Status, setStatus] = useState('');
  console.log(
    Description,
    Condition,
    Segment,
    Criteria,
    CategoryQuotaLimit,
    QuotaLimit,
    CategoryQuantity,
    Quantity,
    endDate,
    startDate,
    Category,
    Name,
    BranchId,
    ShopId
  );

  // condition
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // const imgUrl = process.env.BACKEND_VIRIYHA_APP_API_URL + 'image/banner';
  const [error, setError] = useState('');

  // generate table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [quotaRange, setQuotaRange] = useState<GenerateQuotaTableProps[]>([]);
  const [codeQuatity, setCodeQuatity] = useState<number>(0);
  const [tempQuotaId, setTempQuotaId] = useState(0);
  const [tempQuotaQuantity, setTempQuotaQuantity] = useState(0);

  // modal
  const [QuotaModal, setQuotaModal] = useState(false);

  // React.useEffect(() => {
  //   if (primaryId) {
  //     axiosServices.get(`/api/banner/${primaryId}`).then((response) => {
  //       console.log(response);
  //       setName(response.data.name);
  //       setPosition(response.data.position);
  //       setLinkNav(response.data.link);
  //       setStatus(response.data.status);
  //       SetPreviewImg(`${imgUrl}/${response.data.image}`);
  //     });
  //   }
  // }, [primaryId, imgUrl]);

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files && event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     const fileName = file.name;
  //     setImageFile(file);
  //     console.log(fileName);
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       if (e.target) {
  //         SetPreviewImg(e.target.result as string);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('shopId', ShopId);
    formData.append('type', 'normal');
    formData.append('branchId', BranchId.join(','));
    formData.append('branch_condition', BranchCondition);
    formData.append('name', Name);
    formData.append('category_type_id', Category);
    formData.append('startDate', startDate ? startDate.toString() : '');
    formData.append('endDate', endDate ? endDate.toString() : '');
    formData.append('quantity', String(Quantity));
    formData.append('quantity_category', String(CategoryQuantity));
    formData.append('quota_quantity_limit', QuotaLimit);
    formData.append('quota_limit_by', String(CategoryQuotaLimit));
    formData.append('segment', Segment.join(','));
    formData.append('criteria', Criteria.join(','));
    formData.append('description', Description);
    formData.append('condition', Condition);
    formData.append('status', 'ACTIVE');
    formData.append('createdById', createdById ?? '');
    quotaRange.forEach((item, index) => {
      formData.append('quotaRange', JSON.stringify(item));
    });
    fileImage.forEach((file: File) => {
      formData.append('campaignImage', file);
    });
    if (primaryId) {
      formData.append('updatedById', createdById ?? '');
      formData.append('primaryShopId', String(primaryShopId));
    }

    try {
      let response;
      if (primaryId) {
        response = await axiosServices.post(`/api/campaign/update/${primaryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosServices.post('/api/campaign/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      if (response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = '/campaign/normal/';
      } else {
        setOpenErrorDialog(true);
        setErrorMessage(response.statusText);
      }
    } catch (error: any) {
      setOpenErrorDialog(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const CategoryList = async () => {
      const response = await axiosServices.get('/api/category');
      try {
        const categoryArray: CategoryType[] = response.data.map((item: CategoryType) => ({
          id: item.id,
          name: item.name
        }));
        setArrayCategory(categoryArray);
        console.log(categoryArray);
      } catch (error) {
        console.log(error);
      }
    };

    const ShopList = async () => {
      const response = await axiosServices.get('/api/shop');
      try {
        const shopArray: ShopManagementType[] = response.data.map((item: ShopManagementType) => ({
          id: item.id,
          shopId: item.shopId,
          name: item.name
        }));
        setArrayShop(shopArray);
        console.log(shopArray);
      } catch (error) {
        console.log(error);
      }
    };

    const CriteriaList = async () => {
      const response = await axiosServices.get('/api/criteria');
      try {
        const criteriaArray: CriteriaType[] = response.data.map((item: CriteriaType) => ({
          id: item.id,
          name: item.name
        }));
        setArrayCriteria(criteriaArray);
      } catch (error) {
        console.log(error);
      }
    };

    const SegmentList = async () => {
      const response = await axiosServices.get('/api/segment');
      try {
        const segmentArray: SegmentType[] = response.data.map((item: SegmentType) => ({
          id: item.id,
          name: item.name
        }));
        setArraySegment(segmentArray);
      } catch (error) {
        console.log(error);
      }
    };

    const BranchList = async (shopId: number) => {
      const response = await axiosServices.get(`/api/shop/${shopId}/branch`);
      try {
        const branchArray: BranchType[] = response.data.map((item: BranchType) => ({
          id: item.id,
          name: item.name
        }));
        setArrayBranchList(branchArray);
        setBranchId(branchArray.map((item: any) => item.id));
      } catch (error) {
        console.log(error);
      }
    };

    const CampaignDateList = async (campaignDates: Array<CampaignDate>) => {
      try {
        const campaignArray: CampaignDate[] = campaignDates.map((item: CampaignDate) => ({
          id: item.id,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          quantity: item.quantity,
          campaignId: item.campaignId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setQuotaRange(campaignArray);
        console.log(campaignArray);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      await CategoryList();
      await ShopList();
      await CriteriaList();
      await SegmentList();
      if (primaryId) {
        const response = await axiosServices.get(`/api/campaign/${primaryId}`);
        const data = response.data;
        const shopId = data.Campaign_Shop[0].shopId;
        await BranchList(shopId);
        setShopId(data.Campaign_Shop[0].shopId);
        setPrimaryShopId(data.Campaign_Shop[0].id);
        setBranchId(data.Campaign_Shop[0].Campaign_Shop_Branch.map((item: any) => item.branchId));
        setName(data.name);
        setCategory(data.category_type_id);
        setStartDate(data.startDate.slice(0, 16));
        setEndDate(data.endDate.slice(0, 16));
        setQuantity(data.quantity);
        setCategoryQuantity(parseInt(data.quantity_category));
        setQuotaLimit(data.quota_quantity_limit);
        setCategoryQuotaLimit(parseInt(data.quota_limit_by));
        setSegment(data.segment);
        setCriteria(data.criteria);
        setDescription(data.description);
        setCondition(data.condition);
        await CampaignDateList(data.Campaign_Date);
      }
    };

    fetchData();
  }, [primaryId]);

  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return; // No files selected
    }

    const files = Array.from(e.target.files).slice(0, 5); // Get first 5 files if there are more
    setFileImage(files);

    // Ensure each file is actually a File object
    const newImageSrcs: string[] = [];
    files.forEach((file) => {
      // Ensure that each file is a Blob
      if (file instanceof Blob) {
        // This is where you ensure the file is a Blob
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          // Ensure that the result is a string
          if (typeof e.target?.result === 'string') {
            newImageSrcs.push(e.target.result);
          }
          if (newImageSrcs.length === files.length) {
            setImageSrcs(newImageSrcs); // Update the image srcs state
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // const handleQuotaTypeChange = (event: any, value: any) => {
  //   setIsQuotaDisabled(value.id === 4);
  // };

  const handleShopChange = async (value: string) => {
    const res = await axiosServices.get(`/api/shop/${value}/branch`);
    try {
      const branchArray = res.data.map((item: BranchType) => ({
        id: item.id,
        name: item.name
      }));
      setArrayBranchList(branchArray);
      console.log(branchArray);
    } catch (error) {
      console.log(error);
    }
  };

  // date condition

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
    if (new Date(event.target.value) > new Date(endDate ?? '')) {
      setError('วันที่สิ้นสุด ต้องมากกว่า วันที่เริ่มต้น.');
    } else {
      setError('');
    }
  };

  const handleEndDateChange = (event: any) => {
    const newEndDate = event.target.value;
    if (newEndDate && new Date(newEndDate) <= new Date(startDate ?? '')) {
      setError('วันที่สิ้นสุด ต้องมากกว่า วันที่เริ่มต้น.');
    } else {
      setEndDate(newEndDate ?? '');
      setError('');
    }
  };

  // create code table
  const handleCreateQuota = () => {
    if (CategoryQuantity == null) {
      setErrorMessage('กรุณาเลือกประเภทสิทธิพิเศษ');
      setOpenErrorDialog(true);
    }
    if (Quantity == 0 || Quantity == null) {
      setErrorMessage('กรุณาใส่จำนวนสิทธิพิเศษให้ครบถ้วน หรือใส่จำนวนมากกว่า 1');
      setOpenErrorDialog(true);
    }
    if (startDate && endDate && Quantity) {
      if (CategoryQuantity === 1) {
        generateDailyQuotaTable();
      } else if (CategoryQuantity === 2) {
        generateWeeklyQuotaTable();
      } else if (CategoryQuantity === 3) {
        generateMonthlyQuotaTable();
      }
    }
  };

  const formatDate = (date: Date): string => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat('th-TH', options).format(new Date(date));
  };

  const generateDailyQuotaTable = () => {
    if (codeQuatity > 0) {
      setCodeQuatity(0);
    }
    const start = new Date(startDate as Date).getTime();
    const end = new Date(endDate as Date).getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalQuantity = Quantity;
    const remainderQuota = totalQuantity % diffDays;
    let quotaTable = [];
    let currentAverageQuota = Math.floor(totalQuantity / diffDays);
    let currentQuota = currentAverageQuota;
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0); // Set to the start of the day

      const endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999); // Set to the end of the day

      // Add the remainder to the last day
      if (i === diffDays - 1) {
        currentQuota += remainderQuota;
      }

      quotaTable.push({
        id: i,
        startDate: currentDate,
        endDate: endDate,
        quantity: currentQuota
      });
    }

    setQuotaRange(quotaTable);
  };

  const generateWeeklyQuotaTable = () => {
    if (codeQuatity > 0) {
      setCodeQuatity(0);
    }
    const start = new Date(startDate as Date).getTime();
    const end = new Date(endDate as Date).getTime();

    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const diffTime = Math.abs(end - start);
    const diffWeeks = Math.ceil(diffTime / oneWeek);

    let quotaTable = [];
    for (let i = 0; i < diffWeeks; i++) {
      const weekStart = new Date(start + i * oneWeek);
      let weekEnd = new Date(weekStart.getTime() + oneWeek - 1);
      weekStart.setHours(0, 0, 0, 0); // Set to the start of the day
      weekEnd.setHours(23, 59, 59, 999); // Set to the end of the day

      if (weekEnd > new Date(end)) {
        weekEnd = new Date(end);
      }

      const totalQuantity = Quantity;
      let quota = Math.floor(totalQuantity / diffWeeks);
      const remainderQuota = totalQuantity % diffWeeks;

      if (i === diffWeeks - 1) {
        quota += remainderQuota;
      }

      quotaTable.push({
        id: i,
        startDate: weekStart,
        endDate: weekEnd,
        quantity: quota
      });
    }

    // แสดงผลลัพธ์
    console.log(quotaTable);

    // ใช้ฟังก์ชัน setQuotaRange หรืออัพเดทสถานะ/ฐานข้อมูลที่เหมาะสม
    setQuotaRange(quotaTable);
  };

  const generateMonthlyQuotaTable = () => {
    if (codeQuatity > 0) {
      setCodeQuatity(0);
    }
    const start = new Date(startDate as Date).getTime();
    const end = new Date(endDate as Date).getTime();
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    let quotaTable = [];
    let currentAverageQuota = Math.floor(Quantity / diffMonths);
    let currentQuota = currentAverageQuota;
    for (let i = 0; i < diffMonths; i++) {
      const monthStart = new Date(start);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0); // Set to the start of the day

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999); // Set to the end of the day

      // Add the remainder to the last month
      if (i === diffMonths - 1) {
        currentQuota += Quantity % diffMonths;
      }

      quotaTable.push({
        id: i,
        startDate: monthStart,
        endDate: monthEnd,
        quantity: currentQuota
      });
    }

    setQuotaRange(quotaTable);
  };

  const handleSaveQuota = (id: number, quantity: number) => {
    // const newQuantity = quotaRange[id].quantity - quantity;
    const index = quotaRange.findIndex((item) => item.id === id);
    let oldQuantity = quotaRange[index].quantity;
    let total = codeQuatity + (oldQuantity - quantity);
    if (total < 0) {
      setErrorMessage('จำนวนโค้ดคงเหลือไม่เพียงพอ');
      setQuotaModal(false);
      setOpenErrorDialog(true);
    } else {
      setCodeQuatity(total);
      setQuotaModal(false);
      quotaRange[index].quantity = Number(quantity);
    }
  };
  // table
  const handleChangePage = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page with the new number of rows
  };

  const handleOpenEditQuotaModal = (id: string, quantity: number) => {
    setTempQuotaId(parseInt(id));
    setTempQuotaQuantity(Number(quantity));
    setQuotaModal(true);
  };

  return (
    <>
      <GoBackButton Link={'/campaign/normal'} />
      <MainCard title={title}>
        <SuccessDialog open={openSuccessDialog} handleClose={handleCloseSuccessDialog} />
        <ErrorDialog open={openErrorDialog} handleClose={() => setOpenErrorDialog(false)} errorMessage={errorMessage} />
        <form>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6} lg={6}>
              <SubCard title="ร้านค้าที่เข้าร่วม">
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      options={ArrayShop}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      value={ArrayShop.find((Item) => Item.id === ShopId) || null}
                      onChange={(_event, value) => {
                        handleShopChange(value?.id ? value.id : '');
                        setShopId(value?.id ? value.id : '');
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <SubCard title="สาขา">
                <Grid item>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-label="shopIncludeExclude"
                      value={BranchCondition}
                      onChange={(event: any) => {
                        setBranchCondition(event.target.value);
                        console.log(event.target.value);
                      }}
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="include"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.success.main,
                              '&.Mui-checked': { color: theme.palette.success.main }
                            }}
                          />
                        }
                        label="สาขาที่เข้าร่วม"
                      />
                      <FormControlLabel
                        value="exclude"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.error.main,
                              '&.Mui-checked': { color: theme.palette.error.main }
                            }}
                          />
                        }
                        label="สาขาที่ยกเว้น"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      multiple
                      options={ArrayBranchList}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => option.name}
                      value={ArrayBranchList.filter((item) => BranchId.includes(Number(item.id)))}
                      onChange={(_event, value) => {
                        setBranchId(value.map((item) => item.id));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>

            <Grid item xs={12} md={12}>
              <InputLabel required>ชื่อสิทธิพิเศษ</InputLabel>
              <TextField
                required
                inputProps={{ maxLength: 100 }}
                fullWidth
                name="Name"
                value={Name}
                onChange={(event: any) => {
                  setName(event.target.value);
                  formik.handleChange(event);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.Name && Boolean(formik.errors.Name)}
                helperText={formik.touched.Name && formik.errors.Name}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <InputLabel required>หมวดหมู่สิทธิพิเศษ</InputLabel>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    options={ArrayCategory}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_event: any, value: any) => {
                      setCategory(value?.id);
                    }}
                    value={ArrayCategory.find((Item) => Item.id === Category) || null}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>{' '}
            </Grid>
            <Grid xs={6} md={6} />
            <Grid item xs={12} md={6}>
              <InputLabel required>วันที่เริ่มต้น</InputLabel>
              <TextField
                fullWidth
                type="datetime-local"
                value={startDate}
                onChange={handleStartDateChange}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel required>วันที่สิ้นสุด</InputLabel>
              <TextField
                fullWidth
                type="datetime-local"
                value={endDate}
                onChange={handleEndDateChange}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel required>จำนวนสิทธิพิเศษรวมทั้งโครงการ</InputLabel>
              <FormControl fullWidth variant="outlined">
                <OutlinedInput
                  type="number"
                  placeholder="จำนวนสิทธิพิเศษ"
                  value={Quantity}
                  onChange={(event: any) => {
                    setQuantity(event.target.value);
                    if (event.target.value < 0) {
                      setQuantity(0);
                    }
                  }}
                  endAdornment={<InputAdornment position="end">สิทธิพิเศษ</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel required>ประเภทสิทธิพิเศษ</InputLabel>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    options={quotaChoose}
                    getOptionLabel={(option) => option.label}
                    onChange={(_event: any, value: any) => {
                      setCategoryQuantity(value?.id);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={quotaChoose.find((Item) => Item.id === CategoryQuantity) || null}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>{' '}
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel>จำกัดจำนวน</InputLabel>
              <OutlinedInput
                fullWidth
                placeholder="จำนวนคน"
                onChange={(event: any) => {
                  setQuotaLimit(event.target.value);
                }}
                value={QuotaLimit}
                disabled={CategoryQuotaLimit === 4}
                endAdornment={<InputAdornment position="end">คน</InputAdornment>}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel required>การจำกัดของสิทธิพิเศษ</InputLabel>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    options={maxQuotaPerPerson}
                    getOptionLabel={(option) => option.label}
                    onChange={(_event: any, value: any) => {
                      setCategoryQuotaLimit(value?.id);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={maxQuotaPerPerson.find((Item) => Item.id === CategoryQuotaLimit) || null}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>{' '}
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel required>กลุ่มเป้าหมาย (Criteria)</InputLabel>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    multiple
                    options={ArrayCriteria}
                    onChange={(_event: any, newValue: any) => {
                      setCriteria(newValue.map((item: any) => item.id));
                    }}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={ArrayCriteria.filter((item) => Criteria.includes(Number(item.id)))}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={6} xs={12}>
              <InputLabel required>กลุ่มการตลาด (Segment)</InputLabel>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    multiple
                    options={ArraySegment}
                    onChange={(_event: any, value: any) => {
                      setSegment(value.map((item: any) => item.id));
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name}
                    value={ArraySegment.filter((item) => Segment.includes(Number(item.id)))}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={6} xs={12}>
              <InputLabel required>รูปแบบนับการเข้าชมเว็บไซต์</InputLabel>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Autocomplete
                    options={WebsiteTrafficPatternList}
                    getOptionLabel={(option) => option.label}
                    onChange={(_event: any, value: any) => {
                      setWebsiteTrafficPattern(value?.value);
                    }}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={WebsiteTrafficPatternList.find((Item) => Item.value === WebsiteTrafficPattern) || null}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>{' '}
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel>จำนวนครั้งที่เข้าชม</InputLabel>
              <FormControl fullWidth variant="outlined">
                <OutlinedInput
                  endAdornment={<InputAdornment position="end">ครั้ง</InputAdornment>}
                  placeholder="จำนวนการรับชม"
                  value={WebsiteTrafficPatternValue}
                  disabled={WebsiteTrafficPattern === 'Auto'}
                  onChange={(event: any) => {
                    setWebsiteTrafficPatternValue(event.target.value);
                  }}
                />
                <FormHelperText>จำนวนครั้งที่เข้าชมเว็บไวต์</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <InputLabel required>รายละเอียด</InputLabel>
              <div style={{ height: '150px' }}>
                <ReactQuill
                  style={{ height: '100px' }}
                  onChange={(value) => {
                    setDescription(value);
                  }}
                  value={Description}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <InputLabel required>เงื่อนไข</InputLabel>
              <div style={{ height: '150px' }}>
                <ReactQuill
                  style={{ height: '100px' }}
                  onChange={(value) => {
                    setCondition(value);
                  }}
                  value={Condition}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <SubCard title="อัพโหลดรูปภาพ">
                <div>
                  <TextField
                    type="file"
                    id="file-upload"
                    fullWidth
                    label="Enter SKU"
                    sx={{ display: 'none' }}
                    onChange={handleFileChange}
                    inputProps={{ multiple: true }} // Allows multiple file selection
                  />
                  <InputLabel
                    htmlFor="file-upload"
                    sx={{
                      background: theme.palette.background.default,
                      py: 3.75,
                      px: 0,
                      textAlign: 'center',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      mb: 3,
                      '& > svg': {
                        verticalAlign: 'sub',
                        mr: 0.5
                      }
                    }}
                  >
                    <CloudUploadIcon /> คลิกเพื่ออัพโหลดรูปภาพ
                  </InputLabel>
                </div>
                <Grid container spacing={3} justifyContent="center">
                  {imageSrcs.map((src, index) => (
                    <Grid item key={index}>
                      <ImageWrapper>
                        <CardMedia component="img" image={src} title={`Product ${index + 1}`} />
                      </ImageWrapper>
                    </Grid>
                  ))}
                  {/* ... */}
                </Grid>
              </SubCard>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="end">
                <Grid item>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      type="button"
                      onClick={() => {
                        handleCreateQuota();
                      }}
                      component="button" // Add the component prop with the value "button"
                      sx={{
                        background: theme.palette.dark.main,
                        '&:hover': { background: theme.palette.success.dark }
                      }}
                    >
                      สร้างตารางสิทธิพิเศษ
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      <MainCard title="ตารางสิทธิพิเศษ" sx={{ marginTop: '50px' }}>
        <Grid container spacing={gridSpacing} sx={{ marginBottom: '20px' }}>
          <Grid item xs={4} md={4} spacing={gridSpacing}>
            <Chip label="โค้ดที่มีทั้งหมด" chipcolor="success" sx={{ marginRight: '10px;' }} />
            <Chip label={Quantity ? Quantity.toString() : '0'} chipcolor="success" sx={{ marginRight: '10px;' }} />
          </Grid>

          <Grid item xs={4} md={4} spacing={gridSpacing}>
            <Chip label="จำนวนโควต้าคงเหลือ" chipcolor="primary" sx={{ marginRight: '10px;' }} />
            <Chip
              label={`${codeQuatity ? codeQuatity.toString() : '0'} / ${Quantity ? Quantity.toString() : '0'}`}
              chipcolor="primary"
              sx={{ marginRight: '10px;' }}
            />
          </Grid>
        </Grid>
        <TableContainer>
          <Table sx={{ minWidth: 320 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">ลำดับ</StyledTableCell>
                <StyledTableCell sx={{ pl: 3 }}>วันที่เริ่มต้น</StyledTableCell>
                <StyledTableCell sx={{ pl: 3 }}>วันที่สิ้นสุด</StyledTableCell>
                <StyledTableCell align="left">จำนวนโควต้า</StyledTableCell>
                <StyledTableCell align="right">จัดการ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotaRange.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((quota, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                    <b>{index + 1}</b>
                  </StyledTableCell>
                  <TableCell>{formatDate(quota.startDate)}</TableCell>
                  <TableCell>{formatDate(quota.endDate)}</TableCell>

                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                    {quota.quantity}
                    <b>/{quota.quantity}</b>
                  </StyledTableCell>
                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row" align="right">
                    <AnimateButton>
                      <Button
                        variant="contained"
                        type="submit"
                        onClick={(_event: any) => {
                          handleOpenEditQuotaModal(quota.id.toString(), quota.quantity);
                        }}
                        sx={{
                          background: theme.palette.dark.main,
                          '&:hover': { background: theme.palette.success.dark }
                        }}
                      >
                        <EditTwoToneIcon sx={{ fontSize: '1rem' }} />
                        &nbsp;แก้ไข
                      </Button>
                    </AnimateButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 30, { label: 'All', value: -1 }]}
          component="div"
          count={quotaRange.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </MainCard>
      <ModalEditQuota
        isOpen={QuotaModal}
        isClose={() => setQuotaModal(false)}
        onSave={handleSaveQuota}
        primaryId={tempQuotaId}
        quantity={tempQuotaQuantity}
      />

      <Grid item xs={12} sx={{ marginTop: '20px' }}>
        <Grid container spacing={2} justifyContent="end">
          <Grid item>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" type="submit" onClick={handleSubmit}>
                  {primaryId ? 'แก้ไขข้อมูล' : 'สร้างข้อมูล'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              href="/campaign/normal"
              sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
            >
              ย้อนกลับ
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default NormalCampaignForm;
