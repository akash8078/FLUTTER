import React, {
  useEffect,
  useState,
  useRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Platform,
  TextInput,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import ComponentStyles, { normalize } from '../CommonStyle/componentStyle';
import {
  ArrayCheck,
  CButtonShadow,
  CShadowDynamic,
  getLoading,
  getProfilecardOnlineStatusBadgeContainer,
  isBNU,
  isBNUL,
  isNU,
  isNUQ,
  isNUQZ,
  notifyMessage,
  ValueCheck,
} from '../CommonStyle/ComponentFunctions';
import { APIURL, EMRAPI, xrayURL } from '../Common/apiConstants';
import { Global } from '../Common/Global';
import CVectorIcon from '../CustomComponents/CVectorIcon';
import Icons from '../Common/Icons';
import HOverlay from '../HOC/HOverlay';
import Loader from './Loader';
import { Loader as LoaderLocal } from '../CommonStyle/ComponentFunctions';
import NetworkServiceCall from '../Common/NetworkServiceCall';
import moment from 'moment';
import ABlink from '../Alerts/ABlink';
import HOCIcons from '../HOC/HOCIcons';
import FastImage from 'react-native-fast-image';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import CDetailCard from './CDetailCard';
import CChartScanOverlay from '../CustomComponents/CChartScanOverlay';
import CMedications from '../Screens/CMedications';
import HShadowButton from '../HOC/HShadowButton';
import AutoScroll from '@homielab/react-native-auto-scroll';
import DetailsOverlay from '../CustomComponents/DetailsOverlay';

function GetCard(props) {
  const navigation = useNavigation();
  const [data, setData] = useState(props.data);
  const listRef = useRef();
  const [overlay, setOverlay] = useState(false);
  const allocationFlag = data[0]?.allocationflag;
  const getDisplayText = flag => {
    if (flag === 4) return 'CANCEL';
    return 'DEALLOCATE';
  };
  const displayAction = getDisplayText(allocationFlag);
  const [iconsArr, setIconsArr] = useState([
    {
      iconname: 'user-plus', // donor registration / allocation
      stage: 1,
      color: '#33691E', // Deep green - register / allocate
      selected: true,
      displaytext: 'Donor Registration',
      visibility: true,
      functionid: 'BB01',
    },
    {
      iconname: 'clipboard-check', // screening report
      stage: 1,
      color: '#FF8F00', // Amber - important check
      selected: false,
      displaytext: 'Screening Report',
      visibility: true,
      functionid: 'BB02',
    },
    {
      iconname: 'vial', // donation details
      stage: 4,
      color: '#1976D2', // Blue - lab/clinical
      selected: false,
      displaytext: 'Donation Details',
      visibility: true,
      functionid: 'BB03',
    },
    {
      iconname: 'file-medical', // testing & screening results
      stage: 0,
      color: '#C2185B', // Pink - medical test results
      selected: false,
      displaytext: 'Test Results',
      visibility: true,
      functionid: 'BB04',
    },
  ]);

  const [iconsRightArr, setIconsRightArr] = useState([
    {
      iconname: 'id-card', // donor identity card
      stage: 1,
      color: '#2E7D32', // Green - ID/identity
      selected: true,
      displaytext: 'Donor ID Card',
      visibility: true,
      functionid: 'BR01',
    },
    {
      iconname: 'tint', // inventory/blood stock
      stage: 1,
      color: '#F57F17', // Amber - stock
      selected: false,
      displaytext: 'Blood Inventory',
      visibility: true,
      functionid: 'BR02',
    },
    {
      iconname: 'syringe', // transfusion records
      stage: 4,
      color: '#1565C0', // Blue
      selected: false,
      displaytext: 'Transfusion Records',
      visibility: true,
      functionid: 'BR03',
    },
    {
      iconname: 'hospital', // hospital reports
      stage: 0,
      color: '#AD1457', // Pink
      selected: false,
      displaytext: 'Hospital Requests',
      visibility: true,
      functionid: 'BR04',
    },
    {
      iconname: 'file-invoice', // consolidated
      stage: 0,
      color: '#424242', // Gray
      selected: false,
      displaytext: 'Screening',
      visibility: true,
      functionid: 'BR05',
    },
  ]);

  const [activity, setActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [chartScanData, setChartScanData] = useState();
  const [chartScanOverlay, setChartScanOverlay] = useState(false);
  const moveToTop = () => listRef.current.scrollToIndex({ index: 0 });

  const onPressSwipe = (val, blockData) => {
    console.log('kkkkkkkkkk', JSON.stringify(blockData))
    switch (val.functionid) {
      case 'L01':
        navigation.navigate('CCreditAllocation', {
          patientData: blockData?.item?.profilecontent?.[0],
        });
        break;
      case 'L02':
        Global.PatientDetails = blockData.item;
        navigation.navigate('PdfPreview', {
          patientData: blockData?.item?.profilecontent?.[0],
          link: blockData?.item?.creditlink,
          name: val.displaytext,
        });
        break;
      case 'L03':
        Global.PatientDetails = blockData.item;
        navigation.navigate('CConsolidationBill', {
          patientData: blockData?.item?.profilecontent?.[0],
          flag: 1,
          name: val.displaytext,
        });
        break;
      case 'L04':
        Global.PatientDetails = blockData.item;
        navigation.navigate('PdfPreview', {
          patientData: blockData?.item?.profilecontent?.[0],
          link: blockData?.item?.mediseplink,
          name: val.displaytext,
        });
        break;
      case 'R01':
        Global.PatientDetails = blockData.item;
        fetchPdfData(1, blockData?.item?.profilecontent?.[0]);
        break;
      case 'R02':
        Global.PatientDetails = blockData.item;
        fetchPdfData(2, blockData?.item?.profilecontent?.[0]);
        break;
      case 'R03':
        Global.PatientDetails = blockData.item;
        fetchPdfData(3, blockData?.item?.profilecontent?.[0]);
        break;
      case 'R04':
        Global.PatientDetails = blockData.item;
        fetchPdfData(4, blockData?.item?.profilecontent?.[0]);
        break;
      case 'R05':
        console.log('R05 clicked');
        Global.PatientDetails = blockData.item;
        navigation.navigate('CConsolidationBill', {
          patientData: blockData?.item?.profilecontent[0],
          patientbilltypedisplay: [
            'PHARMACY',
            'REGISTRATION',
            'IP',
            'OP',
            'CANTEEN',
            'ADVANCE',
            'REFUND',
            'PRESCRIPTION',
          ],
          patientbilltypevalue: '1,1,1,1,1,1,1,1',
          flag: 2,
          name: val.displaytext,
        });
        break;
      default:
        break;
    }
  };

  const fetchPdfData = async (type, data) => {
    try {
      console.log('Fetching PDF Data:', JSON.stringify(data));
      const { hopapatient, fromdate, todate, hopacredit } = data;
      const buttonapi = `${APIURL}emr/emrcommonget/jrrncommonbillprints ${type},${hopapatient},'${fromdate}','${todate}',${hopacredit},${Global?.userData?.original}`;
      console.log('BUTTONAPI------------------------------------', buttonapi);
      const response = await NetworkServiceCall('get', buttonapi, '');
      console.log(
        'RESPONSEDATA----------------------------------',
        JSON.stringify(response),
      );
      if (response.httpstatus === 200) {
        const billData = response?.data?.bill;
        if (!billData || billData.length === 0) {
          notifyMessage('No Files Found', 4);
          return;
        }
        const transformedData = transformJson(billData)?.data;
        props.navigation.navigate('CPdfGallery', {
          index: 5,
          displayarray: transformedData,
        });
      } else {
        console.log('failed');
        notifyMessage('Fetch error', 4);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError?.(err.message); // Safe call if setError is defined
    }
  };

  useEffect(() => {
    setData(props.data);
  }, [props]);

  const newData =
    isBNUL(data) &&
    data.filter(function (item) {
      var badge =
        isBNUL(item.profilecontent) &&
          ValueCheck(item.profilecontent[0][props.filter])
          ? item.profilecontent[0][props.filter]
          : '';
      var patientno =
        isBNUL(item.profilecontent) &&
          ValueCheck(item.profilecontent[0].patientno)
          ? item.profilecontent[0].patientno
          : '';
      var patientna =
        isBNUL(item.profilecontent) && isNU(item.profilecontent[0].patientname)
          ? item.profilecontent[0].patientname
          : '';
      var patientty =
        isBNUL(item.profilecontent) && isNU(item.profilecontent[0].patienttype)
          ? item.profilecontent[0].patienttype
          : '';
      var patientcr =
        isBNUL(item.profilecontent) && isNU(item.profilecontent[0].credit)
          ? item.profilecontent[0].credit
          : '';
      var patientag =
        isBNUL(item.profilecontent) && isNU(item.profilecontent[0].age)
          ? item.profilecontent[0].age
          : '';
      var patientge =
        isBNUL(item.profilecontent) && isNU(item.profilecontent[0].gender)
          ? item.profilecontent[0].gender
          : '';
      const dataItem = badge + '' + patientna + ' ' + patientno + ' ' + patientty + ' ' + patientcr + ' ' + patientag + ' ' + patientge + ' ';
      const textData = props.search != null ? props.search.toUpperCase() : '';
      return dataItem.indexOf(textData) > -1;
    });

  const handleUpdatedData = updatedData => {
    // console.log('Updated Data in CCard:', JSON.stringify(updatedData));
    // Forward updated data to the parent component if callback exists
    if (props.callback) {
      props.callback(updatedData);
    }
  };

function getSpelling(data) {
  const status = data?.toUpperCase() || data || '';
  
  // General Medical Statuses
  if (status === 'FIRST VISIT') {
    return ['N', 'e', 'w'];
  } else if (status === 'RENEWAL') {
    return ['R', 'e', 'n', 'e', 'w', 'a', 'l'];
  } else if (status === 'CROSS CONSULTATION') {
    return ['C', 'r', 'o', 's', 's', '.', 'C'];
  } else if (status === 'REVISIT') {
    return ['R', 'e', 'v', 'i', 's', 'i', 't'];
  } else if (status === 'REGISTRATION') {
    return ['R', 'e', 'g'];
  } else if (status === 'REFFERED') {
    return ['R', 'e', 'f', 'e', 'r', 'r', 'e', 'd'];
  } else if (status === 'OPINION VISIT') {
    return ['O', 'p', 'i', 'n', 'i', 'o', 'n', 'V'];
  } else if (status === 'ROUNDS') {
    return ['R', 'o', 'u', 'n', 'd', 's'];
  } else if (status === 'DEPARTMENT REGISTRATION') {
    return ['D', 'e', 'p', 't', '.', 'R', 'e', 'g'];
  } else if (status === 'ADMISSION') {
    return ['A', 'd', 'm', 'i', 's', 's', 'i', 'o', 'n'];
  } else if (status === 'MLC') {
    return ['M', 'L', 'C'];
  } else if (status === 'BOOKING') {
    return ['A', 'p', 'p', 'o', 'i', 'n', 't', 'm', 'e', 'n', 't'];
  
  // 🩸 BLOOD BANK STATUSES
  } else if (status === 'BLED') {
    return ['B', 'l', 'e', 'd'];
  } else if (status === 'NOTBLED' || status === 'NOT BLED') {
    return ['N','o','t','B','l','e','d'];
  } else if (status === 'REJECTED') {
    return ['R', 'e', 'j', 'e', 'c', 't', 'e', 'd'];
  } else if (status === 'DEFERRED') {
    return ['D', 'e', 'f', 'e', 'r', 'r', 'e', 'd'];
  } else if (status === 'REGISTERED') {
    return ['R', 'e', 'g', 'i', 's', 't', 'e', 'r', 'e', 'd'];
  } else if (status === 'SCREENING') {
    return ['S', 'c', 'r', 'e', 'e', 'n', 'i', 'n', 'g'];
  } else if (status === 'ELIGIBLE') {
    return ['E', 'l', 'i', 'g', 'i', 'b', 'l', 'e'];
  
  // Default case
  } else {
    return ['N', '/', 'A'];
  }
}





  function getXRay(data) {
    Global.PatientDetails = data.item;

    if (Platform.OS === 'android') {
      getXrayInAppBrowser(data.item.xraylink);
    } else {
      props.navigation.navigate('CXRay', { data: { link: data.item.xraylink } });
    }

    // props.navigation.navigate('CBrowser', { data: { link: data.item.xraylink } })

    // props.navigation.navigate('CBrowser', { data: { link:  'https://pacs.amalaims.org/pacsapi/Launch_Viewer?Username=hisuser&Password=hisuser&patientid=2080079' } })
  }

  function getLabResults(data, type) {
    Global.PatientDetails = data.item;
    props.navigation.navigate('CValueSummary', { type: type });
  }

  function getInvestigations(patientitem) {
    Global.PatientDetails = patientitem;
    props.navigation.navigate('CValueSummary');
  }

  function getConsultationScreenData(patientitem) {
    console.log('1');
    if (ValueCheck(patientitem.detailapi)) {
      Global.EditStatus = null;
      Global.PatientDetails = patientitem;
      props.navigation.navigate('Consultation', {
        chartscan: props.chartscan ? true : false,
      });
    }
  }

  function getChartScanScreenData(patientitem, detailcardinfo, admissiontype) {
    if (ValueCheck(patientitem.detailapi)) {
      if (
        isNU(Global.userData.hosuconsultant) &&
        isNU(Global.userData.suuser) &&
        isNU(patientitem.hopapatient) &&
        isNU(detailcardinfo.homrpatientchart) &&
        isNU(detailcardinfo.hopaconsultationtype)
      ) {
        const buttonapi =
          APIURL +
          'emr/emrcommonget/rnhomrchartscan ' +
          patientitem.hopapatient +
          ',' +
          detailcardinfo.homrpatientchart +
          ',' +
          Global.userData.hosuconsultant +
          ',' +
          Global.userData.suuser +
          ',' +
          detailcardinfo.hopaconsultationtype;
        Global.EditStatus = null;
        Global.PatientDetails = {
          ...patientitem,
          cardbottomarray: null,
        };
        props.navigation.navigate('Consultation', {
          chartscan: true,
          customlink: buttonapi,
          admissiontype: admissiontype,
          detailinfo: {
            item: {
              ...detailcardinfo,
            },
          },
        });
      }

      // console.log('hosuconsultant - ', Global.userData.hosuconsultant, 'suuser - ', Global.userData.suuser, patientitem.hopapatient, detailcardinfo)

      // Global.userData.hosuconsultant
      // Global.userData.suuser

      // http://122.15.161.229:9192/emr/emrcommonget/rnhomrchartscan%204646258,6215783,7,176,3
    }
  }

  function getChartScanFiles(patientitem, detailcardinfo) {
    if (ValueCheck(patientitem.detailapi)) {
      if (
        isNU(Global.userData.hosuconsultant) &&
        isNU(Global.userData.suuser) &&
        isNU(patientitem.hopapatient) &&
        isNU(detailcardinfo.homrpatientchart)
      ) {
        setIsLoading(true);
        setChartScanData();

        let fromdate = "''";
        let todate = "''";

        let buttonapi =
          APIURL +
          'emr/emrcommonget/rnhomrchartfiles ' +
          patientitem.hopapatient +
          ',' +
          detailcardinfo.homrpatientchart +
          ',' +
          1 +
          ',' +
          fromdate +
          ',' +
          todate +
          ',' +
          "'',''";

        console.log('getChartScan buttonapi', buttonapi);

        NetworkServiceCall('get', buttonapi, '').then(function (response) {
          if (
            response.httpstatus == 200 &&
            isNU(response.data) &&
            isBNUL(response.data.data)
          ) {
            // let jsondata = {
            //     'heading': 'CHART SCAN',
            //     'icongroup': 3,
            //     'icon': 'scanner',
            //     'datearray': [
            //         {
            //             'heading': 'Array 1',
            //             'icon': 'file-alt',
            //             'hideheading': true,
            //             'naturearray': [
            //                 {
            //                     'heading': 'Array 2',
            //                     'icon': 'file-alt',
            //                     'hideheading': true,
            //                     'filetypearray': response.data.data
            //                 },
            //             ]
            //         }
            //     ]
            // }

            let jsondata = {
              heading: 'CHART SCAN',
              icongroup: 3,
              icon: 'scanner',
              datearray: [
                {
                  heading: 'Array 1',
                  icon: 'file-alt',
                  hideheading: true,
                  naturearray: response.data.data,
                },
              ],
            };
            console.log('jsondata', JSON.stringify(jsondata));
            setChartScanData(jsondata);

            setIsLoading(false);
            setTimeout(() => {
              setChartScanOverlay(true);
            });
          } else {
            setIsLoading(false);
            notifyMessage('No Files Available.');
          }
        });

        // const buttonapi = APIURL + 'emr/emrcommonget/rnhomrchartscan ' + patientitem.hopapatient + ',' + detailcardinfo.homrpatientchart + ',' + Global.userData.hosuconsultant + ',' + Global.userData.suuser + ',' + detailcardinfo.hopaconsultationtype;

        // Global.EditStatus = null
        // Global.PatientDetails = patientitem
        // props.navigation.navigate('Consultation', {
        //     chartscan: true,
        //     customlink: buttonapi
        // })
      }
    }
  }

  function getMedication(patientitem) {
    Global.PatientDetails = patientitem;
    props.navigation.navigate('CalendarMedications');
  }

  function getOverlayScreen() {
    // setOverlay(true)
  }

  const keyExtractor = useCallback(item => item.datalistid.toString(), []);

  function fnMapStatus(i, array) {
    isBNUL(array)
      ? array.filter((val, k) => {
        val.inconsultation != null &&
          val.inconsultation != undefined &&
          k != i
          ? (val.inconsultation = false)
          : null;
      })
      : null;
  }

  function getTokenStatusList(val) {
    let buttonapi = EMRAPI.getPatientData + Global.userData.hosuconsultant;
    console.log('getPatientData buttonapi', buttonapi);

    NetworkServiceCall('get', buttonapi, '').then(function (response) {
      console.log(
        'RESPONSEEEEEEEE patienttoken status',
        JSON.stringify(response),
      );
      if (isNU(response.data) && isBNUL(response.data.data)) {
        const array2Map = new Map(
          response.data.data.map(item => [
            item.hopapatient,
            item.patientstatus,
          ]),
        );

        val.forEach(item => {
          if (array2Map.has(item.hopapatient)) {
            item.patientstatus = array2Map.get(item.hopapatient);
          }
        });
      } else {
      }
    });
  }

  function savePatientConsultation(blockData, array) {
    setIsLoading(true);
    let output = {
      groups: {
        procedurename: 'hopaconsultation1',
        hosuconsultant: Global.userData.hosuconsultant,
        hopapatient: blockData.item.hopapatient,
      },
    };

    let buttonapi = APIURL + 'commondelete/RnCommonDelete';
    console.log('output', output, buttonapi);

    getTokenStatusList(array);

    NetworkServiceCall('post', buttonapi, output).then(function (response) {
      console.log('response of saved.....', JSON.stringify(response));
      if (response.httpstatus == 200) {
        fnMapStatus(blockData.index, newData);
        blockData.item.consultationstart = true;
        blockData.item.inconsultation = true;
        setIsLoading(false);
        ValueCheck(props.medications)
          ? getMedication(blockData.item)
          : props.disableTouch != undefined && props.disableTouch != null
            ? getOverlayScreen()
            : ValueCheck(props.type) && props.type == 1
              ? getInvestigations(blockData.item)
              : getConsultationScreenData(blockData.item);
      } else {
        notifyMessage('Data not saved', 2);
        setIsLoading(false);
      }
    });
    getLoading(v => setIsLoading(false));
  }

  function fnGetConsultaionAdmissionHistory(blockData) {
    if (isNU(blockData.item.hopapatient)) {
      let buttonapi =
        EMRAPI.getConsultationAdmissionHistory + blockData.item.hopapatient;
      console.log('fnGetConsultaionAdmissionHistory', buttonapi);
      NetworkServiceCall('get', buttonapi, '').then(function (response) {
        if (isNU(response.data)) {
          blockData.item.cardbottomviewloading = false;
          blockData.item.cardbottomviewdata = {
            consultationdetails: isBNUL(response.data.consultationdetails)
              ? response.data.consultationdetails
              : [],
            admissiondetails: isBNUL(response.data.admissiondetails)
              ? response.data.admissiondetails
              : [],
            appointmentdetails: isBNUL(response.data.appointmentdetails)
              ? response.data.appointmentdetails
              : [],
          };

          setRefresh(0);
          setTimeout(() => {
            setRefresh(refresh + 1);
          });
        } else {
          blockData.item.cardbottomviewloading = false;

          setRefresh(0);
          setTimeout(() => {
            setRefresh(refresh + 1);
          });
        }
      });
    } else {
      blockData.item.cardbottomviewloading = false;
      notifyMessage('Data Not Found.');
    }
  }

  function NavigateToPatientChart(
    blockData,
    specificnature,
    customdate,
    fromdate,
    todate,
  ) {
    console.log(
      'NavigateToPatientChart.....',
      JSON.stringify(blockData.item.detailapi),
    );

    setIsLoading(true);
    Global.consultationapi = blockData.item.detailapi;
    Global.PatientDetails = blockData.item;
    setTimeout(() => {
      console.log('lllllll', specificnature, customdate, fromdate, todate);

      navigation.navigate('ChartScreenNew', {
        specificnature: specificnature,
        customdate: customdate ? true : false,
        fromdate: fromdate,
        todate: todate,
      });
      console.log('hhhhh');
      setIsLoading(false);
    }, 2000);
  }

  function navigateToVitalSignReport(blockData) {
    setIsLoading(true);
    Global.consultationapi = blockData.item.detailapi;
    Global.PatientDetails = blockData.item;
    setTimeout(() => {
      navigation.navigate('PdfPreview', {
        headerblockstyle: { marginBottom: normalize(35) },
        // 'link': APIURL + "jremr/jrcommonreport/jrhosuconsultanttokenreport(0," + Global.userData.hosuconsultant + ")/0/consulttoken",
        link: `${APIURL}jremr/jrcommonreport/rnhopapatientvitalsign(${blockData.item.hopapatient},${blockData.item.homrpatientchart},NULL,NULL,NULL,1)/0/VitalSignDetail`,
      });
      setIsLoading(false);
    });
  }

  function FnChangeTab(array, i) {
    isBNUL(array)
      ? array.filter((val, k) => {
        val.selected = false;
      })
      : null;
  }

  function renderAdmissionConsultationlist(array, blockData, admissiontype) {
    return (
      <ScrollView nestedScrollEnabled={true}>
        {isBNUL(array) ? (
          <FlatList
            nestedScrollEnabled={true}
            data={array}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            renderItem={val =>
              renderEachAdmissionConsultation(val, blockData, admissiontype)
            }
          />
        ) : null}
      </ScrollView>
    );
  }

  function renderEachAdmissionConsultation(val, blockData, admissiontype) {
    return (
      <CDetailCard
        consultation={props.consultation ? true : false}
        val={val}
        blockData={blockData}
        admissiontype={admissiontype}
        NavigateToPatientChart={NavigateToPatientChart}
        getXRay={getXRay}
        getLabResults={getLabResults}
        chartscancallback={(blockData1, detailcardinfo) => {
          getChartScanScreenData(blockData.item, detailcardinfo, admissiontype);
        }}
        chartscanfilescallback={(blockData, detailcardinfo) => {
          getChartScanFiles(blockData.item, detailcardinfo);
        }}
      />
    );
  }

  const transformJson = input => {
    return {
      data: input
        .map(({ uploaddate, filename }) => {
          return {
            filename: uploaddate || '',
            filelink: filename,
          };
        })
        .filter(item => isNUQ(item.filename) && isNUQ(item.filelink)),
    };
  };

  function CardOnpress(blockData, array) {
    if (ValueCheck(props.medications)) {
      getMedication(blockData.item);
    } else if (props.disableTouch != undefined && props.disableTouch != null) {
      getOverlayScreen();
    } else if (ValueCheck(props.type) && props.type == 1) {
      getInvestigations(blockData.item);
    } else if (props.medicationoption) {
      if (isBNUL(blockData.item.medication)) {
        blockData.item.medication = [];
      } else {
        blockData.item.medication = [
          { code: 1, name: 'PRESCRIPTION', selected: true },
          { code: 2, name: 'PATIENT SERVICE', selected: false },
          { code: 3, name: 'DIET', selected: false }
        ];
      }
      setRefresh(0);
      setTimeout(() => {
        setRefresh(refresh + 1);
      });
      props.callback([]);
    } else if (blockData.item.profilecontent[0].patienttype === 'DONOR') {
      // 🩸 BLOOD BANK: Navigate to DonorScreening with complete donor data
      console.log(
        '🩸 DONOR CARD CLICKED - Full blockData:',
        JSON.stringify(blockData.item, null, 2)
      );

      const pc = blockData.item.profilecontent?.[0] || {};
      const left = blockData.item.leftcontent?.[0] || {};
      const right = blockData.item.rightcontent?.[0] || {};

      navigation.navigate('DonorScreening', {
        selectedDonor: {
          donorID: pc.patientno || 'N/A',
          donorName: pc.patientname || 'N/A',
          age: pc.age || 'N/A',
          gender: pc.gender || 'N/A',
          mobile: pc.mobileno || 'N/A',
          place: pc.place || 'N/A',
          admitteddoctor: pc.admitteddoctor || 'Blood Bank Staff',
          subheading3: pc.subheading3 || 'N/A',
          patientimage: pc.patientimage || '',

          bloodGroup: left.value || 'Unknown',
          lastDonation: right.value === 'N/A'
            ? 'First time donor'
            : right.value || 'First time donor',

          // System Fields
          hopapatient: blockData.item.hopapatient,
          datalistid: blockData.item.datalistid,
          bordercolor: blockData.item.bordercolor,
          verified: blockData.item.verified,

          // Complete raw data for debugging
          fullBlockData: blockData.item
        },
        prefilledData: true,
        fetchFromAPI: true,
      });
    } else {
      getConsultationScreenData(blockData.item);
    }
  }




  const getDiagnosisText = array => {
    return array
      .map((item, index) => {
        const diagnoses = isBNUL(item.icd)
          ? item.icd
            .map(icdItem =>
              isNUQ(icdItem.displayvalue) ? icdItem.displayvalue : '',
            )
            .join(' , ')
          : ''; // Join ICD texts with commas
        return `${isNU(item.diagnosisname) ? item.diagnosisname : ''
          } - ${diagnoses}`; // Return the formatted diagnosis string
      })
      .join(' , '); // Join all diagnosis blocks with commas
  };

  function generateArray() {
    // const len = 5;

    // const arrayP = Array.from({ len }, (_, index) => ({

    //     image: '310325044356861.jpg',
    //     sortorder: "1",
    //     nature: "1",
    //     consultation: "1",
    //     hosuconsultation: 525816,
    //     consultationdate: "26-03-2025",
    //     consultant: 'DR MATHEW K C',
    //     consultationtype: 'C',

    //     key: index + 1, // The key will be the index + 1
    // }));

    const length = 5; // Specify the length of the array

    const arrayWithKeys = Array.from({ length }, (_, index) => ({
      key: index + 1, // The key will be the index + 1
      image: '310325044356861.jpg',
      sortorder: '1',
      nature: '1',
      consultation: '1',
      hosuconsultation: 525816,
      consultationdate: '26-03-2025',
      consultant: 'DR MATHEW K C',
      consultationtype: 'C',
    }));

    return arrayWithKeys;
  }

  function getChartEditor(blockData) {
    Global.PatientDetails = blockData;

    let buttonapi =
      APIURL +
      'emr/emrcommonget/rnhomrchartfiles ' +
      blockData.hopapatient +
      ',' +
      null +
      ',' +
      3 +
      ',' +
      "'',''" +
      ",'',''";
    console.log('buttonapi..........', buttonapi);
    setIsLoading(true);

    NetworkServiceCall('get', buttonapi, '').then(function (response) {
      if (response.httpstatus == 200) {
        if (
          isNU(response.data) &&
          isBNUL(response.data.consultation) &&
          isNU(response.data.consultation) &&
          response.data.consultation[0].datavalue &&
          response.data.consultation[0].consultationtype
        ) {
          navigation.navigate('CFilesEditor', {
            index: 0,
            imagelink: isNUQ(response.data.imagelink)
              ? response.data.imagelink
              : APIURL + 'file/getFile/image/',
            displayarray: isBNUL(response.data.imagearray)
              ? response.data.imagearray
              : [], //generateArray(),
            consultation: isBNUL(response.data.consultation)
              ? response.data.consultation
              : [],
          });
          setIsLoading(false);
        } else {
          notifyMessage('Consultation Not Found');
          setIsLoading(false);
        }
      } else {
        notifyMessage('Network Error', 2);
        setIsLoading(false);
      }
    });
  }

  // Left swipe view (revealed on swiping right)
  const renderLeftActionDisplay = (blockData, array) => (
    <View
      style={{
        width: '50%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
      }}>
      {isBNUL(iconsArr)
        ? iconsArr.map((iconsFoot, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPressSwipe(iconsFoot, blockData)}
              style={{
                height: '100%',
                width: '20%',
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 0,
                borderColor: 'lightgrey',
                margin: '1%',
                ...CShadowDynamic(-3, 3, 5, 0, Global.AppTheme.primary_color),
                borderTopLeftRadius: i === 0 ? 5 : 0,
                borderBottomLeftRadius: i === 0 ? 5 : 0,
                borderTopRightRadius: i === iconsArr.length - 1 ? 5 : 0,
                borderBottomRightRadius: i === iconsArr.length - 1 ? 5 : 0,
              }}>
              <View style={styles.iconContainer}>
                <Icons.FontAwesome5
                  name={iconsFoot.iconname}
                  size={normalize(20)}
                  color={iconsFoot.color}
                />
                <Text style={styles.iconLabel}>{iconsFoot.displaytext}</Text>
              </View>
            </TouchableOpacity>
          );
        })
        : null}
    </View>
  );

  // Right swipe view (revealed on swiping left)
  const renderRightActionDisplay = (blockData, array) => (
    <View
      style={{
        width: '50%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
      }}>
      {isBNUL(iconsRightArr)
        ? iconsRightArr.map((iconsFoot, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPressSwipe(iconsFoot, blockData)}
              style={{
                height: '100%',
                width: '20%',
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 0,
                borderColor: 'lightgrey',
                margin: '1%',
                ...CShadowDynamic(-3, 3, 5, 0, Global.AppTheme.primary_color),
                borderTopLeftRadius: i === 0 ? 5 : 0,
                borderBottomLeftRadius: i === 0 ? 5 : 0,
                borderTopRightRadius: i === iconsRightArr.length - 1 ? 5 : 0,
                borderBottomRightRadius:
                  i === iconsRightArr.length - 1 ? 5 : 0,
              }}>
              <View style={styles.iconContainer}>
                <Icons.FontAwesome5
                  name={iconsFoot.iconname}
                  size={normalize(20)}
                  color={iconsFoot.color}
                />
                <Text style={styles.iconLabel}>{iconsFoot.displaytext}</Text>
              </View>
            </TouchableOpacity>
          );
        })
        : null}
    </View>
  );

  const renderVisibleRow = (blockData, array) => (
    <View>
      <TouchableHighlight
        style={[
          {
            // height: normalize(40),
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            flex: 1,
            borderColor: blockData.item.verified == true ? 'green' : '#094485',
          },
          props.type != undefined && props.type == 2
            ? { ...CButtonShadow() }
            : { ...CButtonShadow() },
        ]}
        activeOpacity={0.5}
        underlayColor={'white'}
        disabled={
          blockData.item.verified || props.disabled || props.chartscan
            ? true
            : false
        }
        onPress={() => CardOnpress(blockData, array)}
        onLongPress={() =>
          navigation.navigate('CAddUser', {
            patientData: blockData?.item,
            type: 2,
          })
        }>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 0,
          }}>
          <View
            style={{
              backgroundColor:
                props.type != undefined && props.type == 1
                  ? '#fff'
                  : blockData.item.verified
                    ? '#f5fffa'
                    : blockData.item.profilecontent[0].patienttype == 'IP'
                      ? '#fffafa'
                      : props.type != undefined && props.type == 2
                        ? '#fff'
                        : '#f7fbff',
              borderRadius: 10,
              borderColor: 'white',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              // minHeight: normalize(45),
            }}>
            <View
              style={{
                zIndex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                left: normalize(22),
              }}>
              <Icons.MaterialCommunityIcons
                name={'chevron-left'}
                size={normalize(18)}
                color={'grey'}
                style={{ opacity: 1 }}
              />
            </View>

            {blockData.item.verified ? (
              <View
                style={{
                  borderBottomLeftRadius: 10,
                  borderTopStartRadius: 10,
                  backgroundColor: 'green',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3%',
                  flexDirection: 'column',
                }}>
                {['V', 'e', 'r', 'i', 'f', 'i', 'e', 'd'].map((item, i) => {
                  return (
                    <Text
                      key={i}
                      style={{
                        fontSize: normalize(5),
                        lineHeight: normalize(6),
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  );
                })}
              </View>
            ) : blockData.item.profilecontent[0].patienttype == 'IP' ? (
              <View
                style={{
                  borderBottomLeftRadius: 10,
                  borderTopStartRadius: 10,
                  backgroundColor: '#ea6767',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3%',
                  flexDirection: 'column',
                }}>
                {['R', 'O', 'U', 'N', 'D', 'S'].map((item, i) => {
                  return (
                    <Text
                      key={i}
                      style={{
                        fontSize: normalize(6),
                        lineHeight: normalize(7),
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  borderBottomLeftRadius: 10,
                  borderTopStartRadius: 10,
                  backgroundColor: (() => {
                    const logo = blockData.item.profilecontent?.[0].logo1?.toUpperCase() || "";

                    if (logo === "BLED") return "#FF0000"; // Red
    if (logo === "NOTBLED" || logo === "NOT BLED") return "#28a745"; // Green
    if (logo === "REJECTED") return "#FFA500"; // Orange
    
    // Other Medical Status Colors
    if (logo === "FIRST VISIT") return "#094485";
    if (logo === "RENEWAL" || logo === "REVISIT") return "#3b86db";
    if (logo === "MLC") return "#FF0000";
    if (logo === "BOOKED" || logo === "BOOKING") return "#7a1241";
                     // 🔴 Always red
                    return "#3b86db"; // default color
                  })(),
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3%",
                  flexDirection: "column",
                }}
              >
                {getSpelling(blockData.item.profilecontent[0].logo1).map(
                  (item, k) => {
                    return (
                      <Text
                        key={k}
                        style={{
                          textShadowColor: 'black',
                          textShadowRadius: 1,
                          textShadowOffset: { width: 0, height: 1 },
                          textAlign: 'center',
                          fontSize: normalize(6),
                          lineHeight: normalize(7),
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        {item}
                      </Text>
                    );
                  },
                )}
              </View>
            )}

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                borderWidth: 0,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 0,
                  width: '70%',
                }}>
                <View
                  style={{
                    borderWidth: 0,
                    alignItems: 'center',
                    marginHorizontal: normalize(7),
                  }}>
                  <TouchableWithoutFeedback>
                    <View
                      style={{
                        borderWidth: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          NavigateToPatientChart(
                            blockData,
                            null,
                            false,
                            '',
                            '',
                          );
                        }}
                        style={{
                          marginLeft: normalize(5),
                          borderWidth: 0,
                          borderColor: blockData.item.verified
                            ? 'green'
                            : blockData.item.profilecontent[0].patienttype ==
                              'IP'
                              ? '#ea6767'
                              : '#040d16ff',
                          borderRadius: 1000,
                        }}>
                        {/* {console.log('JJJJJJJJJJJJJJJJ',JSON.stringify(blockData.item.profilecontent[0]))} */}
                        <FastImage
                          style={{
                            width: normalize(30),
                            height: normalize(30),
                            borderRadius: 1000,
                            resizeMode: 'contain',
                            borderWidth: 0,
                          }}
                          source={
                            isNUQ(blockData.item.profilecontent[0].patientimage)
                              ? {
                                uri:
                                  EMRAPI.getPatientProfile +
                                  blockData.item.profilecontent[0]
                                    .patientimage,
                              }
                              : blockData.item.profilecontent[0].gender ==
                                'MALE'
                                ? require('../Asset/Icons/Male(2).png')
                                : require('../Asset/Icons/FemaleI(1).png')
                          }
                        />
                        {console.log("photoapi", EMRAPI.getPatientProfile +
                          blockData.item.profilecontent[0]
                            .patientimage)}
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 0,
                    }}>
                    {isBNU(blockData.item.profilecontent[0].patientno) ? (
                      <Menu>
                        <MenuTrigger customStyles={{ triggerWrapper: {} }}>
                          <Text
                            selectable
                            style={{
                              fontSize: normalize(11),
                              color: 'black',
                              fontWeight: 'bold',
                              lineHeight: normalize(14),
                              letterSpacing: 0,
                            }}>
                            {blockData.item.profilecontent[0].patientno}
                          </Text>
                        </MenuTrigger>
                        <MenuOptions
                          optionsContainerStyle={{
                            marginTop: normalize(15),
                          }}
                          customStyles={{
                            optionsContainer: {
                              width: '30%',
                              backgroundColor: '#f0f0f0',
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: 'lightgrey',
                            },
                            optionText: {},
                          }}>
                          <View
                            style={{
                              borderWidth: 0,
                              padding: normalize(5),
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                letterSpacing: 5,
                                fontSize: normalize(15),
                                color: 'black',
                                fontWeight: 'bold',
                              }}
                              selectable>
                              {blockData.item.profilecontent[0].patientno}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <HOCIcons.Feather
                                name={'info'}
                                size={normalize(10)}
                                color={'grey'}
                                style={{ marginHorizontal: normalize(3) }}
                              />
                              <Text
                                style={{
                                  color: 'grey',
                                  fontSize: normalize(8),
                                  fontStyle: 'italic',
                                }}>
                                long press to copy
                              </Text>
                            </View>
                          </View>
                        </MenuOptions>
                      </Menu>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsLoading(true);
                      Global.PatientDetails = blockData.item;
                      setTimeout(() => {
                        navigation.navigate('RegistrationDetails', {
                          headerblockstyle: {
                            marginBottom: normalize(35),
                          },
                        });
                        setIsLoading(false);
                      });
                    }}
                    style={{ margin: normalize(2), borderWidth: 0 }}>
                    <Text
                      style={{
                        fontSize: normalize(9),
                        fontFamily: Global.fontNormal,
                        color: 'black',
                      }}>
                      {'View Profile'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    borderWidth: 0,
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 0,
                      padding: 0,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontWeight: 'bold',
                        fontSize: normalize(14),
                        paddingLeft: normalize(5),
                        color: Global.AppTheme.primary_color,
                        lineHeight: normalize(14),
                      }}>
                      {blockData.item.profilecontent[0].patientname}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      {isBNUL(blockData.item.profilecontent) &&
                        isBNUL(blockData.item.profilecontent[0].infectioncontrol)
                        ? blockData.item.profilecontent[0].infectioncontrol.map(
                          (data, i) => {
                            return (
                              <Text
                                key={i}
                                style={{
                                  fontSize: normalize(12),
                                  color: 'red',
                                }}>
                                {' '}
                                {data.infectioncontrol != undefined
                                  ? '(' + data.infectioncontrol + ')'
                                  : '' + ' '}
                              </Text>
                            );
                          },
                        )
                        : null}
                    </View>
                  </View>
// In CCard.js, replace the age/gender section with this:

                  // Find this section around line 1200+ in the renderVisibleRow function:
                  <View
                    style={{
                      flexDirection: 'column', // Changed from 'row' to 'column'
                      justifyContent: 'flex-start', // Changed from 'center'
                      alignItems: 'flex-start', // Changed from 'center'
                      borderWidth: 0,
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(10),
                        paddingLeft: normalize(5),
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      Age: {blockData.item.profilecontent[0].age}
                    </Text>
                    <Text
                      style={{
                        fontSize: normalize(10),
                        paddingLeft: normalize(5),
                        fontWeight: 'bold',
                        color: 'black',
                        marginTop: normalize(2), // Add small spacing between age and gender
                      }}>
                      Gender: {blockData.item.profilecontent[0].gender}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderWidth: 0,
                      width: '100%',
                      paddingRight: normalize(10),
                    }}>
                    {isNUQ(blockData.item.profilecontent[0].packagename) ? (
                      <View
                        style={{
                          height: normalize(15),
                          ...CShadowDynamic(
                            -2,
                            2,
                            4,
                            -1,
                            Global.AppTheme.primary_color,
                          ),
                          borderWidth: 0.5,
                          borderRadius: 5,
                          backgroundColor: '#d7ffc9',
                          paddingHorizontal: normalize(5),
                          marginHorizontal: normalize(3),
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '35%',
                        }}>
                        <HOCIcons.Icons
                          name={'hand-holding-usd'}
                          icongroup={5}
                          size={normalize(7)}
                          color={Global.AppTheme.primary_color}
                          style={{
                            marginHorizontal: normalize(3),
                            textAlign: 'center',
                          }}
                        />
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={{
                            fontSize: normalize(10),
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {blockData.item.profilecontent[0].packagename}
                          {/* {blockData?.item?.profilecontent[0]?.concession} */}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: normalize(5),
                          marginHorizontal: normalize(3),
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '35%',
                        }}></View>
                    )}

                    {isNUQ(blockData.item.profilecontent[0].credit) ? (
                      <View
                        style={{
                          height: normalize(15),
                          ...CShadowDynamic(
                            -2,
                            2,
                            4,
                            -1,
                            Global.AppTheme.primary_color,
                          ),
                          borderWidth: 0,
                          borderRadius: 5,
                          backgroundColor: '#fca7a7',
                          paddingHorizontal: normalize(5),
                          marginHorizontal: normalize(3),
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '30%',
                        }}>
                        <HOCIcons.Icons
                          name={'money-bill-alt'}
                          icongroup={5}
                          size={normalize(7)}
                          color={Global.AppTheme.primary_color}
                          style={{
                            marginHorizontal: normalize(3),
                            textAlign: 'center',
                          }}
                        />
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={{
                            fontSize: normalize(10),
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {blockData.item.profilecontent[0].credit}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: normalize(5),
                          marginHorizontal: normalize(3),
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '35%',
                        }}></View>
                    )}
                  </View>
                  {isBNUL(blockData.item.diagnosis) ? (
                    <View style={{ width: '100%' }}>
                      <AutoScroll delay={0} duration={20000}>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingLeft: normalize(0),
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: normalize(12),
                                fontStyle: 'italic',
                                color: Global.AppTheme.primary_color,
                                paddingLeft: normalize(5),
                              }}>
                              {getDiagnosisText(blockData.item.diagnosis)}
                            </Text>
                          </View>
                        </View>
                      </AutoScroll>
                    </View>
                  ) : null}

                  {isBNUL(blockData.item.profilecontent) &&
                    isNU(blockData.item.profilecontent[0].mobileno) ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderWidth: 0,
                        alignItems: 'center',
                      }}>
                      <HOCIcons.Icons
                        icongroup={5}
                        size={normalize(7)}
                        name={'phone-alt'}
                        color={Global.AppTheme.primary_color}
                        style={{
                          marginHorizontal: normalize(4),
                          textAlign: 'center',
                        }}
                      />
                      <Text
                        style={{
                          fontSize: normalize(10),
                          color: 'black',
                          fontWeight: 'normal',
                        }}>
                        {isNU(blockData.item.profilecontent[0].mobileno)
                          ? blockData.item.profilecontent[0].mobileno
                          : null}
                      </Text>
                      {isNUQ(blockData.item.profilecontent[0].subheading3) ? (
                        <Icons.FontAwesome5
                          name={'home'}
                          color={Global.AppTheme.primary_color}
                          size={normalize(7)}
                          style={{
                            marginHorizontal: normalize(5),
                            textAlign: 'center',
                          }}
                        />
                      ) : null}
                      <Text
                        style={{
                          fontSize: normalize(10),
                          fontWeight: 'normal',
                          color: 'black',
                        }}>
                        {blockData.item.profilecontent[0].subheading3}
                      </Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'flex-end',
                      position: 'absolute',
                      right: normalize(15),
                      top: normalize(4),
                    }}>
                    {ValueCheck(blockData.item.investigations) &&
                      ArrayCheck(blockData.item.investigations)
                      ? blockData.item.investigations.map((item, i) => {
                        return (
                          <TouchableOpacity
                            key={i}
                            onPress={() => getLabResults(blockData, true)}
                            style={{
                              alignItems: 'center',
                              marginLeft: normalize(0),
                              justifyContent: 'center',
                              // width: normalize(35),
                              // height: normalize(35),
                            }}>
                            {/* <ABlink duration={3000}> */}
                            <View
                              style={{
                                // width: normalize(30),
                                // height: normalize(30),
                                borderRadius: 3,
                                justifyContent: 'center',
                                borderColor: item.color,
                                alignItems: 'center',
                                padding: normalize(5),
                                // borderWidth: 1,
                                // backgroundColor: '#ffffff'
                              }}>
                              {/* <Icons.FontAwesome5
                                                                                    name={item.iconname}
                                                                                    size={normalize(20)}
                                                                                    color={item.color}
                                                                                /> */}
                              <FastImage
                                style={{
                                  width: normalize(18),
                                  height: normalize(18),
                                }}
                                source={{
                                  uri:
                                    APIURL +
                                    'file/getCommonFile/image/' +
                                    item.image,
                                }}
                              />

                              <Text
                                numberOfLines={1}
                                style={{
                                  color: 'black',
                                  fontSize: normalize(6),
                                  lineHeight: normalize(8),
                                  fontWeight: '600',
                                  paddingTop: normalize(0),
                                }}>
                                {item.displaytext}
                              </Text>
                            </View>
                            {/* </ABlink> */}
                          </TouchableOpacity>
                        );
                      })
                      : null}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: '30%',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderWidth: 0,
                    flexDirection: 'row',
                  }}>
                  {props.chartscan ? (
                    <HShadowButton
                      useicon={true}
                      usetext={true}
                      buttonstyle={{
                        margin: normalize(5),
                        borderLeftWidth: 0,
                        borderBottomWidth: 0,
                        borderRadius: 5,
                        borderWidth: 0,
                        borderColor: Global.AppTheme.primary_color,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        height: normalize(30),
                        width: normalize(30),
                        ...CButtonShadow(),
                      }}
                      icongroup={3}
                      iconcolor={'#B8621B'}
                      iconname={'scanner'}
                      iconsize={normalize(22)}
                      iconstyle={{ textAlign: 'center', borderWidth: 0 }}
                      displaytext={'Chart scan'}
                      buttonCallback={() => {
                        getConsultationScreenData(blockData.item);
                      }}
                      textstyle={{
                        color: '#B8621B',
                        fontSize: normalize(6),
                        textAlign: 'center',
                        fontWeight: 'normal',
                        lineHeight: normalize(6),
                      }}
                    />
                  ) : null}

                  {isBNUL(blockData.item.vitalsignstatus) &&
                    isNUQ(
                      blockData.item.vitalsignstatus[0]
                        .hopapatientobservationnature,
                    ) ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        borderWidth: 0,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigateToVitalSignReport(blockData);
                        }}
                        style={{
                          borderWidth: 0,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <ABlink duration={1000}>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: 'lightgrey',
                              borderRadius: 5,
                              marginHorizontal: normalize(5),
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <HOCIcons.MaterialCommunityIcons
                              name={'clipboard-pulse'}
                              size={normalize(22)}
                              color={
                                isNUQ(blockData.item.vitalsignstatus[0].color)
                                  ? blockData.item.vitalsignstatus[0].color
                                  : Global.AppTheme.primary_color
                              }
                            />
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: normalize(8),
                                color: isNUQ(
                                  blockData.item.vitalsignstatus[0].color,
                                )
                                  ? blockData.item.vitalsignstatus[0].color
                                  : Global.AppTheme.primary_color,
                                fontWeight: 'normal',
                                textAlign: 'center',
                                width: normalize(40),
                              }}>
                              {
                                blockData.item.vitalsignstatus[0]
                                  .hopapatientobservationnature
                              }
                            </Text>
                          </View>
                        </ABlink>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {props.consultationmode &&
                    isNU(blockData.item.patientstatus) &&
                    blockData.item.patientstatus == 'Y' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <HOCIcons.Icons
                        icongroup={2}
                        size={normalize(20)}
                        name={'emoji-people'}
                        color={'green'}
                      />
                    </View>
                  ) : null}

                  {props.medicationoption ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (isBNUL(blockData.item.medication)) {
                          blockData.item.medication = []; // Initialize properly
                        } else {
                          blockData.item.medication = [
                            {
                              code: 1,
                              name: 'PRESCRIPTION',
                              selected: true,
                            },
                            {
                              code: 2,
                              name: 'PATIENT SERVICE',
                              selected: false,
                            },
                            {
                              code: 3,
                              name: 'DIET',
                              selected: false,
                            },
                          ];
                        }
                        setRefresh(0);
                        setTimeout(() => {
                          setRefresh(refresh + 1);
                        });
                        props.callback([]);
                      }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        height: normalize(14),
                        width: normalize(20),
                        backgroundColor: '#ffffff',
                        borderColor: 'lightgrey',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        padding: normalize(4),
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'flex-end',
                        borderWidth: 0.5,

                        // borderWidth: 0.5,
                        // borderColor: 'lightgrey',
                        // borderRadius: 100,
                        // padding: normalize(4),
                        // justifyContent: 'flex-end',
                        // alignItems: 'flex-end',
                        // alignSelf: 'flex-end',
                      }}>
                      <View
                        style={{
                          borderRadius: 5,
                          borderColor: 'lightgrey',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <HOCIcons.Entypo
                          name={
                            isBNUL(blockData.item.medication)
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={normalize(18)}
                          color={'darkblue'}
                          style={{
                            height: normalize(15),
                            textAlign: 'center',
                            marginBottom: normalize(4),
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null}

                  <View style={{ flexDirection: 'row', borderWidth: 0 }}>
                    <TouchableOpacity
                      // disabled={props.disabledetailcard ? true : false}
                      onPress={() => {
                        if (props.disabledetailcard) {
                          // console.log('hiiihi')

                          isNU(props.disabledetailcardcallback)
                            ? props.disabledetailcardcallback(true)
                            : null;
                        } else {
                          if (isBNUL(blockData.item.cardbottomarray)) {
                            // blockData.item.cardbottomviewloading = false;
                            // blockData.item.cardbottomviewdata = null;
                            blockData.item.cardbottomarray = [];
                            setRefresh(0);
                            setTimeout(() => {
                              setRefresh(refresh + 1);
                            });
                          } else {
                            Global.PatientDetails = blockData.item;
                            console.log(
                              'GGGGGGGGGGGGGGG',
                              JSON.stringify(blockData.item),
                            );
                            blockData.item.cardbottomarray = [
                              {
                                code: 1,
                                name: 'CONSULTATION',
                                selected: true,
                                iconname: 'ambulance',
                                icongroup: 5,
                                color: Global.AppTheme.primary_color,
                              },
                            ];
                            setRefresh(0);
                            setTimeout(() => {
                              setRefresh(refresh + 1);
                            });
                            // blockData.item.cardbottomviewloading = true;
                            // setRefresh(0);
                            // setTimeout(() => {
                            //     setRefresh(refresh + 1);
                            //     fnGetConsultaionAdmissionHistory(blockData);
                            // });
                          }
                        }
                      }}
                      style={{
                        alignItems: 'center',
                        borderWidth: 0,
                      }}>
                      {isBNUL(blockData.item.cardbottomarray) ? (
                        <View
                          style={{
                            width: 0,
                            height: 0,
                            borderLeftWidth: 15,
                            borderRightWidth: 15,
                            borderBottomWidth: 10,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderBottomColor: Global.AppTheme.primary_color,
                          }}></View>
                      ) : null}

                      <View
                        style={{
                          alignItems: 'center',
                          borderWidth: 0,
                          backgroundColor: Global.AppTheme.primary_color,
                          paddingHorizontal: normalize(5),
                          ...CShadowDynamic(
                            -3,
                            0,
                            5,
                            -2,
                            Global.AppTheme.primary_color,
                          ),
                        }}>
                        {['D', 'E', 'T', 'A', 'I', 'L', 'S'].map((val, i) => {
                          return (
                            <Text
                              key={i}
                              style={{
                                fontSize: normalize(6),
                                lineHeight: normalize(7),
                                fontWeight: 'bold',
                                color: 'white',
                              }}>
                              {val}
                            </Text>
                          );
                        })}
                      </View>
                      {isBNUL(blockData.item.cardbottomarray) ? null : (
                        <View
                          style={{
                            width: 0,
                            height: 0,
                            borderLeftWidth: 15,
                            borderRightWidth: 15,
                            borderTopWidth: 10,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderTopColor: Global.AppTheme.primary_color,
                          }}></View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                top: normalize(12),
                alignItems: 'center',
                justifyContent: 'center',
                right: -1,
              }}>
              <Icons.MaterialCommunityIcons
                name={'chevron-right'}
                size={normalize(18)}
                color={'grey'}
                style={{ opacity: 1 }}
              />
            </View>

            {ValueCheck(blockData.item.bookingstatus) ? (
              <View
                style={{
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: '#7a1241',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2%',
                  flexDirection: 'column',
                }}>
                {['B', 'o', 'o', 'k', 'e', 'd'].map((item, i) => {
                  return (
                    <Text
                      key={i}
                      style={{
                        fontSize: normalize(6),
                        lineHeight: normalize(6),
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor:
                    blockData.item.profilecontent[0].patienttype == 'IP'
                      ? '#ea6767'
                      : blockData.item.bookingstatus
                        ? '#7a1241'
                        : blockData.item.profilecontent[0].logo1 == 'FIRST VISIT'
                          ? '#094485'
                          : blockData.item.profilecontent[0].logo1 == 'RENEWAL' ||
                            blockData.item.profilecontent[0].logo1 == 'REVISIT'
                            ? '#3b86db'
                            : blockData.item.profilecontent[0].logo1 == 'MLC'
                              ? '#FF0000'
                              : blockData.item.profilecontent[0].logo1 ==
                                'CROSS CONSULTATION'
                                ? '#fca671'
                                : blockData.item.profilecontent[0].logo1 == 'BOOKED' ||
                                  blockData.item.profilecontent[0].logo1 == 'BOOKING'
                                  ? '#7a1241'
                                  : '#3b86db',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2%',
                  opacity: 0.7,
                  flexDirection: 'column',
                }}>
                {[' '].map((item, i) => {
                  return (
                    <Text
                      key={i}
                      style={{
                        fontSize: normalize(6),
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      {item}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );

  function renderCardNew(blockData, array) {
    return (
      <View>
        <SwipeRow
          swipeToOpenPercent={1}
          swipeToClosePercent={1}
          leftOpenValue={normalize(230)}
          rightOpenValue={-normalize(230)}
          style={{
            borderRadius: 10,
            width: '100%',
            marginBottom: normalize(7),
          }}>
          {/*---------------------- SWIPESECTION */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              width: '100%',
            }}>
            {renderLeftActionDisplay(blockData, array)}
            {renderRightActionDisplay(blockData, array)}
          </View>
          {/*--------------------------- MAINSECTION */}
          {renderVisibleRow(blockData, array)}
        </SwipeRow>
        {!props.disabledetailcard && isBNUL(blockData.item.cardbottomarray) ? (
          <DetailsOverlay
            headingstyle={{
              heading: 'DETAILS',
              headingicon: 'account-details',
              headingicongroup: 3,
              height: 0.131,
            }}
            blockData={blockData}
            overlaydata={{}}
            closeOverlay={() => {
              blockData.item.cardbottomarray = [];
              setRefresh(0);
              setTimeout(() => {
                setRefresh(refresh + 1);
              });
            }}
            chartscancallback={getChartScanScreenData}
            NavigateToPatientChart={NavigateToPatientChart}
            getXRay={getXRay}
            getLabResults={getLabResults}
            chartscanfilescallback={getChartScanFiles}
          />
        ) : null}
        {blockData.item.medication && blockData.item.medication.length > 0 ? (
          <CMedications data={blockData} callback={handleUpdatedData} />
        ) : null}
      </View>
    );
  }

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    [],
  );

  return (
    <>
      <View>
        <FlatList
          nestedScrollEnabled={true}
          ref={listRef}
          data={newData}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          // keyExtractor={keyExtractor}
          keyExtractor={(item, index) => 'key' + index}
          // listKey={keyExtractor}
          getItemLayout={getItemLayout}
          renderItem={val => renderCardNew(val, newData)}
          ListFooterComponent={
            newData != undefined &&
              newData.length > 7 &&
              props.noscroll == undefined &&
              !props.noscroll ? (
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginRight: normalize(20),
                  paddingHorizontal: normalize(10),
                }}>
                <CVectorIcon
                  data={{
                    displaytext: 'Top',
                    fontcolor: 'black',
                    size: 8,
                    iconname: 'arrow-up',
                    iconcolor: '#f28585',
                    selected: false,
                    visibility: true,
                    iconsize: 20,
                    functionid: 'UL01',
                  }}
                  callBack={val => (val == undefined ? null : moveToTop(val))}
                />
              </View>
            ) : null
          }
        />
      </View>

      {overlay ? (
        <HOverlay
          component={'ConsultationPreview'}
          visibility={val => (val == undefined ? null : setOverlay(val))}
        />
      ) : null}
      {chartScanOverlay && isNU(chartScanData) ? (
        <CChartScanOverlay
          headingstyle={{
            heading: chartScanData.heading,
            headingicon: chartScanData.icon,
            headingicongroup: chartScanData.icongroup,
            height: 0.131,
          }}
          overlaydata={chartScanData}
          closeOverlay={() => {
            setChartScanOverlay(false);
          }}
        />
      ) : null}
      {isLoading || activity ? <Loader displaytext={true} /> : null}
    </>
  );
}

function CCard(props) {
  return GetCard(props);
}

export default memo(CCard);

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: normalize(7),
    lineHeight: normalize(8),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: normalize(2),
  },
});
