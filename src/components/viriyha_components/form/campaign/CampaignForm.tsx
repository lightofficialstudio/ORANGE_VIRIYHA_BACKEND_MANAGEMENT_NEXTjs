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
  IconButton,
  Fab
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import IosShareIcon from '@mui/icons-material/IosShare';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/AddTwoTone';

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
import ModalEditQuota from './ModalEditQuota';
import ModalEditPhoneNumber from './ModalEditPhoneNumber';
import ModalEditCodeNumber from './ModalEditCodeNumber';
import GoBackButton from 'components/viriyha_components/button/go_back';
import { CampaignDate } from 'types/viriyha_type/campaign';
// third-party - validation
import { useFormik } from 'formik';
import * as yup from 'yup';

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
  { label: 'รายเดือน', id: 3 },
  { label: 'รายแคมเปญ', id: 4 }
];

const maxQuotaPerPerson = [
  { label: 'สิทธิ์/คน/วัน', id: 1 },
  { label: 'สิทธิ์/คน/สัปดาห์', id: 2 },
  { label: 'สิทธิ์/คน/เดือน', id: 3 },
  { label: 'ไม่จำกัดจำนวนคน', id: 4 }
];

const CodeOption = [
  { label: 'เพิ่มโค้ดโดยอัตโนมัติ', id: 1 },
  { label: 'เพิ่มโค้ดโดยตัวเอง', id: 2 }
  // { label: 'เพิ่มโค้ดเท่ากับจำนวนสิทธิพิเศษ', id: 3 }
];

const WebsiteTrafficPatternList = [
  { label: 'อัตโนมัติ', value: 'AUTO' },
  { label: 'ปรับด้วยตัวเอง', value: 'MANUAL' },
  { label: 'ปิดการแสดงผล', value: 'CLOSE' }
];

// validation schema
const validationSchema = yup.object({
  // Name: yup.string().required('กรุณาใส่ชื่อให้ถูกต้อง หรือ กรอกให้ครบถ้วน'),
  startDate: yup.date().required('กรุณาใส่วันที่เริ่มต้น หรือ กรอกให้ครบถ้วน'),
  endDate: yup.date().required('กรุณาใส่วันที่สิ้นสุด หรือ กรอกให้ครบถ้วน')
});

// interface
interface CampaignFormProps {
  primaryId?: string;
  title?: string;
  type?: string;
}

interface GenerateQuotaTableProps {
  id: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
  used_quantity: number;
}

type ImageType = {
  file?: File; // `file` is now optional
  src: string;
};

