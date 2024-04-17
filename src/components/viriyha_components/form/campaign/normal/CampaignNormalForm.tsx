import React, { useState, ChangeEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';
import JWTContext from 'contexts/JWTContext';
// excel
import * as XLSX from 'xlsx';
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
  FormHelperText,
  Tooltip,
  IconButton
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import FileOpenIcon from '@mui/icons-material/FileOpen';

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

const CodeOption = [
  { label: 'เพิ่มโค้ดโดยอัตโนมัติ', id: 1 },
  { label: 'เพิ่มโค้ดโดยตัวเอง', id: 2 }
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
  type?: string;
}

interface GenerateQuotaTableProps {
  id: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
}

const NormalCampaignForm = ({ primaryId, title, type }: NormalCampaignFormProps) => {
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
  const [codeCondition, setCodeCondition] = useState<number>();
  const createdById = context?.user?.userInfo?.id;

  // import varaible
  const [codeExcelFile, setCodeExcelFile] = React.useState<File | null>(null);
  const [codeExcelData, setCodeExcelData] = React.useState<any[]>([]);

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
  console.log(codeExcelData);

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

  // image
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

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
    formData.append('createdById', String(createdById));
    quotaRange.forEach((item, index) => {
      formData.append('quotaRange', JSON.stringify(item));
    });
    if (codeCondition === 2) {
      codeExcelData.forEach((item) => {
        formData.append('codeExcelData', JSON.stringify(item));
      });
    }
    fileImage.forEach((file: File) => {
      formData.append('file', file);
    });
    if (primaryId) {
      formData.append('updatedById', String(createdById));
      formData.append('primaryShopId', String(primaryShopId));
    }

    try {
      let response;
      if (primaryId && type != 'clone') {
        response = await axiosServices.post(`/api/campaign/update/${primaryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (type == 'clone' && primaryId) {
        response = await axiosServices.post('/api/campaign/create', formData, {
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
        const imgUrl = process.env.IMAGE_VIRIYHA_URL + 'images/normal-campaign/';
        const response = await axiosServices.get(`/api/campaign/${primaryId}`);
        const data = response.data;
        const shopId = data.Campaign_Shop[0].shopId;
        const newImageSrcs: string[] = [];
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
        if (data.Campaign_Code.length > 0) {
          setCodeCondition(2);
          setCodeExcelData(data.Campaign_Code.code);
        }
        data.Campaign_Image.forEach((item: any) => {
          newImageSrcs.push(imgUrl + item.image);
          setImageSrcs(newImageSrcs);
        });
        await CampaignDateList(data.Campaign_Date);
      }
    };

    fetchData();
  }, [primaryId]);

  useEffect(() => {
    if (CategoryQuantity === 4) {
      setQuantity(0);
    }
  }, [CategoryQuantity]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return; // No files selected
    }

    const files = Array.from(e.target.files).slice(0, 5);
    setFileImage(files);
    const newImageSrcs: string[] = [];
    files.forEach((file) => {
      if (file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (typeof e.target?.result === 'string') {
            newImageSrcs.push(e.target.result);
          }
          if (newImageSrcs.length === files.length) {
            setImageSrcs(newImageSrcs);
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
    if (Quantity == 0 || (Quantity == 0 && CategoryQuantity == 4)) {
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

  // function : import
  const handleOpenCodeExcel = () => {
    document.getElementById('excelFile')?.click();
  };

  const handleExcelFileCodeChange = (event: any) => {
    const file = event.target.files;
    if (file) {
      setCodeExcelFile(file[0]);
      console.log(codeExcelFile);
      handleExcelFileCodeUpload(file[0]);
      event.target.value = null;
    }
  };

  const handleExcelFileCodeUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const dataParse = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Start mapping from the second element (index 1) to skip the header row
      const arrayCodeList: any[] = dataParse.slice(1).map((item: any) => ({
        id: item[0],
        code: item[1]
      }));
      setCodeExcelData(arrayCodeList);
      console.log(arrayCodeList);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDelete = (id: number) => {
    const filteredData = codeExcelData.filter((item) => item.id !== id);
    setCodeExcelData(filteredData);
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
                  disabled={CategoryQuotaLimit === 4}
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
                      if (value?.id === 4) {
                        setQuantity(0);
                      }
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
                  onChange={(content, delta, source, editor) => {
                    const plainText = editor.getText(); // ดึงข้อความโดยไม่มีรูปแบบ
                    if (plainText.length <= 85 + 1) {
                      // ตรวจสอบความยาวข้อความ (+1 สำหรับตัวอักษร newline ที่เพิ่มโดยอัตโนมัติ)
                      setDescription(content); // อัปเดตสถานะเมื่อต่ำกว่าหรือเท่ากับ 85 ตัวอักษร
                    } else if (plainText.length > 85 + 1) {
                      setOpenErrorDialog(true);
                      setErrorMessage('รายละเอียด ต้องไม่เกิน 85 ตัวอักษร');
                      // ตัดข้อความที่เกิน 85 ตัวอักษร
                      setDescription(editor.getText().slice(0, 85));
                    }
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
                      <ImageWrapper sx={{ width: '200px;', height: '250px;' }}>
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

      <MainCard title="ตารางโค้ด" sx={{ marginTop: '50px' }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'left', marginBottom: '20px' }}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Autocomplete
                  size="small"
                  options={CodeOption}
                  getOptionLabel={(option) => option.label}
                  onChange={(_event: any, value: any) => {
                    setCodeCondition(value?.id);
                    if (value?.id === 2) {
                      setCodeExcelData([]);
                      handleOpenCodeExcel();
                    }
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={CodeOption.find((Item) => Item.id === codeCondition) || null}
                  renderInput={(params) => <TextField {...params} label="การกำหนดโค้ด" />}
                />
              </Grid>
            </Grid>{' '}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right', display: codeCondition === 2 ? 'show' : 'none' }}>
            <Tooltip title="นำเข้าโค้ด">
              <IconButton size="large" onClick={handleOpenCodeExcel}>
                <FileOpenIcon />
                <input type="file" id="excelFile" style={{ display: 'none' }} onChange={handleExcelFileCodeChange} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <TableContainer sx={{ display: codeCondition === 2 ? 'show' : 'none' }}>
          <Table sx={{ minWidth: 320 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">ลำดับ</StyledTableCell>
                <StyledTableCell align="left">โค้ด</StyledTableCell>
                <StyledTableCell align="right">จัดการ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codeExcelData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                    <b>{index + 1}</b>
                  </StyledTableCell>
                  <TableCell>{item.code}</TableCell>

                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row" align="right">
                    <AnimateButton>
                      <IconButton size="large" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
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
          count={codeExcelData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </MainCard>

      <Grid item xs={12} sx={{ marginTop: '20px' }}>
        <Grid container spacing={2} justifyContent="end">
          <Grid item>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" type="submit" onClick={handleSubmit}>
                  ยืนยัน
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