const CampaignForm = ({ primaryId, title, type }: CampaignFormProps) => {
  const theme = useTheme();
  const context = React.useContext(JWTContext);
  // const [isQuotaDisabled, setIsQuotaDisabled] = useState(false);
  // array
  const [ArrayCategory, setArrayCategory] = useState<CategoryType[]>([]);
  const [ArrayShop, setArrayShop] = useState<ShopManagementType[]>([]);
  const [ArrayBranchList, setArrayBranchList] = useState<any[]>([]);
  const [ArrayCriteria, setArrayCriteria] = useState<CriteriaType[]>([]);
  const [ArraySegment, setArraySegment] = useState<SegmentType[]>([]);
  const [ArrayPhoneNumber, setArrayPhoneNumber] = useState<any[]>([]);
  const [ArrayImageName, setArrayImageName] = useState<any[]>([]);

  // variable
  const [ShopId, setShopId] = useState<number>();
  const [BranchCondition, setBranchCondition] = useState<string>('include');
  const [BranchId, setBranchId] = useState<number[]>([]);
  const [Name, setName] = useState<string>('');
  const [NameCall, setNameCall] = useState<string>('');
  const [Category, setCategory] = useState<number>();
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>();
  const [Quantity, setQuantity] = useState<number>(0);
  const [CategoryQuantity, setCategoryQuantity] = useState<number>();
  const [QuotaLimit, setQuotaLimit] = useState<number>(0);
  const [CategoryQuotaLimit, setCategoryQuotaLimit] = useState<number>(0);
  const [WebsiteTrafficPattern, setWebsiteTrafficPattern] = useState<string>('AUTO');
  const [WebsiteTrafficPatternValue, setWebsiteTrafficPatternValue] = useState<number>(0);
  const [Segment, setSegment] = useState<number[]>([]);
  const [Criteria, setCriteria] = useState<number[]>([]);
  const [Description, setDescription] = useState<string>('');
  const [Condition, setCondition] = useState<string>('');
  const [fileImage, setFileImage] = useState<File[]>([]);
  const [filePhoneNumberExcel, setFilePhoneNumberExcel] = useState<Blob>();
  const [CodeType, setCodeType] = useState<number>();
  const createdById = context?.user?.userInfo?.id as number;
  if (!createdById) {
    window.location.reload();
  }

  // images
  // import varaible
  const [codeExcelFile, setCodeExcelFile] = React.useState<File | null>(null);
  const [codeExcelData, setCodeExcelData] = React.useState<any[]>([]);

  // variable for update
  const [primaryShopId, setPrimaryShopId] = useState<number>();
  // validation
  const formik = useFormik({
    initialValues: {
      Name: '',
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
  console.log(codeExcelData, filePhoneNumberExcel);

  // condition
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // const imgUrl = process.env.BACKEND_VIRIYHA_APP_API_URL + 'image/banner';
  const [error, setError] = useState('');

  // generate table
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [quotaRange, setQuotaRange] = useState<GenerateQuotaTableProps[]>([]);
  const [codeQuatity, setCodeQuatity] = useState<number>(0);
  const [tempQuotaId, setTempQuotaId] = useState<number>(0);
  const [tempQuotaQuantity, setTempQuotaQuantity] = useState<number>(0);
  // generate code table
  const [codePage, setCodePage] = useState<number>(0);
  const [rowsCodePerPage, setCodeRowsPerPage] = useState<number>(10);
  // generate phone number table
  const [phonePage, setPhonePage] = useState<number>(0);
  const [rowsPhonePerPage, setPhoneRowsPerPage] = useState<number>(10);
  // modal
  const [QuotaModal, setQuotaModal] = useState(false);

  // phone number
  const [openEditPhoneNumberModal, setOpenEditPhoneNumberModal] = React.useState<boolean>(false);
  const [tempPhoneNumberId, setTempPhoneNumberId] = React.useState<number>(0);
  const [tempPhoneNumber, setTempPhoneNumber] = React.useState<string>('');
  const [successIdCardCount, setSuccessIdCardCount] = React.useState<number>(0);
  const [errorIdCardCount, setErrorIdCardCount] = React.useState<number>(0);
  // code modal
  const [openEditCodeModal, setOpenEditCodeModal] = React.useState<boolean>(false);
  const [tempCodeId, setTempCodeId] = React.useState<number>(0);
  const [tempCode, setTempCode] = React.useState<string>('');
  // image
  const [images, setImages] = useState<ImageType[]>([]);

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  // todo : ส่งข้อมูลไปยัง API
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // validated section
    let campaign_type = '-';
    if (type === 'clone' || type === 'normal') {
      campaign_type = 'normal';
    } else if (type === 'special_clone' || type === 'special') {
      campaign_type = 'special';
    }
    const formData = new FormData();
    if (!ShopId || !BranchId || !Name || !Category || !startDate || !endDate || !Description || !Condition || !fileImage) {
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setOpenErrorDialog(true);
      return;
    }
    // * ตรวจสอบว่ามีข้อมูล "ชื่อผู้สร้าง" หรือไม่
    else if (!createdById) {
      setErrorMessage('กรุณาเกิดรีเฟรชหน้านี้ใหม่อีกครั้ง เนื่องจากเกิดข้อผิดพลาดไม่สามารถระบุตัวตนผู้ทำรายการได้');
      setOpenErrorDialog(true);
      return;
    }
    // * ตรวจสอบว่ามีข้อมูล "เบอร์โทรศัพท์" หรือไม่
    else if (errorIdCardCount > 0) {
      setErrorMessage('กรุณาตรวจสอบเลขบัตรประชาชนให้ถูกต้อง');
      setOpenErrorDialog(true);
      return;
    }
    // * ตรวจสอบว่ามีข้อมูล "ชื่อเรียกสิทธิพิเศษ" หรือไม่
    else if (NameCall === '') {
      setErrorMessage('กรุณาตั้งชื่อเรียกสิทธิพิเศษ (กรณีใช้งานสำหรับหลังบ้าน)');
      setOpenErrorDialog(true);
      return;
    }
    // * ตรวจสอบว่ามีข้อมูลโค้ดสิทธิพิเศษหรือไม่
    else if (codeExcelData.length === 0) {
      setErrorMessage('ตารางโค้ดสิทธิพิเศษ ต้องมีอย่างน้อย 1 โค้ด โปรดตรวจสอบอีกครั้ง');
      setOpenErrorDialog(true);
      return;
    }
    // form append section
    formData.append('shopId', String(ShopId));
    formData.append('type', campaign_type);
    formData.append('branchId', BranchId.join(','));
    formData.append('branch_condition', BranchCondition);
    formData.append('name', Name);
    formData.append('name_called', NameCall);
    formData.append('category_type_id', String(Category));
    formData.append('startDate', startDate ? startDate.toString() : '');
    formData.append('endDate', endDate ? endDate.toString() : '');
    formData.append('quantity', String(Quantity));
    formData.append('used_quantity', String(Quantity));
    formData.append('quantity_category', String(CategoryQuantity));
    formData.append('quota_quantity_limit', String(QuotaLimit));
    formData.append('quota_limit_by', String(CategoryQuotaLimit));
    formData.append('segment', Segment.join(','));
    formData.append('criteria', Criteria.join(','));
    formData.append('description', Description);
    formData.append('condition', Condition);
    formData.append('status', 'ACTIVE');
    formData.append('createdById', String(createdById));
    formData.append('view_format', WebsiteTrafficPattern);
    formData.append('view', String(WebsiteTrafficPatternValue));
    // ส่งข้อมูล Campaign Date
    quotaRange.forEach((item) => {
      formData.append('quotaRange', JSON.stringify(item));
    });
    // ส่งข้อมูลโค้ด Campaign Code
    codeExcelData?.map((item: any) => {
      formData.append('Campaign_Code', JSON.stringify(item));
    });
    if (CodeType === 2) {
      formData.append('codeType', 'MANUAL');
    } else {
      formData.append('codeType', 'AUTO');
    }
    // ส่งข้อมูไฟล์รูปภาพ
    fileImage.forEach((file) => {
      formData.append('file', file);
    });

    if (primaryId) {
      formData.append('updatedById', String(createdById));
      formData.append('primaryShopId', String(primaryShopId));
      const localArrayImageName = ArrayImageName.map((item) => item.image);
      formData.append('Campaign_Image', localArrayImageName.join(','));
    }

    if (type === 'special' || type === 'special_clone') {
      const LocalArrayIdCard: any = [];
      ArrayPhoneNumber.forEach((item) => {
        LocalArrayIdCard.push(item.phoneNumber);
      });
      formData.append('Campaign_Member', LocalArrayIdCard.join(','));
    }

    try {
      let response;
      if (type == 'clone') {
        response = await axiosServices.post('/api/campaign/normal/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (type == 'special_clone') {
        response = await axiosServices.post('/api/campaign/special/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (type == 'normal') {
        if (!primaryId) {
          response = await axiosServices.post('/api/campaign/normal/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else if (primaryId) {
          response = await axiosServices.post(`/api/campaign/normal/update/${primaryId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      } else if (type == 'special') {
        if (!primaryId) {
          response = await axiosServices.post('/api/campaign/special/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else if (primaryId) {
          response = await axiosServices.post(`/api/campaign/special/update/${primaryId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      } else {
        response = null;
      }
      // todo : หากมีการสร้างสำเร็จให้ทำการเปลี่ยนหน้าไปยังหน้า campaign ที่ต้องการ
      if (response && response.status === 200) {
        setOpenSuccessDialog(true);
        window.location.href = `/campaign/${campaign_type}/`;
      } else {
        setOpenErrorDialog(true);
        setErrorMessage(response ? response.statusText : 'Unknown error occurred');
      }
    } catch (error: any) {
      setOpenErrorDialog(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const CategoryList = async () => {
      try {
        const response = await axiosServices.get('/api/category');
        const categoryArray: CategoryType[] = response.data
          .map((item: CategoryType) => {
            if (item.status === 'ACTIVE') {
              return {
                id: item.id,
                name: item.name
              };
            }
            return null; // Explicitly return null for non-active items.
          })
          .filter((item: any) => item !== null); // Filter out null values.

        setArrayCategory(categoryArray);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };

    const ShopList = async () => {
      const response = await axiosServices.get('/api/shop');
      try {
        const shopArray: ShopManagementType[] = response.data
          .map((item: ShopManagementType) => {
            if (item.status === 'ACTIVE') {
              return {
                id: item.id,
                shopId: item.shopId,
                name: item.name
              };
            }
            return null;
          })
          .filter((item: any) => item !== null);
        setArrayShop(shopArray);
      } catch (error: any) {
        console.log(error);
      }
    };

    const CriteriaList = async () => {
      const response = await axiosServices.get('/api/criteria');
      try {
        const criteriaArray: CriteriaType[] = response.data
          .map((item: CriteriaType) => {
            if (item.status === 'ACTIVE') {
              return {
                id: item.id,
                name: item.name
              };
            }
            return null;
          })
          .filter((item: any) => item !== null);
        setArrayCriteria(criteriaArray);
      } catch (error) {
        console.log(error);
      }
    };

    const SegmentList = async () => {
      const response = await axiosServices.get('/api/segment');
      try {
        const segmentArray: SegmentType[] = response.data
          .map((item: SegmentType) => {
            if (item.status === 'ACTIVE') {
              return {
                id: item.id,
                name: item.name
              };
            }
            return null;
          })
          .filter((item: any) => item !== null);
        setArraySegment(segmentArray);
      } catch (error) {
        console.log(error);
      }
    };

    const BranchList = async (shopId: number) => {
      const response = await axiosServices.get(`/api/shop/${shopId}/branch`);
      try {
        const branchArray = [
          { id: 0, name: 'ทั้งหมด' },
          ...response.data.map((item: BranchType) => ({
            id: item.id,
            name: item.name
          }))
        ];
        setArrayBranchList(branchArray);
        setBranchId(branchArray.map((item: any) => item.id));
      } catch (error) {
        console.log(error);
      }
    };

    // ดึงข้อมูล Campaign Date
    const CampaignDateList = async (campaignDates: Array<CampaignDate>) => {
      try {
        const campaignArray: CampaignDate[] = campaignDates.map((item: CampaignDate) => ({
          id: item.id,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          quantity: item.quantity,
          used_quantity: item.used_quantity,
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
    // ดึงข้อมูล Campaign Code
    const CampaignCodeList = async (campaignCodes: any) => {
      try {
        const campaignArray: any = campaignCodes.map((item: any) => ({
          id: item.id,
          code: item.code,
          campaignId: item.campaignId
        }));
        setCodeExcelData(campaignArray);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      let campaign_type = 'original';
      await CategoryList();
      await ShopList();
      await CriteriaList();
      await SegmentList();
      if (primaryId) {
        if (type === 'clone' || type === 'normal') {
          campaign_type = 'normal';
        } else if (type === 'special_clone' || type === 'special') {
          campaign_type = 'special';
        }
        const imgUrl = process.env.IMAGE_VIRIYHA_URL + '/images/campaign/';
        const response = await axiosServices.get(`/api/campaign/${campaign_type}/${primaryId}`);
        const data = response.data;
        const shopId = data?.Campaign_Shop[0]?.shopId;
        await BranchList(shopId);
        setNameCall(data?.name_called);
        setShopId(data?.Campaign_Shop[0]?.shopId);
        setPrimaryShopId(data?.Campaign_Shop[0]?.id);
        setBranchId(data?.Campaign_Shop[0]?.Campaign_Shop_Branch?.map((item: any) => item.branchId));
        // กรณีที่เป็นการโคลนข้อมูล ต้องทำให้ชื่อเป็นค่าว่าง
        if (type === 'clone' || type === 'special_clone') {
          setName('');
        } else {
          setName(data?.name);
        }
        setCategory(data?.category_type_id);
        setStartDate(data?.startDate.slice(0, 16));
        setEndDate(data?.endDate.slice(0, 16));
        setQuantity(data?.quantity);
        setCategoryQuantity(parseInt(data?.quantity_category));
        setQuotaLimit(data?.quota_quantity_limit);
        setCategoryQuotaLimit(parseInt(data?.quota_limit_by));
        setSegment(data?.segment);
        setCriteria(data?.criteria);
        setDescription(data?.description);
        setCondition(data?.condition);
        setCodeType(data?.codeType === 'MANUAL' ? 2 : 1);
        setWebsiteTrafficPatternValue(data?.view);

        //  นำเลขบัตรประชาชนมาแสดงผล
        if (data.Campaign_Member.length > 0) {
          setArrayPhoneNumber(
            data.Campaign_Member.map((item: any) => ({
              id: item.id,
              phoneNumber: item.id_card_number
            }))
          );
        }

        // สร้าง array สำหรับเก็บข้อมูล image sources
        const newImageSrcs = data.Campaign_Image.map((item: any) => ({
          src: imgUrl + item.image
        }));

        // อัพเดท state สำหรับ images
        setImages(newImageSrcs);

        // สร้าง array สำหรับเก็บชื่อรูปและ id
        const newArrayImageName = data.Campaign_Image.map((item: any) => ({
          id: item.id,
          image: item.image
        }));

        // อัพเดท state สำหรับ array image names
        setArrayImageName(newArrayImageName);
        await CampaignDateList(data?.Campaign_Date);
        await CampaignCodeList(data?.Campaign_Code);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (CategoryQuantity === 4) {
      setQuantity(0);
    }
  }, [CategoryQuantity]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    setFileImage(files); // Update the fileImage state to reflect the actual files

    const imageFiles = files.map((file) => ({
      file,
      src: URL.createObjectURL(file) // This creates a temporary URL to access the file for display
    }));

    setImages(imageFiles); // Update the images state with the new array including the src for previews
  };

  const handleRemoveImage = (index: number) => {
    // Update the images displayed
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Update the fileImage state to match the previews
    setFileImage((prev) => prev.filter((_, i) => i !== index));

    setArrayImageName((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleQuotaTypeChange = (event: any, value: any) => {
  //   setIsQuotaDisabled(value.id === 4);
  // };

  const handleShopChange = async (value: number) => {
    try {
      const res = await axiosServices.get(`/api/shop/${value}/branch`);
      const branchArray = [
        { id: 0, name: 'ทั้งหมด' },
        ...res.data.map((item: BranchType) => ({
          id: item.id,
          name: item.name
        }))
      ]; // Include "ทั้งหมด" as the first option
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
      return;
    }
    if (CategoryQuotaLimit === 4) {
      setErrorMessage('เนื่องจากประเภทพิเศษ เป็นแบบไม่จำกัดจึงไม่สามารถสร้างตารางได้');
      setOpenErrorDialog(true);
      return;
    } else if (Quantity == 0) {
      setErrorMessage('กรุณาใส่จำนวนสิทธิพิเศษให้ครบถ้วน หรือใส่จำนวนมากกว่า 1');
      setOpenErrorDialog(true);
      return;
    }

    if (startDate && endDate && Quantity) {
      if (CategoryQuantity === 1) {
        generateDailyQuotaTable();
      } else if (CategoryQuantity === 2) {
        generateWeeklyQuotaTable();
      } else if (CategoryQuantity === 3) {
        generateMonthlyQuotaTable();
      } else if (CategoryQuantity === 4) {
        generateCampaignQuotaTable();
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
        quantity: currentQuota,
        used_quantity: currentQuota
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
        quantity: quota,
        used_quantity: quota
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
        quantity: currentQuota,
        used_quantity: currentQuota
      });
    }

    setQuotaRange(quotaTable);
  };

  const generateCampaignQuotaTable = () => {
    if (codeQuatity > 0) {
      setCodeQuatity(0);
    }
    const start = new Date(startDate as Date).getTime();
    const end = new Date(endDate as Date).getTime();

    let quotaTable: GenerateQuotaTableProps[] = [];
    let currentQuota = Quantity;
    quotaTable.push({
      id: 1,
      startDate: new Date(start),
      endDate: new Date(end),
      quantity: currentQuota,
      used_quantity: currentQuota
    });

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
      quotaRange[index].used_quantity = Number(quantity);
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
  // code table
  const handleChangeCodeRowsPerPage = (event: any) => {
    setCodeRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeCodePage = (_event: any, newPage: any) => {
    setCodePage(newPage);
  };
  // phone number table
  const handleChangePhoneRowsPerPage = (event: any) => {
    setPhoneRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePhonePage = (_event: any, newPage: any) => {
    setPhonePage(newPage);
  };

  const handleOpenEditQuotaModal = (id: string, quantity: number) => {
    setTempQuotaId(parseInt(id));
    setTempQuotaQuantity(Number(quantity));
    setQuotaModal(true);
  };

  // function : import
  const handleOpenCodeExcel = () => {
    document.getElementById('excelFileCode')?.click();
  };

  const handleExcelFileCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file && file.length > 0) {
      const selectedFile = file[0];
      const fileExtension = selectedFile.name.split('.').pop();

      if (fileExtension === 'xlsx') {
        setCodeExcelFile(selectedFile);
        console.log(codeExcelFile);
        handleExcelFileCodeUpload(selectedFile);
        event.target.value = '';
      } else {
        setOpenErrorDialog(true);
        setErrorMessage('ไฟล์ที่อัพโหลดเข้ามาไม่ถูกต้อง โปรดตรวจสอบไฟล์อีกครั้ง โดยชนิดของไฟล์ต้องเป็น .xlsx');
      }
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
    };
    reader.readAsArrayBuffer(file);
  };

  // todo : สร้างฟังก์ชันสำหรับการเพิ่มข้อมูลโค้ดโดยอัตโนมัติ จำนวน 1 โค้ด (เอาไว้ใช้ซ้ำ)
  const handleAutoGenerateCode = () => {
    // ตรวจสอบก่อนว่า codeExcelData มีข้อมูลหรือยัง
    if (codeExcelData.length === 0) {
      const codeList = [
        {
          code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
      ];
      setCodeExcelData(codeList); // บันทึก array ใหม่ลงใน state
    }
  };

  // todo : สร้างฟังก์ชันสำหรับการเพิ่มข้อมูลโค้ดโดยอัตโนมัติ จำนวน x โค้ด ตามจำนวนสิทธิ์ที่กำหนด
  // const handleAutoGenerateCodeByQuantity = () => {
  //   if (codeExcelData.length === 0) {
  //     const codeList = [];
  //     for (let i = 1; i <= Quantity; i++) {
  //       codeList.push({
  //         id: i,
  //         code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  //       });
  //     }
  //     setCodeExcelData(codeList);
  //   }
  // };

  // todo : สร้างฟังก์ชันสำหรับการลบข้อมูลโค้ด
  const handleDeleteCode = (id: number) => {
    const filteredData = codeExcelData.filter((item) => item.id !== id);
    setCodeExcelData(filteredData);
  };

  // Phone Number
  const handlExcelFilePhoneNumberClick = () => {
    document.getElementById('excelFilePhoneNumber')?.click();
  };

  const handleExcelFilePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFilePhoneNumberExcel(files[0]);
      handleExcelFilePhoneNumberUpload(files[0]);
    }
  };

  const handleExcelFilePhoneNumberUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref']!);
      range.s.r = 1; // ข้ามหัวข้อ (บรรทัดแรก)
      const updatedRef = XLSX.utils.encode_range(range);
      const dataParse = XLSX.utils.sheet_to_json(sheet, { range: updatedRef, header: 1 });
      const arrayPhoneNumber: any[] = [];
      const phoneNumbersSeen: { [key: string]: number } = {}; // เก็บ track หมายเลขที่เห็นแล้ว
      let successIdCardCount = 0;
      let errorIdCardCount = 0;
      dataParse.forEach((item: any) => {
        let phoneNumber = item[1].toString().replace(/\s+/g, '');
        let validatedMessage = '';

        if (phoneNumbersSeen[phoneNumber]) {
          // หมายเลขซ้ำกับที่เห็นก่อนหน้า
          validatedMessage = ` (ผิดรูปแบบที่กำหนด: ซ้ำกับ id ${phoneNumbersSeen[phoneNumber]})`;
          errorIdCardCount++;
        } else if (/[^0-9]/.test(phoneNumber)) {
          validatedMessage = ' (ผิดรูปแบบที่กำหนด: มีตัวอักษรพิเศษอยู่)';
          errorIdCardCount++;
        } else if (phoneNumber.length <= 12) {
          validatedMessage = ' (ผิดรูปแบบที่กำหนด: น้อยกว่า 12 ตัวอักษร)';
          errorIdCardCount++;
        } else {
          // ถ้าไม่พบข้อผิดพลาด, เก็บหมายเลขไว้ใน object เพื่อ track
          phoneNumbersSeen[phoneNumber] = item[0];
          successIdCardCount++;
        }

        // ทุก entry จะถูกเพิ่มเข้าไปใน array โดยจะมีข้อความแสดงข้อผิดพลาดถ้ามี
        arrayPhoneNumber.push({
          id: item[0],
          phoneNumber: phoneNumber,
          validated: validatedMessage
        });
      });

      setArrayPhoneNumber(arrayPhoneNumber);
      setSuccessIdCardCount(successIdCardCount);
      setErrorIdCardCount(errorIdCardCount);
    };
    reader.readAsArrayBuffer(file);
  };

  // export to excel

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([], {
      header: ['ลำดับ', 'เลขบัตรประชาชน', 'การตรวจสอบ'],
      skipHeader: false
    });

    XLSX.utils.sheet_add_json(
      ws,
      ArrayPhoneNumber.map((item, index) => ({
        ลำดับ: index + 1,
        เลขบัตรประชาชน: item.name,
        การตรวจสอบ: item.validated
      })),
      { origin: -1, skipHeader: true }
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'IDCardData');
    const fileName = `IDCardData_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleOpenEditPhoneNumberModal = (id: number, phone_number: string) => {
    setTempPhoneNumberId(id);
    setTempPhoneNumber(phone_number);
    setOpenEditPhoneNumberModal(true);
  };

  const handleSavePhoneNumber = (id: number, phone_number: string) => {
    const index = ArrayPhoneNumber.findIndex((item) => item.id === id);
    ArrayPhoneNumber[index].phoneNumber = phone_number;
    setOpenEditPhoneNumberModal(false);
  };

  const handleDeletePhoneNumber = (id: number) => {
    const filteredData = ArrayPhoneNumber.filter((item) => item.id !== id);
    setArrayPhoneNumber(filteredData);
  };

  // Code Modal
  const handleOpenEditCodeModal = (id: number, code: string) => {
    setTempCodeId(id);
    setTempCode(code);
    setOpenEditCodeModal(true);
  };

  const handleSaveCode = (id: number, code: string) => {
    const index = codeExcelData.findIndex((item) => item.id === id);
    codeExcelData[index].code = code;
    setOpenEditCodeModal(false);
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
              <SubCard title="แบรนด์">
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <Autocomplete
                      options={ArrayShop}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      value={ArrayShop.find((Item) => Item.id === ShopId) || null}
                      onChange={(_event, value) => {
                        handleShopChange(value?.id ? value.id : 0);
                        setShopId(value?.id ? value.id : 0);
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
                        // Check if "ทั้งหมด" is selected
                        if (value.some((item) => item.id === 0)) {
                          setBranchId(ArrayBranchList.filter((item) => item.id !== 0).map((item) => item.id));
                        } else {
                          setBranchId(value.map((item) => item.id));
                        }
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>

            <Grid item xs={12} md={12}>
              <InputLabel required>สิทธิพิเศษ</InputLabel>
              <TextField
                required
                inputProps={{ maxLength: 100 }}
                fullWidth
                name="Name"
                value={Name}
                onChange={(event: any) => setName(event.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.Name && Boolean(formik.errors.Name)}
                helperText={formik.touched.Name && formik.errors.Name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel required>แคมเปญ</InputLabel>
              <TextField
                required
                inputProps={{ maxLength: 100 }}
                fullWidth
                name="NameCall"
                value={NameCall}
                onChange={(event: any) => setNameCall(event.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.Name && Boolean(formik.errors.Name)}
                helperText={formik.touched.Name && formik.errors.Name}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <InputLabel required>หมวดหมู่</InputLabel>
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
                type="number"
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
                        setQuotaLimit(0);
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
                  disabled={WebsiteTrafficPattern === 'AUTO' || WebsiteTrafficPattern === 'CLOSE'}
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
                    setDescription(content); // อัปเดตสถานะเมื่อต่ำกว่าหรือเท่ากับ 85 ตัวอักษร
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
                    inputProps={{ multiple: true }}
                  />
                  <InputLabel
                    htmlFor="file-upload"
                    sx={{
                      background: 'theme.palette.background.default',
                      py: 3.75,
                      px: 0,
                      textAlign: 'center',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      mb: 3,
                      '& > svg': { verticalAlign: 'sub', mr: 0.5 }
                    }}
                  >
                    <CloudUploadIcon /> คลิกเพื่ออัพโหลดรูปภาพ
                  </InputLabel>
                </div>
                <Grid container spacing={3} justifyContent="center">
                  {images.map((image, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <div style={{ width: '200px', height: '250px', position: 'relative', textAlign: 'center' }}>
                        <CardMedia
                          component="img"
                          image={image.src}
                          title={`Product ${index + 1}`}
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {image.file?.name} {/* Display the file name here */}
                        </div>
                        <IconButton onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                          <DisabledByDefaultIcon />
                        </IconButton>
                      </div>
                    </Grid>
                  ))}
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
                    {quota.used_quantity}
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
                    setCodeType(value?.id);
                    if (value?.id === 1) {
                      handleAutoGenerateCode();
                    } else if (value?.id == 2) {
                      setCodeExcelData([]);
                    }
                    //  else if (value?.id == 3) {
                    //   handleAutoGenerateCodeByQuantity();
                    // }

                    // handleOpenCodeExcel();
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={CodeOption.find((Item) => Item.id === CodeType) || null}
                  renderInput={(params) => <TextField {...params} label="การกำหนดโค้ด" />}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  type="button"
                  onClick={handleAutoGenerateCode}
                  component="button" // Add the component prop with the value "button"
                  sx={{
                    background: theme.palette.dark.main,
                    '&:hover': { background: theme.palette.success.dark }
                  }}
                >
                  สร้างโค้ดใหม่
                </Button>
              </Grid>
            </Grid>{' '}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right', display: CodeType === 2 ? 'show' : 'none' }}>
            <Tooltip title="นำเข้าโค้ด">
              <IconButton size="large" onClick={handleOpenCodeExcel}>
                <FileOpenIcon />
                <input type="file" id="excelFileCode" style={{ display: 'none' }} onChange={handleExcelFileCodeChange} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 320 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">ลำดับ</StyledTableCell>
                <StyledTableCell align="left">โค้ด</StyledTableCell>
                <StyledTableCell align="right">จัดการ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codeExcelData.slice(codePage * rowsCodePerPage, codePage * rowsCodePerPage + rowsCodePerPage).map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                    <b>{index + 1}</b>
                  </StyledTableCell>
                  <TableCell>{item.code}</TableCell>

                  <StyledTableCell sx={{ pl: 3 }} component="th" scope="row" align="right">
                    <Grid container sx={{ textAlign: 'right' }} justifyContent={'end'}>
                      <Grid item>
                        {/* edit code */}
                        <Tooltip title="แก้ไขโค้ด">
                          <AnimateButton>
                            <IconButton
                              size="large"
                              onClick={(_event: any) => {
                                handleOpenEditCodeModal(item.id, item.code);
                              }}
                            >
                              <EditTwoToneIcon />
                            </IconButton>
                          </AnimateButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        {/* delete code */}
                        <Tooltip title="ลบโค้ด">
                          <AnimateButton>
                            <IconButton size="large" onClick={() => handleDeleteCode(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </AnimateButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
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
          rowsPerPage={rowsCodePerPage}
          page={codePage}
          onPageChange={handleChangeCodePage}
          onRowsPerPageChange={handleChangeCodeRowsPerPage}
        />
      </MainCard>

      <ModalEditPhoneNumber
        isOpen={openEditPhoneNumberModal}
        isClose={() => setOpenEditPhoneNumberModal(false)}
        onSave={handleSavePhoneNumber}
        primaryId={tempPhoneNumberId}
        phonenumber={tempPhoneNumber}
      />

      <ModalEditCodeNumber
        isOpen={openEditCodeModal}
        isClose={() => setOpenEditCodeModal(false)}
        onSave={handleSaveCode}
        primaryId={tempCodeId}
        code_number={tempCode}
      />

      {type == 'special' && (
        <MainCard title="เลขบัตรประชาชนที่เข้าร่วม" sx={{ marginTop: '50px' }}>
          <Grid container spacing={gridSpacing} sx={{ marginBottom: '20px' }} justifyContent="between">
            <Grid item xs={12} sm={6}>
              <Grid item xs={12} sm={6}>
                <IconButton size="small" sx={{ color: 'green' }}>
                  <CheckBoxIcon />
                </IconButton>
                <Chip label="สำเร็จ" chipcolor="success" sx={{ marginRight: '10px;' }} />
                <Chip label={successIdCardCount.toString()} chipcolor="success" sx={{ marginRight: '10px;' }} />
              </Grid>
              <Grid item xs={12} sm={6} marginTop={2}>
                <IconButton size="small" sx={{ color: 'red' }}>
                  <ErrorIcon />
                </IconButton>
                <Chip label="ล้มเหลว" chipcolor="error" sx={{ marginRight: '10px;' }} />
                <Chip label={errorIdCardCount.toString()} chipcolor="error" sx={{ marginRight: '10px;' }} />
              </Grid>

              {/* product add & dialog */}

              <Tooltip title="เพิ่มเบอร์มือถือ">
                <Fab color="primary" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32, display: 'none' }}>
                  <AddIcon fontSize="small" />
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
              <Tooltip title="นำเข้าเลขบัตรประชาชน">
                <IconButton size="large">
                  <SimCardDownloadIcon onClick={handlExcelFilePhoneNumberClick} />
                  <input type="file" style={{ display: 'none' }} id="excelFilePhoneNumber" onChange={handleExcelFilePhoneNumberChange} />
                </IconButton>
              </Tooltip>
              <Tooltip title="ส่งออกเอกสาร">
                <IconButton size="large" onClick={exportToExcel}>
                  <IosShareIcon />
                </IconButton>
              </Tooltip>

              {/* product add & dialog */}

              <Tooltip title="เพิ่มเบอร์มือถือ">
                <Fab color="primary" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32, display: 'none' }}>
                  <AddIcon fontSize="small" />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
          <TableContainer>
            <Table sx={{ minWidth: 320 }} aria-label="phone number table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">ลำดับ</StyledTableCell>
                  <StyledTableCell sx={{ pl: 3 }}>เลขบัตรประชาชน</StyledTableCell>
                  <StyledTableCell sx={{ pl: 3 }}>การตรวจสอบ</StyledTableCell>
                  <StyledTableCell align="right">จัดการ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ArrayPhoneNumber.slice(phonePage * rowsPhonePerPage, phonePage * rowsPhonePerPage + rowsPhonePerPage).map(
                  (phone, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                        <b>{phone.id}</b>
                      </StyledTableCell>
                      <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                        <b>{phone.phoneNumber}</b>
                      </StyledTableCell>
                      <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                        {phone.validated != '' ? (
                          <b style={{ color: 'red' }}>{phone.validated}</b>
                        ) : (
                          <b style={{ color: 'green' }}>(ผ่าน)</b>
                        )}
                      </StyledTableCell>
                      <StyledTableCell sx={{ pl: 3 }} component="th" scope="row" align="right">
                        <Tooltip title="แก้ไข">
                          <IconButton
                            size="large"
                            onClick={(_event: any) => {
                              handleOpenEditPhoneNumberModal(Number(phone.id), String(phone.phoneNumber));
                            }}
                          >
                            <EditTwoToneIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="ลบ">
                          <IconButton size="large" onClick={() => handleDeletePhoneNumber(phone.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 30, { label: 'All', value: -1 }]}
            component="div"
            count={ArrayPhoneNumber.length}
            rowsPerPage={rowsPhonePerPage}
            page={phonePage}
            onPageChange={handleChangePhonePage}
            onRowsPerPageChange={handleChangePhoneRowsPerPage}
          />
        </MainCard>
      )}

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

export default CampaignForm;
