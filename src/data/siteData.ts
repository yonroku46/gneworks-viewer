// Generated siteData.ts with Korea Regional Hierarchy & Worker Assignment

export type { Household, AssignedWorker, SiteInfo };

export const getHouseholdSeq = (hh: Household): number | string | undefined => {
  if (hh.seq !== undefined && hh.seq !== null && hh.seq !== '') return hh.seq;
  const match = hh.id.match(/_(\d+)$/);
  if (match) return parseInt(match[1], 10);
  return undefined;
};

export const getSiteWorkers = (site: SiteInfo): AssignedWorker[] => {
  if (site.assignedWorkers && site.assignedWorkers.length > 0) {
    return site.assignedWorkers;
  }
  if (site.assignedUserId && site.assignedUserName) {
    return [{
      userId: site.assignedUserId,
      userName: site.assignedUserName,
      userPhone: site.assignedUserPhone,
    }];
  }
  return [];
};

const RAW_INITIAL_SITES_DATA: SiteInfo[] = [
  {
    "id": "site_1",
    "name": "조흥아파트",
    "address": "경기도 연천군 연천읍 차옥로 81",
    "region": "경기도 연천군",
    "dongCount": 3,
    "dongList": [
      "101",
      "102",
      "104"
    ],
    "totalHouseholds": 105,
    "completedHouseholds": 35,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_1_1",
        "dong": "101",
        "ho": "101",
        "headName": "박태병",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_2",
        "dong": "101",
        "ho": "108",
        "headName": "김영광",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_3",
        "dong": "101",
        "ho": "202",
        "headName": "심완섭",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_4",
        "dong": "101",
        "ho": "203",
        "headName": "김지현",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_5",
        "dong": "101",
        "ho": "204",
        "headName": "김영래",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_6",
        "dong": "101",
        "ho": "205",
        "headName": "김수근",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_7",
        "dong": "101",
        "ho": "208",
        "headName": "김옥자",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_8",
        "dong": "101",
        "ho": "303",
        "headName": "박복희",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_9",
        "dong": "101",
        "ho": "305",
        "headName": "박충진",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_10",
        "dong": "101",
        "ho": "306",
        "headName": "박갑례",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_11",
        "dong": "101",
        "ho": "402",
        "headName": "윤석현",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_12",
        "dong": "101",
        "ho": "403",
        "headName": "김명학",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_13",
        "dong": "101",
        "ho": "405",
        "headName": "주항탁",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_14",
        "dong": "101",
        "ho": "406",
        "headName": "김항수",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_15",
        "dong": "101",
        "ho": "407",
        "headName": "박상덕",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_16",
        "dong": "101",
        "ho": "501",
        "headName": "장수일",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_17",
        "dong": "101",
        "ho": "503",
        "headName": "양재성",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_18",
        "dong": "101",
        "ho": "504",
        "headName": "오정순",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_19",
        "dong": "101",
        "ho": "505",
        "headName": "김선혁",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_20",
        "dong": "101",
        "ho": "507",
        "headName": "이영우",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_21",
        "dong": "101",
        "ho": "603",
        "headName": "이경화",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_22",
        "dong": "101",
        "ho": "604",
        "headName": "박임순",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_23",
        "dong": "101",
        "ho": "608",
        "headName": "한준석",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_24",
        "dong": "101",
        "ho": "703",
        "headName": "조욱래",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_25",
        "dong": "101",
        "ho": "705",
        "headName": "백인숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_26",
        "dong": "101",
        "ho": "707",
        "headName": "김동천",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_27",
        "dong": "101",
        "ho": "803",
        "headName": "임덕락",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_28",
        "dong": "101",
        "ho": "804",
        "headName": "윤영임",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_29",
        "dong": "101",
        "ho": "806",
        "headName": "현재화",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_30",
        "dong": "101",
        "ho": "808",
        "headName": "이명희",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_31",
        "dong": "101",
        "ho": "901",
        "headName": "임철진",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_32",
        "dong": "101",
        "ho": "902",
        "headName": "박무진",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_33",
        "dong": "101",
        "ho": "903",
        "headName": "이주석",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_34",
        "dong": "101",
        "ho": "907",
        "headName": "남궁기순",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_35",
        "dong": "101",
        "ho": "1002",
        "headName": "윤석범",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_36",
        "dong": "101",
        "ho": "1003",
        "headName": "여운홍",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_37",
        "dong": "101",
        "ho": "1005",
        "headName": "최현숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_38",
        "dong": "101",
        "ho": "1007",
        "headName": "김정숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_39",
        "dong": "101",
        "ho": "1008",
        "headName": "유광호",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_40",
        "dong": "101",
        "ho": "1103",
        "headName": "김우중",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_41",
        "dong": "101",
        "ho": "1106",
        "headName": "서순분",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_42",
        "dong": "101",
        "ho": "1108",
        "headName": "이정임",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_43",
        "dong": "101",
        "ho": "1109",
        "headName": "이현숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_44",
        "dong": "101",
        "ho": "1201",
        "headName": "강영구",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_45",
        "dong": "101",
        "ho": "1202",
        "headName": "박순임",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_46",
        "dong": "101",
        "ho": "1203",
        "headName": "권옥례",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_47",
        "dong": "101",
        "ho": "1205",
        "headName": "이윤형",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_48",
        "dong": "101",
        "ho": "1208",
        "headName": "유명자",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_49",
        "dong": "101",
        "ho": "1302",
        "headName": "오부근",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_50",
        "dong": "101",
        "ho": "1305",
        "headName": "박승화",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_51",
        "dong": "102",
        "ho": "102",
        "headName": "김경석",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_52",
        "dong": "102",
        "ho": "103",
        "headName": "강정숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_53",
        "dong": "102",
        "ho": "201",
        "headName": "남점순",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_54",
        "dong": "102",
        "ho": "202",
        "headName": "곽계용",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_55",
        "dong": "102",
        "ho": "203",
        "headName": "송을범",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_56",
        "dong": "102",
        "ho": "204",
        "headName": "김재원",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_57",
        "dong": "102",
        "ho": "303",
        "headName": "김상현",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_58",
        "dong": "102",
        "ho": "310",
        "headName": "백순희",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_59",
        "dong": "102",
        "ho": "404",
        "headName": "안태환",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_60",
        "dong": "102",
        "ho": "406",
        "headName": "서부성",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_61",
        "dong": "102",
        "ho": "410",
        "headName": "조영희",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_62",
        "dong": "102",
        "ho": "502",
        "headName": "오대균",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_63",
        "dong": "102",
        "ho": "504",
        "headName": "조남수",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_64",
        "dong": "102",
        "ho": "506",
        "headName": "김윤자",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_65",
        "dong": "102",
        "ho": "509",
        "headName": "윤순남",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_66",
        "dong": "102",
        "ho": "510",
        "headName": "진동호",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_67",
        "dong": "102",
        "ho": "601",
        "headName": "차봉구",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_68",
        "dong": "102",
        "ho": "603",
        "headName": "이민지",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_69",
        "dong": "102",
        "ho": "604",
        "headName": "설달막",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_70",
        "dong": "102",
        "ho": "605",
        "headName": "김종환",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_71",
        "dong": "102",
        "ho": "607",
        "headName": "김수자",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_72",
        "dong": "102",
        "ho": "608",
        "headName": "김광유",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_73",
        "dong": "102",
        "ho": "609",
        "headName": "최종국",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_74",
        "dong": "102",
        "ho": "701",
        "headName": "황금자",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_75",
        "dong": "102",
        "ho": "702",
        "headName": "최달순",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_76",
        "dong": "102",
        "ho": "704",
        "headName": "박부용",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_77",
        "dong": "102",
        "ho": "705",
        "headName": "주금자",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_78",
        "dong": "102",
        "ho": "706",
        "headName": "임혜숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_79",
        "dong": "102",
        "ho": "707",
        "headName": "조정숙",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_80",
        "dong": "102",
        "ho": "708",
        "headName": "임순화",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_81",
        "dong": "102",
        "ho": "710",
        "headName": "최봉석",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_82",
        "dong": "102",
        "ho": "804",
        "headName": "이세민",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_83",
        "dong": "102",
        "ho": "805",
        "headName": "정세균",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_84",
        "dong": "102",
        "ho": "806",
        "headName": "임광진",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_85",
        "dong": "102",
        "ho": "807",
        "headName": "이용일",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_86",
        "dong": "102",
        "ho": "808",
        "headName": "김현자",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_87",
        "dong": "102",
        "ho": "901",
        "headName": "원정희",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_88",
        "dong": "102",
        "ho": "902",
        "headName": "오세연",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_89",
        "dong": "102",
        "ho": "905",
        "headName": "이종석",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_90",
        "dong": "102",
        "ho": "906",
        "headName": "윤명한",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_91",
        "dong": "102",
        "ho": "907",
        "headName": "강성주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_92",
        "dong": "102",
        "ho": "909",
        "headName": "임덕용",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_93",
        "dong": "102",
        "ho": "910",
        "headName": "장현철",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_94",
        "dong": "102",
        "ho": "1001",
        "headName": "이시훈",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_95",
        "dong": "102",
        "ho": "1002",
        "headName": "신경호",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_96",
        "dong": "102",
        "ho": "1003",
        "headName": "정영순",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_97",
        "dong": "102",
        "ho": "1006",
        "headName": "김형진",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_98",
        "dong": "102",
        "ho": "1008",
        "headName": "윤소인",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_99",
        "dong": "102",
        "ho": "1009",
        "headName": "윤기백",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_100",
        "dong": "102",
        "ho": "1101",
        "headName": "김우남",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_101",
        "dong": "102",
        "ho": "1102",
        "headName": "이충환",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_102",
        "dong": "102",
        "ho": "1103",
        "headName": "김명자",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_1_103",
        "dong": "102",
        "ho": "1105",
        "headName": "이진섭",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_1_104",
        "dong": "102",
        "ho": "1107",
        "headName": "소제환",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_1_105",
        "dong": "104",
        "ho": "2",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "연천읍",
    "routeGroup": "연천 1동선 (연천읍 권역)",
    "assignedWorkers": [
      { "userId": "worker_kim01", "userName": "김연태", "userPhone": "010-4665-6802" },
      { "userId": "worker_lee02", "userName": "이성민", "userPhone": "010-9876-5432" },
      { "userId": "worker_park03", "userName": "박영호", "userPhone": "010-3344-5566" },
      { "userId": "worker_choi04", "userName": "최현우", "userPhone": "010-2233-4455" },
      { "userId": "worker_jung05", "userName": "정다빈", "userPhone": "010-7788-9900" },
      { "userId": "worker_kang06", "userName": "강인호", "userPhone": "010-5566-7788" },
      { "userId": "worker_yoon07", "userName": "윤서준", "userPhone": "010-1122-3344" },
      { "userId": "worker_han08", "userName": "한지우", "userPhone": "010-9988-7766" },
      { "userId": "worker_song09", "userName": "송민호", "userPhone": "010-4455-6677" },
      { "userId": "worker_oh10", "userName": "오하늘", "userPhone": "010-6677-8899" }
    ],
    "assignedUserId": "worker_kim01",
    "assignedUserName": "김연태",
    "assignedUserPhone": "010-4665-6802",
    "workStartDate": "2026-08-03",
    "workCompletedCount": 35
  },
  {
    "id": "site_2",
    "name": "휴먼시아",
    "address": "경기도 연천군 전곡읍 밤골로 8",
    "region": "경기도 연천군",
    "dongCount": 14,
    "dongList": [
      "101",
      "102",
      "103",
      "104",
      "105",
      "106",
      "107",
      "108",
      "109",
      "110",
      "111",
      "112",
      "113",
      "242"
    ],
    "totalHouseholds": 243,
    "completedHouseholds": 81,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_2_1",
        "dong": "101",
        "ho": "101",
        "headName": "김화수",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_2",
        "dong": "101",
        "ho": "103",
        "headName": "김병화",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_3",
        "dong": "101",
        "ho": "104",
        "headName": "김인화",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_4",
        "dong": "101",
        "ho": "201",
        "headName": "송요섭",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_5",
        "dong": "101",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_6",
        "dong": "101",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_7",
        "dong": "101",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_8",
        "dong": "101",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_9",
        "dong": "101",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_10",
        "dong": "101",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_11",
        "dong": "101",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_12",
        "dong": "101",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_13",
        "dong": "101",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_14",
        "dong": "101",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_15",
        "dong": "101",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_16",
        "dong": "101",
        "ho": "601",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_17",
        "dong": "101",
        "ho": "603",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_18",
        "dong": "101",
        "ho": "702",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_19",
        "dong": "101",
        "ho": "703",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_20",
        "dong": "101",
        "ho": "705",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_21",
        "dong": "101",
        "ho": "801",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_22",
        "dong": "101",
        "ho": "802",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_23",
        "dong": "101",
        "ho": "803",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_24",
        "dong": "101",
        "ho": "805",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_25",
        "dong": "101",
        "ho": "901",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_26",
        "dong": "101",
        "ho": "902",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_27",
        "dong": "101",
        "ho": "905",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_28",
        "dong": "101",
        "ho": "1001",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_29",
        "dong": "101",
        "ho": "1002",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_30",
        "dong": "101",
        "ho": "1003",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_31",
        "dong": "101",
        "ho": "1004",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_32",
        "dong": "101",
        "ho": "1005",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_33",
        "dong": "102",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_34",
        "dong": "102",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_35",
        "dong": "102",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_36",
        "dong": "102",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_37",
        "dong": "102",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_38",
        "dong": "102",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_39",
        "dong": "102",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_40",
        "dong": "102",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_41",
        "dong": "102",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_42",
        "dong": "102",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_43",
        "dong": "102",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_44",
        "dong": "102",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_45",
        "dong": "102",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_46",
        "dong": "102",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_47",
        "dong": "102",
        "ho": "601",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_48",
        "dong": "102",
        "ho": "603",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_49",
        "dong": "102",
        "ho": "604",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_50",
        "dong": "102",
        "ho": "701",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_51",
        "dong": "102",
        "ho": "703",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_52",
        "dong": "102",
        "ho": "704",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_53",
        "dong": "102",
        "ho": "801",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_54",
        "dong": "102",
        "ho": "802",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_55",
        "dong": "102",
        "ho": "803",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_56",
        "dong": "102",
        "ho": "804",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_57",
        "dong": "102",
        "ho": "901",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_58",
        "dong": "102",
        "ho": "904",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_59",
        "dong": "102",
        "ho": "1002",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_60",
        "dong": "102",
        "ho": "1003",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_61",
        "dong": "102",
        "ho": "1005",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_62",
        "dong": "103",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_63",
        "dong": "103",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_64",
        "dong": "103",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_65",
        "dong": "103",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_66",
        "dong": "103",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_67",
        "dong": "103",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_68",
        "dong": "103",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_69",
        "dong": "103",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_70",
        "dong": "103",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_71",
        "dong": "103",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_72",
        "dong": "103",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_73",
        "dong": "103",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_74",
        "dong": "103",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_75",
        "dong": "103",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_76",
        "dong": "103",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_77",
        "dong": "103",
        "ho": "601",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_78",
        "dong": "103",
        "ho": "605",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_79",
        "dong": "103",
        "ho": "701",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_80",
        "dong": "103",
        "ho": "702",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_81",
        "dong": "104",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_82",
        "dong": "104",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_83",
        "dong": "104",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_84",
        "dong": "104",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_85",
        "dong": "104",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_86",
        "dong": "104",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_87",
        "dong": "104",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_88",
        "dong": "104",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_89",
        "dong": "104",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_90",
        "dong": "104",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_91",
        "dong": "104",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_92",
        "dong": "104",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_93",
        "dong": "104",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_94",
        "dong": "104",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_95",
        "dong": "104",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_96",
        "dong": "104",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_97",
        "dong": "104",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_98",
        "dong": "105",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_99",
        "dong": "105",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_100",
        "dong": "105",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_101",
        "dong": "105",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_102",
        "dong": "105",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_103",
        "dong": "105",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_104",
        "dong": "105",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_105",
        "dong": "105",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_106",
        "dong": "105",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_107",
        "dong": "105",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_108",
        "dong": "105",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_109",
        "dong": "105",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_110",
        "dong": "105",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_111",
        "dong": "105",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_112",
        "dong": "105",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_113",
        "dong": "105",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_114",
        "dong": "105",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_115",
        "dong": "105",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_116",
        "dong": "105",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_117",
        "dong": "106",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_118",
        "dong": "106",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_119",
        "dong": "106",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_120",
        "dong": "106",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_121",
        "dong": "106",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_122",
        "dong": "106",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_123",
        "dong": "106",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_124",
        "dong": "106",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_125",
        "dong": "106",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_126",
        "dong": "106",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_127",
        "dong": "106",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_128",
        "dong": "106",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_129",
        "dong": "106",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_130",
        "dong": "106",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_131",
        "dong": "107",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_132",
        "dong": "107",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_133",
        "dong": "107",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_134",
        "dong": "107",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_135",
        "dong": "107",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_136",
        "dong": "107",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_137",
        "dong": "107",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_138",
        "dong": "107",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_139",
        "dong": "107",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_140",
        "dong": "107",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_141",
        "dong": "107",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_142",
        "dong": "107",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_143",
        "dong": "107",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_144",
        "dong": "107",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_145",
        "dong": "107",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_146",
        "dong": "107",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_147",
        "dong": "107",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_148",
        "dong": "107",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_149",
        "dong": "107",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_150",
        "dong": "108",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_151",
        "dong": "108",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_152",
        "dong": "108",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_153",
        "dong": "108",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_154",
        "dong": "108",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_155",
        "dong": "108",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_156",
        "dong": "108",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_157",
        "dong": "108",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_158",
        "dong": "108",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_159",
        "dong": "108",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_160",
        "dong": "108",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_161",
        "dong": "108",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_162",
        "dong": "108",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_163",
        "dong": "108",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_164",
        "dong": "109",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_165",
        "dong": "109",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_166",
        "dong": "109",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_167",
        "dong": "109",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_168",
        "dong": "109",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_169",
        "dong": "109",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_170",
        "dong": "109",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_171",
        "dong": "109",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_172",
        "dong": "109",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_173",
        "dong": "109",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_174",
        "dong": "109",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_175",
        "dong": "109",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_176",
        "dong": "109",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_177",
        "dong": "109",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_178",
        "dong": "109",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_179",
        "dong": "109",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_180",
        "dong": "109",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_181",
        "dong": "110",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_182",
        "dong": "110",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_183",
        "dong": "110",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_184",
        "dong": "110",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_185",
        "dong": "110",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_186",
        "dong": "110",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_187",
        "dong": "110",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_188",
        "dong": "110",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_189",
        "dong": "110",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_190",
        "dong": "110",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_191",
        "dong": "110",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_192",
        "dong": "110",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_193",
        "dong": "110",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_194",
        "dong": "110",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_195",
        "dong": "110",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_196",
        "dong": "110",
        "ho": "406",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_197",
        "dong": "110",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_198",
        "dong": "110",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_199",
        "dong": "111",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_200",
        "dong": "111",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_201",
        "dong": "111",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_202",
        "dong": "111",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_203",
        "dong": "111",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_204",
        "dong": "111",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_205",
        "dong": "111",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_206",
        "dong": "111",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_207",
        "dong": "111",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_208",
        "dong": "111",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_209",
        "dong": "111",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_210",
        "dong": "111",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_211",
        "dong": "111",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_212",
        "dong": "111",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_213",
        "dong": "111",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_214",
        "dong": "112",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_215",
        "dong": "112",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_216",
        "dong": "112",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_217",
        "dong": "112",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_218",
        "dong": "112",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_219",
        "dong": "112",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_220",
        "dong": "112",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_221",
        "dong": "112",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_222",
        "dong": "112",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_223",
        "dong": "112",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_224",
        "dong": "112",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_225",
        "dong": "112",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_226",
        "dong": "112",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_227",
        "dong": "112",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_228",
        "dong": "113",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_229",
        "dong": "113",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_230",
        "dong": "113",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_231",
        "dong": "113",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_232",
        "dong": "113",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_233",
        "dong": "113",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_234",
        "dong": "113",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_235",
        "dong": "113",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_236",
        "dong": "113",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_237",
        "dong": "113",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_238",
        "dong": "113",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_239",
        "dong": "113",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_240",
        "dong": "113",
        "ho": "601",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_2_241",
        "dong": "113",
        "ho": "702",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_2_242",
        "dong": "113",
        "ho": "704",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_2_243",
        "dong": "242",
        "ho": "1",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "assignedWorkers": [
      { "userId": "worker_lee02", "userName": "이성민", "userPhone": "010-9876-5432" },
      { "userId": "worker_choi04", "userName": "최현우", "userPhone": "010-2233-4455" }
    ],
    "assignedUserId": "worker_lee02",
    "assignedUserName": "이성민",
    "assignedUserPhone": "010-9876-5432",
    "workStartDate": "2026-08-05",
    "workCompletedCount": 81
  },
  {
    "id": "site_3",
    "name": "가람채아파트",
    "address": "경기도 연천군 전곡읍 평화로698번길 81",
    "region": "경기도 연천군",
    "dongCount": 3,
    "dongList": [
      "101",
      "102",
      "12"
    ],
    "totalHouseholds": 13,
    "completedHouseholds": 5,
    "contactPhone": "010-6486-8585",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_3_1",
        "dong": "102",
        "ho": "403",
        "headName": "안세웅",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_3_2",
        "dong": "102",
        "ho": "603",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_3_3",
        "dong": "102",
        "ho": "204",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_3_4",
        "dong": "101",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_3_5",
        "dong": "101",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_3_6",
        "dong": "101",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_3_7",
        "dong": "101",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_3_8",
        "dong": "101",
        "ho": "701",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_3_9",
        "dong": "101",
        "ho": "702",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_3_10",
        "dong": "101",
        "ho": "805",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_3_11",
        "dong": "101",
        "ho": "902",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_3_12",
        "dong": "101",
        "ho": "1101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_3_13",
        "dong": "12",
        "ho": "11",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "설치완료",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "assignedWorkers": [
      { "userId": "worker_park03", "userName": "박영호", "userPhone": "010-3344-5566" }
    ],
    "assignedUserId": "worker_park03",
    "assignedUserName": "박영호",
    "assignedUserPhone": "010-3344-5566",
    "workStartDate": "2026-08-10",
    "workCompletedCount": 4
  },
  {
    "id": "site_4",
    "name": "대광빌라",
    "address": "경기도 연천군 신서면 연신로1109-27",
    "region": "경기도 연천군",
    "dongCount": 11,
    "dongList": [
      "10",
      "101",
      "102",
      "103",
      "104",
      "202",
      "303",
      "403",
      "501",
      "502",
      "503"
    ],
    "totalHouseholds": 11,
    "completedHouseholds": 4,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_4_1",
        "dong": "202",
        "ho": "1호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_4_2",
        "dong": "503",
        "ho": "2호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_4_3",
        "dong": "303",
        "ho": "3호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_4_4",
        "dong": "501",
        "ho": "4호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_4_5",
        "dong": "103",
        "ho": "5호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_4_6",
        "dong": "502",
        "ho": "6호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_4_7",
        "dong": "104",
        "ho": "7호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_4_8",
        "dong": "102",
        "ho": "8호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_4_9",
        "dong": "101",
        "ho": "9호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_4_10",
        "dong": "403",
        "ho": "10호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_4_11",
        "dong": "10",
        "ho": "14",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "방문예정",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "신서면",
    "routeGroup": "연천 3동선 (신서/청산 외곽권역)",
    "workCompletedCount": 4
  },
  {
    "id": "site_5",
    "name": "대삼아파트",
    "address": "경기도 연천군 전곡읍 전은길 9-41",
    "region": "경기도 연천군",
    "dongCount": 4,
    "dongList": [
      "1",
      "3",
      "5",
      "9"
    ],
    "totalHouseholds": 10,
    "completedHouseholds": 4,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_5_1",
        "dong": "1",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_5_2",
        "dong": "3",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_5_3",
        "dong": "5",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_5_4",
        "dong": "5",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_5_5",
        "dong": "5",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_5_6",
        "dong": "5",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_5_7",
        "dong": "5",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_5_8",
        "dong": "5",
        "ho": "207",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_5_9",
        "dong": "5",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_5_10",
        "dong": "9",
        "ho": "15",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "설치완료",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 4
  },
  {
    "id": "site_6",
    "name": "동원아파트",
    "address": "경기도 연천군 전곡읍 전영로11번길 2-10",
    "region": "경기도 연천군",
    "dongCount": 13,
    "dongList": [
      "101",
      "102",
      "103",
      "104",
      "12",
      "201",
      "203",
      "204",
      "301",
      "302",
      "303",
      "402",
      "502"
    ],
    "totalHouseholds": 13,
    "completedHouseholds": 5,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_6_1",
        "dong": "101",
        "ho": "1호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_6_2",
        "dong": "102",
        "ho": "2호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_6_3",
        "dong": "103",
        "ho": "3호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_6_4",
        "dong": "104",
        "ho": "4호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_6_5",
        "dong": "201",
        "ho": "5호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_6_6",
        "dong": "203",
        "ho": "6호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_6_7",
        "dong": "204",
        "ho": "7호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_6_8",
        "dong": "301",
        "ho": "8호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_6_9",
        "dong": "302",
        "ho": "9호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_6_10",
        "dong": "303",
        "ho": "10호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_6_11",
        "dong": "402",
        "ho": "11호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_6_12",
        "dong": "502",
        "ho": "12호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_6_13",
        "dong": "12",
        "ho": "13",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "설치완료",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 5
  },
  {
    "id": "site_7",
    "name": "방림아파트",
    "address": "경기도 연천군 전곡읍 선사로 373",
    "region": "경기도 연천군",
    "dongCount": 24,
    "dongList": [
      "102",
      "104",
      "105",
      "107",
      "109",
      "111",
      "112",
      "201",
      "202",
      "203",
      "204",
      "205",
      "208",
      "209",
      "211",
      "212",
      "23",
      "302",
      "303",
      "307",
      "310",
      "312",
      "502",
      "511"
    ],
    "totalHouseholds": 24,
    "completedHouseholds": 8,
    "contactPhone": "010-8838-6978",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_7_1",
        "dong": "203",
        "ho": "1호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_2",
        "dong": "502",
        "ho": "2호",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_3",
        "dong": "102",
        "ho": "3호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_4",
        "dong": "105",
        "ho": "4호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_5",
        "dong": "107",
        "ho": "5호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_6",
        "dong": "109",
        "ho": "6호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_7",
        "dong": "111",
        "ho": "7호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_8",
        "dong": "112",
        "ho": "8호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_9",
        "dong": "511",
        "ho": "9호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_10",
        "dong": "104",
        "ho": "10호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_11",
        "dong": "201",
        "ho": "11호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_12",
        "dong": "204",
        "ho": "12호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_13",
        "dong": "205",
        "ho": "13호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_14",
        "dong": "208",
        "ho": "14호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_15",
        "dong": "209",
        "ho": "15호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_16",
        "dong": "211",
        "ho": "16호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_17",
        "dong": "212",
        "ho": "17호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_18",
        "dong": "202",
        "ho": "18호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_19",
        "dong": "302",
        "ho": "19호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_20",
        "dong": "303",
        "ho": "20호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_21",
        "dong": "307",
        "ho": "21호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_7_22",
        "dong": "310",
        "ho": "22호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_7_23",
        "dong": "312",
        "ho": "23호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_7_24",
        "dong": "23",
        "ho": "8",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 8
  },
  {
    "id": "site_8",
    "name": "백의리아느칸빌아파트",
    "address": "경기도 연천군 청산면 청창로677",
    "region": "경기도 연천군",
    "dongCount": 8,
    "dongList": [
      "101",
      "102",
      "103",
      "104",
      "105",
      "106",
      "78",
      "상가동"
    ],
    "totalHouseholds": 79,
    "completedHouseholds": 27,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_8_1",
        "dong": "104",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_2",
        "dong": "106",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_3",
        "dong": "102",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_4",
        "dong": "102",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_5",
        "dong": "104",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_6",
        "dong": "105",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_7",
        "dong": "101",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_8",
        "dong": "106",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_9",
        "dong": "104",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_10",
        "dong": "104",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_11",
        "dong": "105",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_12",
        "dong": "103",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_13",
        "dong": "101",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_14",
        "dong": "103",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_15",
        "dong": "103",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_16",
        "dong": "102",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_17",
        "dong": "104",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_18",
        "dong": "102",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_19",
        "dong": "103",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_20",
        "dong": "103",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_21",
        "dong": "105",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_22",
        "dong": "101",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_23",
        "dong": "101",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_24",
        "dong": "103",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_25",
        "dong": "104",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_26",
        "dong": "105",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_27",
        "dong": "106",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_28",
        "dong": "103",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_29",
        "dong": "106",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_30",
        "dong": "102",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_31",
        "dong": "105",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_32",
        "dong": "104",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_33",
        "dong": "102",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_34",
        "dong": "106",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_35",
        "dong": "103",
        "ho": "506",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_36",
        "dong": "101",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_37",
        "dong": "103",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_38",
        "dong": "104",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_39",
        "dong": "104",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_40",
        "dong": "106",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_41",
        "dong": "102",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_42",
        "dong": "101",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_43",
        "dong": "101",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_44",
        "dong": "102",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_45",
        "dong": "103",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_46",
        "dong": "103",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_47",
        "dong": "105",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_48",
        "dong": "상가동",
        "ho": "2",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_49",
        "dong": "101",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_50",
        "dong": "103",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_51",
        "dong": "105",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_52",
        "dong": "103",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_53",
        "dong": "104",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_54",
        "dong": "101",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_55",
        "dong": "104",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_56",
        "dong": "105",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_57",
        "dong": "106",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_58",
        "dong": "103",
        "ho": "101",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_59",
        "dong": "101",
        "ho": "501",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_60",
        "dong": "101",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_61",
        "dong": "103",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_62",
        "dong": "101",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_63",
        "dong": "105",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_64",
        "dong": "105",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_65",
        "dong": "102",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_66",
        "dong": "102",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_67",
        "dong": "106",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_68",
        "dong": "105",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_69",
        "dong": "105",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_70",
        "dong": "103",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_71",
        "dong": "101",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_72",
        "dong": "105",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_73",
        "dong": "105",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_74",
        "dong": "106",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_75",
        "dong": "105",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_76",
        "dong": "103",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_8_77",
        "dong": "106",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_8_78",
        "dong": "106",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_8_79",
        "dong": "78",
        "ho": "4",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "설치완료",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "청산면",
    "routeGroup": "연천 3동선 (신서/청산 외곽권역)",
    "workCompletedCount": 27
  },
  {
    "id": "site_9",
    "name": "삼민아파트",
    "address": "경기도 연천군 전곡읍 전영로11번길 2-20",
    "region": "경기도 연천군",
    "dongCount": 13,
    "dongList": [
      "102",
      "103",
      "12",
      "202",
      "203",
      "301",
      "303",
      "402",
      "403",
      "502",
      "503",
      "602",
      "603"
    ],
    "totalHouseholds": 13,
    "completedHouseholds": 5,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_9_1",
        "dong": "602",
        "ho": "1호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_9_2",
        "dong": "102",
        "ho": "2호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_9_3",
        "dong": "103",
        "ho": "3호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_9_4",
        "dong": "202",
        "ho": "4호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_9_5",
        "dong": "203",
        "ho": "5호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_9_6",
        "dong": "301",
        "ho": "6호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_9_7",
        "dong": "303",
        "ho": "7호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_9_8",
        "dong": "402",
        "ho": "8호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_9_9",
        "dong": "403",
        "ho": "9호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_9_10",
        "dong": "502",
        "ho": "10호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_9_11",
        "dong": "503",
        "ho": "11호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_9_12",
        "dong": "603",
        "ho": "12호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_9_13",
        "dong": "12",
        "ho": "12",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "설치완료",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 5
  },
  {
    "id": "site_10",
    "name": "세원아파트",
    "address": "경기도 연천군 전곡읍 선사로 399,",
    "region": "경기도 연천군",
    "dongCount": 5,
    "dongList": [
      "1",
      "2",
      "26",
      "3",
      "4"
    ],
    "totalHouseholds": 27,
    "completedHouseholds": 9,
    "contactPhone": "010-8555-2264",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_10_1",
        "dong": "4",
        "ho": "202",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_2",
        "dong": "1",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_3",
        "dong": "1",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_4",
        "dong": "1",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_5",
        "dong": "1",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_6",
        "dong": "1",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_7",
        "dong": "1",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_8",
        "dong": "1",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_9",
        "dong": "1",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_10",
        "dong": "1",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_11",
        "dong": "1",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_12",
        "dong": "1",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_13",
        "dong": "1",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_14",
        "dong": "1",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_15",
        "dong": "1",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_16",
        "dong": "2",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_17",
        "dong": "2",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_18",
        "dong": "2",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_19",
        "dong": "2",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_20",
        "dong": "2",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_21",
        "dong": "2",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_22",
        "dong": "2",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_23",
        "dong": "2",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_24",
        "dong": "3",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_10_25",
        "dong": "3",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_10_26",
        "dong": "3",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_10_27",
        "dong": "26",
        "ho": "7",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 9
  },
  {
    "id": "site_11",
    "name": "연천로하스아파트",
    "address": "경기도 연천군 연천읍 연천로336번길 40-10",
    "region": "경기도 연천군",
    "dongCount": 3,
    "dongList": [
      "101",
      "102",
      "35"
    ],
    "totalHouseholds": 36,
    "completedHouseholds": 12,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_11_1",
        "dong": "102",
        "ho": "702",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_2",
        "dong": "101",
        "ho": "406",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_3",
        "dong": "101",
        "ho": "1201",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_4",
        "dong": "101",
        "ho": "203",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_5",
        "dong": "101",
        "ho": "1502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_6",
        "dong": "102",
        "ho": "1101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_7",
        "dong": "101",
        "ho": "1006",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_8",
        "dong": "101",
        "ho": "1101",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_9",
        "dong": "101",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_10",
        "dong": "101",
        "ho": "1301",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_11",
        "dong": "101",
        "ho": "1401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_12",
        "dong": "101",
        "ho": "906",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_13",
        "dong": "102",
        "ho": "1202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_14",
        "dong": "101",
        "ho": "802",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_15",
        "dong": "101",
        "ho": "801",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_16",
        "dong": "102",
        "ho": "1301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_17",
        "dong": "102",
        "ho": "1002",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_18",
        "dong": "101",
        "ho": "501",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_19",
        "dong": "101",
        "ho": "803",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_20",
        "dong": "101",
        "ho": "506",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_21",
        "dong": "101",
        "ho": "1402",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_22",
        "dong": "101",
        "ho": "1302",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_23",
        "dong": "102",
        "ho": "701",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_24",
        "dong": "102",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_25",
        "dong": "102",
        "ho": "602",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_26",
        "dong": "102",
        "ho": "1302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_27",
        "dong": "101",
        "ho": "402",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_28",
        "dong": "102",
        "ho": "801",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_29",
        "dong": "102",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_30",
        "dong": "101",
        "ho": "1202",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_31",
        "dong": "101",
        "ho": "1501",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_32",
        "dong": "101",
        "ho": "106",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_33",
        "dong": "102",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_11_34",
        "dong": "101",
        "ho": "302",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_11_35",
        "dong": "101",
        "ho": "705",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_11_36",
        "dong": "35",
        "ho": "6",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "연천읍",
    "routeGroup": "연천 1동선 (연천읍 권역)",
    "workCompletedCount": 12
  },
  {
    "id": "site_12",
    "name": "영풍아파트",
    "address": "경기도 연천군 전곡읍 선사로 384",
    "region": "경기도 연천군",
    "dongCount": 3,
    "dongList": [
      "2",
      "가",
      "나"
    ],
    "totalHouseholds": 3,
    "completedHouseholds": 1,
    "contactPhone": "010-5730-8212",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_12_1",
        "dong": "나",
        "ho": "5002",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_12_2",
        "dong": "가",
        "ho": "4002",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_12_3",
        "dong": "2",
        "ho": "17",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 1
  },
  {
    "id": "site_13",
    "name": "원철그린빌아파트",
    "address": "경기도 연천군 연천읍 차옥로 6",
    "region": "경기도 연천군",
    "dongCount": 15,
    "dongList": [
      "14",
      "202",
      "203",
      "301",
      "302",
      "303",
      "304",
      "401",
      "402",
      "404",
      "501",
      "503",
      "604",
      "701",
      "702"
    ],
    "totalHouseholds": 15,
    "completedHouseholds": 5,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_13_1",
        "dong": "202",
        "ho": "1호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_13_2",
        "dong": "203",
        "ho": "2호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_13_3",
        "dong": "301",
        "ho": "3호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_13_4",
        "dong": "302",
        "ho": "4호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_13_5",
        "dong": "303",
        "ho": "5호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_13_6",
        "dong": "304",
        "ho": "6호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_13_7",
        "dong": "401",
        "ho": "7호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_13_8",
        "dong": "402",
        "ho": "8호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_13_9",
        "dong": "404",
        "ho": "9호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_13_10",
        "dong": "501",
        "ho": "10호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_13_11",
        "dong": "503",
        "ho": "11호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_13_12",
        "dong": "604",
        "ho": "12호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_13_13",
        "dong": "701",
        "ho": "13호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_13_14",
        "dong": "702",
        "ho": "14호",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_13_15",
        "dong": "14",
        "ho": "10",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "연천읍",
    "routeGroup": "연천 1동선 (연천읍 권역)",
    "workCompletedCount": 5
  },
  {
    "id": "site_14",
    "name": "전곡석미한아름아파트",
    "address": "경기도 연천군 전곡읍 선사로 415",
    "region": "경기도 연천군",
    "dongCount": 3,
    "dongList": [
      "101",
      "102",
      "62"
    ],
    "totalHouseholds": 63,
    "completedHouseholds": 21,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_14_1",
        "dong": "101",
        "ho": "707",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_2",
        "dong": "101",
        "ho": "1201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_3",
        "dong": "101",
        "ho": "903",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_4",
        "dong": "102",
        "ho": "807",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_5",
        "dong": "101",
        "ho": "1306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_6",
        "dong": "101",
        "ho": "1204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_7",
        "dong": "102",
        "ho": "1508",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_8",
        "dong": "102",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_9",
        "dong": "101",
        "ho": "1104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_10",
        "dong": "101",
        "ho": "704",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_11",
        "dong": "101",
        "ho": "1003",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_12",
        "dong": "101",
        "ho": "1001",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_13",
        "dong": "102",
        "ho": "601",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_14",
        "dong": "101",
        "ho": "507",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_15",
        "dong": "101",
        "ho": "907",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_16",
        "dong": "102",
        "ho": "605",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_17",
        "dong": "102",
        "ho": "1108",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_18",
        "dong": "102",
        "ho": "908",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_19",
        "dong": "101",
        "ho": "1107",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_20",
        "dong": "101",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_21",
        "dong": "101",
        "ho": "905",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_22",
        "dong": "101",
        "ho": "602",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_23",
        "dong": "101",
        "ho": "804",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_24",
        "dong": "101",
        "ho": "1006",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_25",
        "dong": "101",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_26",
        "dong": "101",
        "ho": "1203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_27",
        "dong": "101",
        "ho": "1207",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_28",
        "dong": "102",
        "ho": "705",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_29",
        "dong": "102",
        "ho": "604",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_30",
        "dong": "101",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_31",
        "dong": "102",
        "ho": "707",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_32",
        "dong": "101",
        "ho": "1102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_33",
        "dong": "101",
        "ho": "1004",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_34",
        "dong": "102",
        "ho": "1202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_35",
        "dong": "101",
        "ho": "1103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_36",
        "dong": "101",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_37",
        "dong": "101",
        "ho": "1406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_38",
        "dong": "102",
        "ho": "1003",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_39",
        "dong": "102",
        "ho": "806",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_40",
        "dong": "102",
        "ho": "1505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_41",
        "dong": "102",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_42",
        "dong": "102",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_43",
        "dong": "101",
        "ho": "706",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_44",
        "dong": "102",
        "ho": "1207",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_45",
        "dong": "101",
        "ho": "606",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_46",
        "dong": "102",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_47",
        "dong": "102",
        "ho": "1405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_48",
        "dong": "102",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_49",
        "dong": "101",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_50",
        "dong": "102",
        "ho": "903",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_51",
        "dong": "102",
        "ho": "1106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_52",
        "dong": "102",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_53",
        "dong": "102",
        "ho": "603",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_54",
        "dong": "101",
        "ho": "803",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_55",
        "dong": "102",
        "ho": "703",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_56",
        "dong": "102",
        "ho": "702",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_57",
        "dong": "102",
        "ho": "701",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_58",
        "dong": "101",
        "ho": "107",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_59",
        "dong": "102",
        "ho": "1308",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_60",
        "dong": "102",
        "ho": "1105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_14_61",
        "dong": "101",
        "ho": "1105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_14_62",
        "dong": "101",
        "ho": "1106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_14_63",
        "dong": "62",
        "ho": "5",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 21
  },
  {
    "id": "site_15",
    "name": "전곡읍 조흥아파트",
    "address": "경기도 연천군 전곡읍 밤골로 7",
    "region": "경기도 연천군",
    "dongCount": 7,
    "dongList": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "82"
    ],
    "totalHouseholds": 83,
    "completedHouseholds": 28,
    "contactPhone": "010-9346-0091",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_15_1",
        "dong": "6",
        "ho": "101",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_2",
        "dong": "3",
        "ho": "609",
        "headName": "세대주",
        "targetType": "아동(13세 미만)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_3",
        "dong": "1",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_4",
        "dong": "1",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_5",
        "dong": "1",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_6",
        "dong": "1",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_7",
        "dong": "1",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_8",
        "dong": "1",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_9",
        "dong": "1",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_10",
        "dong": "2",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_11",
        "dong": "2",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_12",
        "dong": "2",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_13",
        "dong": "2",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_14",
        "dong": "2",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_15",
        "dong": "2",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_16",
        "dong": "2",
        "ho": "302",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_17",
        "dong": "2",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_18",
        "dong": "2",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_19",
        "dong": "2",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_20",
        "dong": "2",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_21",
        "dong": "3",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_22",
        "dong": "3",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_23",
        "dong": "3",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_24",
        "dong": "3",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_25",
        "dong": "3",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_26",
        "dong": "3",
        "ho": "107",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_27",
        "dong": "3",
        "ho": "108",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_28",
        "dong": "3",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_29",
        "dong": "3",
        "ho": "202",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_30",
        "dong": "3",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_31",
        "dong": "3",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_32",
        "dong": "3",
        "ho": "207",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_33",
        "dong": "3",
        "ho": "209",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_34",
        "dong": "3",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_35",
        "dong": "3",
        "ho": "309",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_36",
        "dong": "3",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_37",
        "dong": "3",
        "ho": "403",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_38",
        "dong": "3",
        "ho": "408",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_39",
        "dong": "3",
        "ho": "504",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_40",
        "dong": "3",
        "ho": "505",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_41",
        "dong": "3",
        "ho": "507",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_42",
        "dong": "3",
        "ho": "508",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_43",
        "dong": "3",
        "ho": "509",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_44",
        "dong": "3",
        "ho": "603",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_45",
        "dong": "3",
        "ho": "606",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_46",
        "dong": "3",
        "ho": "607",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_47",
        "dong": "4",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_48",
        "dong": "4",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_49",
        "dong": "4",
        "ho": "103",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_50",
        "dong": "4",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_51",
        "dong": "4",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_52",
        "dong": "4",
        "ho": "203",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_53",
        "dong": "4",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_54",
        "dong": "4",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_55",
        "dong": "4",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_56",
        "dong": "4",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_57",
        "dong": "4",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_58",
        "dong": "4",
        "ho": "503",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_59",
        "dong": "4",
        "ho": "601",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_60",
        "dong": "5",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_61",
        "dong": "5",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_62",
        "dong": "5",
        "ho": "106",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_63",
        "dong": "5",
        "ho": "108",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_64",
        "dong": "5",
        "ho": "111",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_65",
        "dong": "5",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_66",
        "dong": "5",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_67",
        "dong": "5",
        "ho": "208",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_68",
        "dong": "5",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_69",
        "dong": "6",
        "ho": "304",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_70",
        "dong": "5",
        "ho": "305",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_71",
        "dong": "5",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_72",
        "dong": "5",
        "ho": "308",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_73",
        "dong": "5",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_74",
        "dong": "5",
        "ho": "404",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_75",
        "dong": "5",
        "ho": "405",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_76",
        "dong": "5",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_77",
        "dong": "5",
        "ho": "410",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_78",
        "dong": "5",
        "ho": "502",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_79",
        "dong": "5",
        "ho": "508",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_80",
        "dong": "5",
        "ho": "509",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_15_81",
        "dong": "5",
        "ho": "513",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_15_82",
        "dong": "5",
        "ho": "602",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_15_83",
        "dong": "82",
        "ho": "3",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "방문예정",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 28
  },
  {
    "id": "site_16",
    "name": "진상아파트",
    "address": "경기도 연천군 전곡읍 전곡로75번길 44",
    "region": "경기도 연천군",
    "dongCount": 2,
    "dongList": [
      "20",
      "가"
    ],
    "totalHouseholds": 21,
    "completedHouseholds": 7,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_16_1",
        "dong": "가",
        "ho": "101",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_2",
        "dong": "가",
        "ho": "102",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_3",
        "dong": "가",
        "ho": "105",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_16_4",
        "dong": "가",
        "ho": "107",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_5",
        "dong": "가",
        "ho": "109",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_6",
        "dong": "가",
        "ho": "110",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_16_7",
        "dong": "가",
        "ho": "111",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_8",
        "dong": "가",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_9",
        "dong": "가",
        "ho": "205",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_16_10",
        "dong": "가",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_11",
        "dong": "가",
        "ho": "208",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_12",
        "dong": "가",
        "ho": "210",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_16_13",
        "dong": "가",
        "ho": "211",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_14",
        "dong": "가",
        "ho": "306",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_15",
        "dong": "가",
        "ho": "308",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_16_16",
        "dong": "가",
        "ho": "309",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_17",
        "dong": "가",
        "ho": "311",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_18",
        "dong": "가",
        "ho": "409",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_16_19",
        "dong": "가",
        "ho": "409",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_16_20",
        "dong": "가",
        "ho": "411",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_16_21",
        "dong": "20",
        "ho": "9",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "미설치",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 7
  },
  {
    "id": "site_17",
    "name": "태풍아파트",
    "address": "경기도 연천군 전곡읍 평화로699번길 22",
    "region": "경기도 연천군",
    "dongCount": 3,
    "dongList": [
      "101",
      "102",
      "9"
    ],
    "totalHouseholds": 10,
    "completedHouseholds": 4,
    "contactPhone": "031-839-2119",
    "status": "진행중",
    "households": [
      {
        "id": "hh_site_17_1",
        "dong": "101",
        "ho": "402",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_17_2",
        "dong": "101",
        "ho": "406",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_17_3",
        "dong": "101",
        "ho": "104",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_17_4",
        "dong": "101",
        "ho": "301",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_17_5",
        "dong": "101",
        "ho": "401",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_17_6",
        "dong": "102",
        "ho": "201",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_17_7",
        "dong": "102",
        "ho": "204",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료",
        "remarks": ""
      },
      {
        "id": "hh_site_17_8",
        "dong": "102",
        "ho": "206",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정",
        "remarks": ""
      },
      {
        "id": "hh_site_17_9",
        "dong": "102",
        "ho": "303",
        "headName": "세대주",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치",
        "remarks": ""
      },
      {
        "id": "hh_site_17_10",
        "dong": "9",
        "ho": "16",
        "headName": "세대주",
        "targetType": "일반",
        "installStatus": "설치완료",
        "remarks": ""
      }
    ],
    "sido": "경기도",
    "sigungu": "연천군",
    "eupmyeondong": "전곡읍",
    "routeGroup": "연천 2동선 (전곡읍 중심권역)",
    "workCompletedCount": 4
  },
  {
    "id": "site_sw_1",
    "name": "천천현대아파트",
    "address": "경기도 수원시 장안구 하률로46번길 17",
    "region": "수원시",
    "sido": "경기도",
    "sigungu": "수원시",
    "eupmyeondong": "장안구 (천천동)",
    "routeGroup": "수원 1동선 (장안/팔달 A권역)",
    "dongCount": 2,
    "dongList": [
      "101",
      "102"
    ],
    "totalHouseholds": 139,
    "completedHouseholds": 0,
    "contactPhone": "031-240-1114",
    "status": "대기",
    "workCompletedCount": 0,
    "households": [
      {
        "id": "hh_sw1_1",
        "dong": "101",
        "ho": "101호",
        "headName": "세대주_1",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_2",
        "dong": "101",
        "ho": "102호",
        "headName": "세대주_2",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_3",
        "dong": "101",
        "ho": "103호",
        "headName": "세대주_3",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_4",
        "dong": "101",
        "ho": "104호",
        "headName": "세대주_4",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_5",
        "dong": "101",
        "ho": "105호",
        "headName": "세대주_5",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_6",
        "dong": "101",
        "ho": "106호",
        "headName": "세대주_6",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_7",
        "dong": "101",
        "ho": "107호",
        "headName": "세대주_7",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_8",
        "dong": "101",
        "ho": "108호",
        "headName": "세대주_8",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_9",
        "dong": "101",
        "ho": "109호",
        "headName": "세대주_9",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_10",
        "dong": "101",
        "ho": "1010호",
        "headName": "세대주_10",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_11",
        "dong": "101",
        "ho": "201호",
        "headName": "세대주_11",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_12",
        "dong": "101",
        "ho": "202호",
        "headName": "세대주_12",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_13",
        "dong": "101",
        "ho": "203호",
        "headName": "세대주_13",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_14",
        "dong": "101",
        "ho": "204호",
        "headName": "세대주_14",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_15",
        "dong": "101",
        "ho": "205호",
        "headName": "세대주_15",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_16",
        "dong": "101",
        "ho": "206호",
        "headName": "세대주_16",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_17",
        "dong": "101",
        "ho": "207호",
        "headName": "세대주_17",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_18",
        "dong": "101",
        "ho": "208호",
        "headName": "세대주_18",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_19",
        "dong": "101",
        "ho": "209호",
        "headName": "세대주_19",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_20",
        "dong": "101",
        "ho": "2010호",
        "headName": "세대주_20",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_21",
        "dong": "101",
        "ho": "301호",
        "headName": "세대주_21",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_22",
        "dong": "101",
        "ho": "302호",
        "headName": "세대주_22",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_23",
        "dong": "101",
        "ho": "303호",
        "headName": "세대주_23",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_24",
        "dong": "101",
        "ho": "304호",
        "headName": "세대주_24",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_25",
        "dong": "101",
        "ho": "305호",
        "headName": "세대주_25",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_26",
        "dong": "101",
        "ho": "306호",
        "headName": "세대주_26",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_27",
        "dong": "101",
        "ho": "307호",
        "headName": "세대주_27",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_28",
        "dong": "101",
        "ho": "308호",
        "headName": "세대주_28",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_29",
        "dong": "101",
        "ho": "309호",
        "headName": "세대주_29",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_30",
        "dong": "101",
        "ho": "3010호",
        "headName": "세대주_30",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_31",
        "dong": "101",
        "ho": "401호",
        "headName": "세대주_31",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_32",
        "dong": "101",
        "ho": "402호",
        "headName": "세대주_32",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_33",
        "dong": "101",
        "ho": "403호",
        "headName": "세대주_33",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_34",
        "dong": "101",
        "ho": "404호",
        "headName": "세대주_34",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_35",
        "dong": "101",
        "ho": "405호",
        "headName": "세대주_35",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_36",
        "dong": "101",
        "ho": "406호",
        "headName": "세대주_36",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_37",
        "dong": "101",
        "ho": "407호",
        "headName": "세대주_37",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_38",
        "dong": "101",
        "ho": "408호",
        "headName": "세대주_38",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_39",
        "dong": "101",
        "ho": "409호",
        "headName": "세대주_39",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_40",
        "dong": "101",
        "ho": "4010호",
        "headName": "세대주_40",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_41",
        "dong": "101",
        "ho": "501호",
        "headName": "세대주_41",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_42",
        "dong": "101",
        "ho": "502호",
        "headName": "세대주_42",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_43",
        "dong": "101",
        "ho": "503호",
        "headName": "세대주_43",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_44",
        "dong": "101",
        "ho": "504호",
        "headName": "세대주_44",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_45",
        "dong": "101",
        "ho": "505호",
        "headName": "세대주_45",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_46",
        "dong": "101",
        "ho": "506호",
        "headName": "세대주_46",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_47",
        "dong": "101",
        "ho": "507호",
        "headName": "세대주_47",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_48",
        "dong": "101",
        "ho": "508호",
        "headName": "세대주_48",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_49",
        "dong": "101",
        "ho": "509호",
        "headName": "세대주_49",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_50",
        "dong": "101",
        "ho": "5010호",
        "headName": "세대주_50",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_51",
        "dong": "101",
        "ho": "601호",
        "headName": "세대주_51",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_52",
        "dong": "101",
        "ho": "602호",
        "headName": "세대주_52",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_53",
        "dong": "101",
        "ho": "603호",
        "headName": "세대주_53",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_54",
        "dong": "101",
        "ho": "604호",
        "headName": "세대주_54",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_55",
        "dong": "101",
        "ho": "605호",
        "headName": "세대주_55",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_56",
        "dong": "101",
        "ho": "606호",
        "headName": "세대주_56",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_57",
        "dong": "101",
        "ho": "607호",
        "headName": "세대주_57",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_58",
        "dong": "101",
        "ho": "608호",
        "headName": "세대주_58",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_59",
        "dong": "101",
        "ho": "609호",
        "headName": "세대주_59",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_60",
        "dong": "101",
        "ho": "6010호",
        "headName": "세대주_60",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_61",
        "dong": "101",
        "ho": "701호",
        "headName": "세대주_61",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_62",
        "dong": "101",
        "ho": "702호",
        "headName": "세대주_62",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_63",
        "dong": "101",
        "ho": "703호",
        "headName": "세대주_63",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_64",
        "dong": "101",
        "ho": "704호",
        "headName": "세대주_64",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_65",
        "dong": "101",
        "ho": "705호",
        "headName": "세대주_65",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_66",
        "dong": "101",
        "ho": "706호",
        "headName": "세대주_66",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_67",
        "dong": "101",
        "ho": "707호",
        "headName": "세대주_67",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_68",
        "dong": "101",
        "ho": "708호",
        "headName": "세대주_68",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_69",
        "dong": "101",
        "ho": "709호",
        "headName": "세대주_69",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_70",
        "dong": "101",
        "ho": "7010호",
        "headName": "세대주_70",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_71",
        "dong": "102",
        "ho": "801호",
        "headName": "세대주_71",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_72",
        "dong": "102",
        "ho": "802호",
        "headName": "세대주_72",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_73",
        "dong": "102",
        "ho": "803호",
        "headName": "세대주_73",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_74",
        "dong": "102",
        "ho": "804호",
        "headName": "세대주_74",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_75",
        "dong": "102",
        "ho": "805호",
        "headName": "세대주_75",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_76",
        "dong": "102",
        "ho": "806호",
        "headName": "세대주_76",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_77",
        "dong": "102",
        "ho": "807호",
        "headName": "세대주_77",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_78",
        "dong": "102",
        "ho": "808호",
        "headName": "세대주_78",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_79",
        "dong": "102",
        "ho": "809호",
        "headName": "세대주_79",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_80",
        "dong": "102",
        "ho": "8010호",
        "headName": "세대주_80",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_81",
        "dong": "102",
        "ho": "901호",
        "headName": "세대주_81",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_82",
        "dong": "102",
        "ho": "902호",
        "headName": "세대주_82",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_83",
        "dong": "102",
        "ho": "903호",
        "headName": "세대주_83",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_84",
        "dong": "102",
        "ho": "904호",
        "headName": "세대주_84",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_85",
        "dong": "102",
        "ho": "905호",
        "headName": "세대주_85",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_86",
        "dong": "102",
        "ho": "906호",
        "headName": "세대주_86",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_87",
        "dong": "102",
        "ho": "907호",
        "headName": "세대주_87",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_88",
        "dong": "102",
        "ho": "908호",
        "headName": "세대주_88",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_89",
        "dong": "102",
        "ho": "909호",
        "headName": "세대주_89",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_90",
        "dong": "102",
        "ho": "9010호",
        "headName": "세대주_90",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_91",
        "dong": "102",
        "ho": "1001호",
        "headName": "세대주_91",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_92",
        "dong": "102",
        "ho": "1002호",
        "headName": "세대주_92",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_93",
        "dong": "102",
        "ho": "1003호",
        "headName": "세대주_93",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_94",
        "dong": "102",
        "ho": "1004호",
        "headName": "세대주_94",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_95",
        "dong": "102",
        "ho": "1005호",
        "headName": "세대주_95",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_96",
        "dong": "102",
        "ho": "1006호",
        "headName": "세대주_96",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_97",
        "dong": "102",
        "ho": "1007호",
        "headName": "세대주_97",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_98",
        "dong": "102",
        "ho": "1008호",
        "headName": "세대주_98",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_99",
        "dong": "102",
        "ho": "1009호",
        "headName": "세대주_99",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_100",
        "dong": "102",
        "ho": "10010호",
        "headName": "세대주_100",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_101",
        "dong": "102",
        "ho": "1101호",
        "headName": "세대주_101",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_102",
        "dong": "102",
        "ho": "1102호",
        "headName": "세대주_102",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_103",
        "dong": "102",
        "ho": "1103호",
        "headName": "세대주_103",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_104",
        "dong": "102",
        "ho": "1104호",
        "headName": "세대주_104",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_105",
        "dong": "102",
        "ho": "1105호",
        "headName": "세대주_105",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_106",
        "dong": "102",
        "ho": "1106호",
        "headName": "세대주_106",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_107",
        "dong": "102",
        "ho": "1107호",
        "headName": "세대주_107",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_108",
        "dong": "102",
        "ho": "1108호",
        "headName": "세대주_108",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_109",
        "dong": "102",
        "ho": "1109호",
        "headName": "세대주_109",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_110",
        "dong": "102",
        "ho": "11010호",
        "headName": "세대주_110",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_111",
        "dong": "102",
        "ho": "1201호",
        "headName": "세대주_111",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_112",
        "dong": "102",
        "ho": "1202호",
        "headName": "세대주_112",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_113",
        "dong": "102",
        "ho": "1203호",
        "headName": "세대주_113",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_114",
        "dong": "102",
        "ho": "1204호",
        "headName": "세대주_114",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_115",
        "dong": "102",
        "ho": "1205호",
        "headName": "세대주_115",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_116",
        "dong": "102",
        "ho": "1206호",
        "headName": "세대주_116",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_117",
        "dong": "102",
        "ho": "1207호",
        "headName": "세대주_117",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_118",
        "dong": "102",
        "ho": "1208호",
        "headName": "세대주_118",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_119",
        "dong": "102",
        "ho": "1209호",
        "headName": "세대주_119",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_120",
        "dong": "102",
        "ho": "12010호",
        "headName": "세대주_120",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_121",
        "dong": "102",
        "ho": "1301호",
        "headName": "세대주_121",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_122",
        "dong": "102",
        "ho": "1302호",
        "headName": "세대주_122",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_123",
        "dong": "102",
        "ho": "1303호",
        "headName": "세대주_123",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_124",
        "dong": "102",
        "ho": "1304호",
        "headName": "세대주_124",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_125",
        "dong": "102",
        "ho": "1305호",
        "headName": "세대주_125",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_126",
        "dong": "102",
        "ho": "1306호",
        "headName": "세대주_126",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_127",
        "dong": "102",
        "ho": "1307호",
        "headName": "세대주_127",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_128",
        "dong": "102",
        "ho": "1308호",
        "headName": "세대주_128",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_129",
        "dong": "102",
        "ho": "1309호",
        "headName": "세대주_129",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_130",
        "dong": "102",
        "ho": "13010호",
        "headName": "세대주_130",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_131",
        "dong": "102",
        "ho": "1401호",
        "headName": "세대주_131",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_132",
        "dong": "102",
        "ho": "1402호",
        "headName": "세대주_132",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_133",
        "dong": "102",
        "ho": "1403호",
        "headName": "세대주_133",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_134",
        "dong": "102",
        "ho": "1404호",
        "headName": "세대주_134",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_135",
        "dong": "102",
        "ho": "1405호",
        "headName": "세대주_135",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_136",
        "dong": "102",
        "ho": "1406호",
        "headName": "세대주_136",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_137",
        "dong": "102",
        "ho": "1407호",
        "headName": "세대주_137",
        "targetType": "노인(65세 이상)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_138",
        "dong": "102",
        "ho": "1408호",
        "headName": "세대주_138",
        "targetType": "아동(13세 미만)",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw1_139",
        "dong": "102",
        "ho": "1409호",
        "headName": "세대주_139",
        "targetType": "일반",
        "installStatus": "미설치"
      }
    ]
  },
  {
    "id": "site_sw_2",
    "name": "우만동 주공아파트4단지",
    "address": "경기도 수원시 팔달구 창룡대로 1",
    "region": "수원시",
    "sido": "경기도",
    "sigungu": "수원시",
    "eupmyeondong": "팔달구 (우만동)",
    "routeGroup": "수원 2동선 (우만/팔달 B권역)",
    "dongCount": 4,
    "dongList": [
      "401",
      "402",
      "403",
      "404"
    ],
    "totalHouseholds": 107,
    "completedHouseholds": 72,
    "contactPhone": "031-255-8899",
    "status": "진행중",
    "assignedUserId": "worker_kim01",
    "assignedUserName": "김연태_부산",
    "assignedUserPhone": "010-4665-6802",
    "workStartDate": "2026-08-03",
    "workCompletedCount": 72,
    "households": [
      {
        "id": "hh_sw2_1",
        "dong": "401",
        "ho": "101호",
        "headName": "세대주_1",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_2",
        "dong": "402",
        "ho": "102호",
        "headName": "세대주_2",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_3",
        "dong": "403",
        "ho": "103호",
        "headName": "세대주_3",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_4",
        "dong": "404",
        "ho": "104호",
        "headName": "세대주_4",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_5",
        "dong": "401",
        "ho": "105호",
        "headName": "세대주_5",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_6",
        "dong": "402",
        "ho": "106호",
        "headName": "세대주_6",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_7",
        "dong": "403",
        "ho": "107호",
        "headName": "세대주_7",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_8",
        "dong": "404",
        "ho": "108호",
        "headName": "세대주_8",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_9",
        "dong": "401",
        "ho": "109호",
        "headName": "세대주_9",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_10",
        "dong": "402",
        "ho": "1010호",
        "headName": "세대주_10",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_11",
        "dong": "403",
        "ho": "201호",
        "headName": "세대주_11",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_12",
        "dong": "404",
        "ho": "202호",
        "headName": "세대주_12",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_13",
        "dong": "401",
        "ho": "203호",
        "headName": "세대주_13",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_14",
        "dong": "402",
        "ho": "204호",
        "headName": "세대주_14",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_15",
        "dong": "403",
        "ho": "205호",
        "headName": "세대주_15",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_16",
        "dong": "404",
        "ho": "206호",
        "headName": "세대주_16",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_17",
        "dong": "401",
        "ho": "207호",
        "headName": "세대주_17",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_18",
        "dong": "402",
        "ho": "208호",
        "headName": "세대주_18",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_19",
        "dong": "403",
        "ho": "209호",
        "headName": "세대주_19",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_20",
        "dong": "404",
        "ho": "2010호",
        "headName": "세대주_20",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_21",
        "dong": "401",
        "ho": "301호",
        "headName": "세대주_21",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_22",
        "dong": "402",
        "ho": "302호",
        "headName": "세대주_22",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_23",
        "dong": "403",
        "ho": "303호",
        "headName": "세대주_23",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_24",
        "dong": "404",
        "ho": "304호",
        "headName": "세대주_24",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_25",
        "dong": "401",
        "ho": "305호",
        "headName": "세대주_25",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_26",
        "dong": "402",
        "ho": "306호",
        "headName": "세대주_26",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_27",
        "dong": "403",
        "ho": "307호",
        "headName": "세대주_27",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_28",
        "dong": "404",
        "ho": "308호",
        "headName": "세대주_28",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_29",
        "dong": "401",
        "ho": "309호",
        "headName": "세대주_29",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_30",
        "dong": "402",
        "ho": "3010호",
        "headName": "세대주_30",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_31",
        "dong": "403",
        "ho": "401호",
        "headName": "세대주_31",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_32",
        "dong": "404",
        "ho": "402호",
        "headName": "세대주_32",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_33",
        "dong": "401",
        "ho": "403호",
        "headName": "세대주_33",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_34",
        "dong": "402",
        "ho": "404호",
        "headName": "세대주_34",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_35",
        "dong": "403",
        "ho": "405호",
        "headName": "세대주_35",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_36",
        "dong": "404",
        "ho": "406호",
        "headName": "세대주_36",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_37",
        "dong": "401",
        "ho": "407호",
        "headName": "세대주_37",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_38",
        "dong": "402",
        "ho": "408호",
        "headName": "세대주_38",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_39",
        "dong": "403",
        "ho": "409호",
        "headName": "세대주_39",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_40",
        "dong": "404",
        "ho": "4010호",
        "headName": "세대주_40",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_41",
        "dong": "401",
        "ho": "501호",
        "headName": "세대주_41",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_42",
        "dong": "402",
        "ho": "502호",
        "headName": "세대주_42",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_43",
        "dong": "403",
        "ho": "503호",
        "headName": "세대주_43",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_44",
        "dong": "404",
        "ho": "504호",
        "headName": "세대주_44",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_45",
        "dong": "401",
        "ho": "505호",
        "headName": "세대주_45",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_46",
        "dong": "402",
        "ho": "506호",
        "headName": "세대주_46",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_47",
        "dong": "403",
        "ho": "507호",
        "headName": "세대주_47",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_48",
        "dong": "404",
        "ho": "508호",
        "headName": "세대주_48",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_49",
        "dong": "401",
        "ho": "509호",
        "headName": "세대주_49",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_50",
        "dong": "402",
        "ho": "5010호",
        "headName": "세대주_50",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_51",
        "dong": "403",
        "ho": "601호",
        "headName": "세대주_51",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_52",
        "dong": "404",
        "ho": "602호",
        "headName": "세대주_52",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_53",
        "dong": "401",
        "ho": "603호",
        "headName": "세대주_53",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_54",
        "dong": "402",
        "ho": "604호",
        "headName": "세대주_54",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_55",
        "dong": "403",
        "ho": "605호",
        "headName": "세대주_55",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_56",
        "dong": "404",
        "ho": "606호",
        "headName": "세대주_56",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_57",
        "dong": "401",
        "ho": "607호",
        "headName": "세대주_57",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_58",
        "dong": "402",
        "ho": "608호",
        "headName": "세대주_58",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_59",
        "dong": "403",
        "ho": "609호",
        "headName": "세대주_59",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_60",
        "dong": "404",
        "ho": "6010호",
        "headName": "세대주_60",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_61",
        "dong": "401",
        "ho": "701호",
        "headName": "세대주_61",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_62",
        "dong": "402",
        "ho": "702호",
        "headName": "세대주_62",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_63",
        "dong": "403",
        "ho": "703호",
        "headName": "세대주_63",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_64",
        "dong": "404",
        "ho": "704호",
        "headName": "세대주_64",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_65",
        "dong": "401",
        "ho": "705호",
        "headName": "세대주_65",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_66",
        "dong": "402",
        "ho": "706호",
        "headName": "세대주_66",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_67",
        "dong": "403",
        "ho": "707호",
        "headName": "세대주_67",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_68",
        "dong": "404",
        "ho": "708호",
        "headName": "세대주_68",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_69",
        "dong": "401",
        "ho": "709호",
        "headName": "세대주_69",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_70",
        "dong": "402",
        "ho": "7010호",
        "headName": "세대주_70",
        "targetType": "노인(65세 이상)",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_71",
        "dong": "403",
        "ho": "801호",
        "headName": "세대주_71",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_72",
        "dong": "404",
        "ho": "802호",
        "headName": "세대주_72",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw2_73",
        "dong": "401",
        "ho": "803호",
        "headName": "세대주_73",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_74",
        "dong": "402",
        "ho": "804호",
        "headName": "세대주_74",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_75",
        "dong": "403",
        "ho": "805호",
        "headName": "세대주_75",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_76",
        "dong": "404",
        "ho": "806호",
        "headName": "세대주_76",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_77",
        "dong": "401",
        "ho": "807호",
        "headName": "세대주_77",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_78",
        "dong": "402",
        "ho": "808호",
        "headName": "세대주_78",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_79",
        "dong": "403",
        "ho": "809호",
        "headName": "세대주_79",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_80",
        "dong": "404",
        "ho": "8010호",
        "headName": "세대주_80",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_81",
        "dong": "401",
        "ho": "901호",
        "headName": "세대주_81",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_82",
        "dong": "402",
        "ho": "902호",
        "headName": "세대주_82",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_83",
        "dong": "403",
        "ho": "903호",
        "headName": "세대주_83",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_84",
        "dong": "404",
        "ho": "904호",
        "headName": "세대주_84",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_85",
        "dong": "401",
        "ho": "905호",
        "headName": "세대주_85",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_86",
        "dong": "402",
        "ho": "906호",
        "headName": "세대주_86",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_87",
        "dong": "403",
        "ho": "907호",
        "headName": "세대주_87",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_88",
        "dong": "404",
        "ho": "908호",
        "headName": "세대주_88",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_89",
        "dong": "401",
        "ho": "909호",
        "headName": "세대주_89",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_90",
        "dong": "402",
        "ho": "9010호",
        "headName": "세대주_90",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_91",
        "dong": "403",
        "ho": "1001호",
        "headName": "세대주_91",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_92",
        "dong": "404",
        "ho": "1002호",
        "headName": "세대주_92",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_93",
        "dong": "401",
        "ho": "1003호",
        "headName": "세대주_93",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_94",
        "dong": "402",
        "ho": "1004호",
        "headName": "세대주_94",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_95",
        "dong": "403",
        "ho": "1005호",
        "headName": "세대주_95",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_96",
        "dong": "404",
        "ho": "1006호",
        "headName": "세대주_96",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_97",
        "dong": "401",
        "ho": "1007호",
        "headName": "세대주_97",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_98",
        "dong": "402",
        "ho": "1008호",
        "headName": "세대주_98",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_99",
        "dong": "403",
        "ho": "1009호",
        "headName": "세대주_99",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_100",
        "dong": "404",
        "ho": "10010호",
        "headName": "세대주_100",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_101",
        "dong": "401",
        "ho": "1101호",
        "headName": "세대주_101",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_102",
        "dong": "402",
        "ho": "1102호",
        "headName": "세대주_102",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_103",
        "dong": "403",
        "ho": "1103호",
        "headName": "세대주_103",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_104",
        "dong": "404",
        "ho": "1104호",
        "headName": "세대주_104",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_105",
        "dong": "401",
        "ho": "1105호",
        "headName": "세대주_105",
        "targetType": "일반",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_106",
        "dong": "402",
        "ho": "1106호",
        "headName": "세대주_106",
        "targetType": "노인(65세 이상)",
        "installStatus": "방문예정"
      },
      {
        "id": "hh_sw2_107",
        "dong": "403",
        "ho": "1107호",
        "headName": "세대주_107",
        "targetType": "일반",
        "installStatus": "방문예정"
      }
    ]
  },
  {
    "id": "site_sw_3",
    "name": "우만동 주공아파트3단지",
    "address": "경기도 수원시 팔달구 창룡대로 21",
    "region": "수원시",
    "sido": "경기도",
    "sigungu": "수원시",
    "eupmyeondong": "팔달구 (우만동)",
    "routeGroup": "수원 2동선 (우만/팔달 B권역)",
    "dongCount": 8,
    "dongList": [
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "307",
      "308"
    ],
    "totalHouseholds": 527,
    "completedHouseholds": 19,
    "contactPhone": "031-255-8890",
    "status": "진행중",
    "assignedUserId": "worker_kim01",
    "assignedUserName": "김연태_부산",
    "assignedUserPhone": "010-4665-6802",
    "workStartDate": "2026-08-03",
    "workCompletedCount": 19,
    "households": [
      {
        "id": "hh_sw3_1",
        "dong": "301",
        "ho": "101호",
        "headName": "세대주_1",
        "targetType": "장애인",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_2",
        "dong": "302",
        "ho": "102호",
        "headName": "세대주_2",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_3",
        "dong": "303",
        "ho": "103호",
        "headName": "세대주_3",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_4",
        "dong": "304",
        "ho": "104호",
        "headName": "세대주_4",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_5",
        "dong": "305",
        "ho": "105호",
        "headName": "세대주_5",
        "targetType": "장애인",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_6",
        "dong": "306",
        "ho": "106호",
        "headName": "세대주_6",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_7",
        "dong": "307",
        "ho": "107호",
        "headName": "세대주_7",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_8",
        "dong": "308",
        "ho": "108호",
        "headName": "세대주_8",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_9",
        "dong": "301",
        "ho": "109호",
        "headName": "세대주_9",
        "targetType": "장애인",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_10",
        "dong": "302",
        "ho": "1010호",
        "headName": "세대주_10",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_11",
        "dong": "303",
        "ho": "201호",
        "headName": "세대주_11",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_12",
        "dong": "304",
        "ho": "202호",
        "headName": "세대주_12",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_13",
        "dong": "305",
        "ho": "203호",
        "headName": "세대주_13",
        "targetType": "장애인",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_14",
        "dong": "306",
        "ho": "204호",
        "headName": "세대주_14",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_15",
        "dong": "307",
        "ho": "205호",
        "headName": "세대주_15",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_16",
        "dong": "308",
        "ho": "206호",
        "headName": "세대주_16",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_17",
        "dong": "301",
        "ho": "207호",
        "headName": "세대주_17",
        "targetType": "장애인",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_18",
        "dong": "302",
        "ho": "208호",
        "headName": "세대주_18",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_19",
        "dong": "303",
        "ho": "209호",
        "headName": "세대주_19",
        "targetType": "일반",
        "installStatus": "설치완료"
      },
      {
        "id": "hh_sw3_20",
        "dong": "304",
        "ho": "2010호",
        "headName": "세대주_20",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_21",
        "dong": "305",
        "ho": "301호",
        "headName": "세대주_21",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_22",
        "dong": "306",
        "ho": "302호",
        "headName": "세대주_22",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_23",
        "dong": "307",
        "ho": "303호",
        "headName": "세대주_23",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_24",
        "dong": "308",
        "ho": "304호",
        "headName": "세대주_24",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_25",
        "dong": "301",
        "ho": "305호",
        "headName": "세대주_25",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_26",
        "dong": "302",
        "ho": "306호",
        "headName": "세대주_26",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_27",
        "dong": "303",
        "ho": "307호",
        "headName": "세대주_27",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_28",
        "dong": "304",
        "ho": "308호",
        "headName": "세대주_28",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_29",
        "dong": "305",
        "ho": "309호",
        "headName": "세대주_29",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_30",
        "dong": "306",
        "ho": "3010호",
        "headName": "세대주_30",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_31",
        "dong": "307",
        "ho": "401호",
        "headName": "세대주_31",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_32",
        "dong": "308",
        "ho": "402호",
        "headName": "세대주_32",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_33",
        "dong": "301",
        "ho": "403호",
        "headName": "세대주_33",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_34",
        "dong": "302",
        "ho": "404호",
        "headName": "세대주_34",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_35",
        "dong": "303",
        "ho": "405호",
        "headName": "세대주_35",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_36",
        "dong": "304",
        "ho": "406호",
        "headName": "세대주_36",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_37",
        "dong": "305",
        "ho": "407호",
        "headName": "세대주_37",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_38",
        "dong": "306",
        "ho": "408호",
        "headName": "세대주_38",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_39",
        "dong": "307",
        "ho": "409호",
        "headName": "세대주_39",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_40",
        "dong": "308",
        "ho": "4010호",
        "headName": "세대주_40",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_41",
        "dong": "301",
        "ho": "501호",
        "headName": "세대주_41",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_42",
        "dong": "302",
        "ho": "502호",
        "headName": "세대주_42",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_43",
        "dong": "303",
        "ho": "503호",
        "headName": "세대주_43",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_44",
        "dong": "304",
        "ho": "504호",
        "headName": "세대주_44",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_45",
        "dong": "305",
        "ho": "505호",
        "headName": "세대주_45",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_46",
        "dong": "306",
        "ho": "506호",
        "headName": "세대주_46",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_47",
        "dong": "307",
        "ho": "507호",
        "headName": "세대주_47",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_48",
        "dong": "308",
        "ho": "508호",
        "headName": "세대주_48",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_49",
        "dong": "301",
        "ho": "509호",
        "headName": "세대주_49",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_50",
        "dong": "302",
        "ho": "5010호",
        "headName": "세대주_50",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_51",
        "dong": "303",
        "ho": "601호",
        "headName": "세대주_51",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_52",
        "dong": "304",
        "ho": "602호",
        "headName": "세대주_52",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_53",
        "dong": "305",
        "ho": "603호",
        "headName": "세대주_53",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_54",
        "dong": "306",
        "ho": "604호",
        "headName": "세대주_54",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_55",
        "dong": "307",
        "ho": "605호",
        "headName": "세대주_55",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_56",
        "dong": "308",
        "ho": "606호",
        "headName": "세대주_56",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_57",
        "dong": "301",
        "ho": "607호",
        "headName": "세대주_57",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_58",
        "dong": "302",
        "ho": "608호",
        "headName": "세대주_58",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_59",
        "dong": "303",
        "ho": "609호",
        "headName": "세대주_59",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_60",
        "dong": "304",
        "ho": "6010호",
        "headName": "세대주_60",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_61",
        "dong": "305",
        "ho": "701호",
        "headName": "세대주_61",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_62",
        "dong": "306",
        "ho": "702호",
        "headName": "세대주_62",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_63",
        "dong": "307",
        "ho": "703호",
        "headName": "세대주_63",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_64",
        "dong": "308",
        "ho": "704호",
        "headName": "세대주_64",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_65",
        "dong": "301",
        "ho": "705호",
        "headName": "세대주_65",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_66",
        "dong": "302",
        "ho": "706호",
        "headName": "세대주_66",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_67",
        "dong": "303",
        "ho": "707호",
        "headName": "세대주_67",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_68",
        "dong": "304",
        "ho": "708호",
        "headName": "세대주_68",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_69",
        "dong": "305",
        "ho": "709호",
        "headName": "세대주_69",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_70",
        "dong": "306",
        "ho": "7010호",
        "headName": "세대주_70",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_71",
        "dong": "307",
        "ho": "801호",
        "headName": "세대주_71",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_72",
        "dong": "308",
        "ho": "802호",
        "headName": "세대주_72",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_73",
        "dong": "301",
        "ho": "803호",
        "headName": "세대주_73",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_74",
        "dong": "302",
        "ho": "804호",
        "headName": "세대주_74",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_75",
        "dong": "303",
        "ho": "805호",
        "headName": "세대주_75",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_76",
        "dong": "304",
        "ho": "806호",
        "headName": "세대주_76",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_77",
        "dong": "305",
        "ho": "807호",
        "headName": "세대주_77",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_78",
        "dong": "306",
        "ho": "808호",
        "headName": "세대주_78",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_79",
        "dong": "307",
        "ho": "809호",
        "headName": "세대주_79",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_80",
        "dong": "308",
        "ho": "8010호",
        "headName": "세대주_80",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_81",
        "dong": "301",
        "ho": "901호",
        "headName": "세대주_81",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_82",
        "dong": "302",
        "ho": "902호",
        "headName": "세대주_82",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_83",
        "dong": "303",
        "ho": "903호",
        "headName": "세대주_83",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_84",
        "dong": "304",
        "ho": "904호",
        "headName": "세대주_84",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_85",
        "dong": "305",
        "ho": "905호",
        "headName": "세대주_85",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_86",
        "dong": "306",
        "ho": "906호",
        "headName": "세대주_86",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_87",
        "dong": "307",
        "ho": "907호",
        "headName": "세대주_87",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_88",
        "dong": "308",
        "ho": "908호",
        "headName": "세대주_88",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_89",
        "dong": "301",
        "ho": "909호",
        "headName": "세대주_89",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_90",
        "dong": "302",
        "ho": "9010호",
        "headName": "세대주_90",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_91",
        "dong": "303",
        "ho": "1001호",
        "headName": "세대주_91",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_92",
        "dong": "304",
        "ho": "1002호",
        "headName": "세대주_92",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_93",
        "dong": "305",
        "ho": "1003호",
        "headName": "세대주_93",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_94",
        "dong": "306",
        "ho": "1004호",
        "headName": "세대주_94",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_95",
        "dong": "307",
        "ho": "1005호",
        "headName": "세대주_95",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_96",
        "dong": "308",
        "ho": "1006호",
        "headName": "세대주_96",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_97",
        "dong": "301",
        "ho": "1007호",
        "headName": "세대주_97",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_98",
        "dong": "302",
        "ho": "1008호",
        "headName": "세대주_98",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_99",
        "dong": "303",
        "ho": "1009호",
        "headName": "세대주_99",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_100",
        "dong": "304",
        "ho": "10010호",
        "headName": "세대주_100",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_101",
        "dong": "305",
        "ho": "1101호",
        "headName": "세대주_101",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_102",
        "dong": "306",
        "ho": "1102호",
        "headName": "세대주_102",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_103",
        "dong": "307",
        "ho": "1103호",
        "headName": "세대주_103",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_104",
        "dong": "308",
        "ho": "1104호",
        "headName": "세대주_104",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_105",
        "dong": "301",
        "ho": "1105호",
        "headName": "세대주_105",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_106",
        "dong": "302",
        "ho": "1106호",
        "headName": "세대주_106",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_107",
        "dong": "303",
        "ho": "1107호",
        "headName": "세대주_107",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_108",
        "dong": "304",
        "ho": "1108호",
        "headName": "세대주_108",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_109",
        "dong": "305",
        "ho": "1109호",
        "headName": "세대주_109",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_110",
        "dong": "306",
        "ho": "11010호",
        "headName": "세대주_110",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_111",
        "dong": "307",
        "ho": "1201호",
        "headName": "세대주_111",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_112",
        "dong": "308",
        "ho": "1202호",
        "headName": "세대주_112",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_113",
        "dong": "301",
        "ho": "1203호",
        "headName": "세대주_113",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_114",
        "dong": "302",
        "ho": "1204호",
        "headName": "세대주_114",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_115",
        "dong": "303",
        "ho": "1205호",
        "headName": "세대주_115",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_116",
        "dong": "304",
        "ho": "1206호",
        "headName": "세대주_116",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_117",
        "dong": "305",
        "ho": "1207호",
        "headName": "세대주_117",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_118",
        "dong": "306",
        "ho": "1208호",
        "headName": "세대주_118",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_119",
        "dong": "307",
        "ho": "1209호",
        "headName": "세대주_119",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_120",
        "dong": "308",
        "ho": "12010호",
        "headName": "세대주_120",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_121",
        "dong": "301",
        "ho": "1301호",
        "headName": "세대주_121",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_122",
        "dong": "302",
        "ho": "1302호",
        "headName": "세대주_122",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_123",
        "dong": "303",
        "ho": "1303호",
        "headName": "세대주_123",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_124",
        "dong": "304",
        "ho": "1304호",
        "headName": "세대주_124",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_125",
        "dong": "305",
        "ho": "1305호",
        "headName": "세대주_125",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_126",
        "dong": "306",
        "ho": "1306호",
        "headName": "세대주_126",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_127",
        "dong": "307",
        "ho": "1307호",
        "headName": "세대주_127",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_128",
        "dong": "308",
        "ho": "1308호",
        "headName": "세대주_128",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_129",
        "dong": "301",
        "ho": "1309호",
        "headName": "세대주_129",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_130",
        "dong": "302",
        "ho": "13010호",
        "headName": "세대주_130",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_131",
        "dong": "303",
        "ho": "1401호",
        "headName": "세대주_131",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_132",
        "dong": "304",
        "ho": "1402호",
        "headName": "세대주_132",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_133",
        "dong": "305",
        "ho": "1403호",
        "headName": "세대주_133",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_134",
        "dong": "306",
        "ho": "1404호",
        "headName": "세대주_134",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_135",
        "dong": "307",
        "ho": "1405호",
        "headName": "세대주_135",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_136",
        "dong": "308",
        "ho": "1406호",
        "headName": "세대주_136",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_137",
        "dong": "301",
        "ho": "1407호",
        "headName": "세대주_137",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_138",
        "dong": "302",
        "ho": "1408호",
        "headName": "세대주_138",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_139",
        "dong": "303",
        "ho": "1409호",
        "headName": "세대주_139",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_140",
        "dong": "304",
        "ho": "14010호",
        "headName": "세대주_140",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_141",
        "dong": "305",
        "ho": "1501호",
        "headName": "세대주_141",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_142",
        "dong": "306",
        "ho": "1502호",
        "headName": "세대주_142",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_143",
        "dong": "307",
        "ho": "1503호",
        "headName": "세대주_143",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_144",
        "dong": "308",
        "ho": "1504호",
        "headName": "세대주_144",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_145",
        "dong": "301",
        "ho": "1505호",
        "headName": "세대주_145",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_146",
        "dong": "302",
        "ho": "1506호",
        "headName": "세대주_146",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_147",
        "dong": "303",
        "ho": "1507호",
        "headName": "세대주_147",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_148",
        "dong": "304",
        "ho": "1508호",
        "headName": "세대주_148",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_149",
        "dong": "305",
        "ho": "1509호",
        "headName": "세대주_149",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_150",
        "dong": "306",
        "ho": "15010호",
        "headName": "세대주_150",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_151",
        "dong": "307",
        "ho": "1601호",
        "headName": "세대주_151",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_152",
        "dong": "308",
        "ho": "1602호",
        "headName": "세대주_152",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_153",
        "dong": "301",
        "ho": "1603호",
        "headName": "세대주_153",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_154",
        "dong": "302",
        "ho": "1604호",
        "headName": "세대주_154",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_155",
        "dong": "303",
        "ho": "1605호",
        "headName": "세대주_155",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_156",
        "dong": "304",
        "ho": "1606호",
        "headName": "세대주_156",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_157",
        "dong": "305",
        "ho": "1607호",
        "headName": "세대주_157",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_158",
        "dong": "306",
        "ho": "1608호",
        "headName": "세대주_158",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_159",
        "dong": "307",
        "ho": "1609호",
        "headName": "세대주_159",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_160",
        "dong": "308",
        "ho": "16010호",
        "headName": "세대주_160",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_161",
        "dong": "301",
        "ho": "1701호",
        "headName": "세대주_161",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_162",
        "dong": "302",
        "ho": "1702호",
        "headName": "세대주_162",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_163",
        "dong": "303",
        "ho": "1703호",
        "headName": "세대주_163",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_164",
        "dong": "304",
        "ho": "1704호",
        "headName": "세대주_164",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_165",
        "dong": "305",
        "ho": "1705호",
        "headName": "세대주_165",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_166",
        "dong": "306",
        "ho": "1706호",
        "headName": "세대주_166",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_167",
        "dong": "307",
        "ho": "1707호",
        "headName": "세대주_167",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_168",
        "dong": "308",
        "ho": "1708호",
        "headName": "세대주_168",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_169",
        "dong": "301",
        "ho": "1709호",
        "headName": "세대주_169",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_170",
        "dong": "302",
        "ho": "17010호",
        "headName": "세대주_170",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_171",
        "dong": "303",
        "ho": "1801호",
        "headName": "세대주_171",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_172",
        "dong": "304",
        "ho": "1802호",
        "headName": "세대주_172",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_173",
        "dong": "305",
        "ho": "1803호",
        "headName": "세대주_173",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_174",
        "dong": "306",
        "ho": "1804호",
        "headName": "세대주_174",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_175",
        "dong": "307",
        "ho": "1805호",
        "headName": "세대주_175",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_176",
        "dong": "308",
        "ho": "1806호",
        "headName": "세대주_176",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_177",
        "dong": "301",
        "ho": "1807호",
        "headName": "세대주_177",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_178",
        "dong": "302",
        "ho": "1808호",
        "headName": "세대주_178",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_179",
        "dong": "303",
        "ho": "1809호",
        "headName": "세대주_179",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_180",
        "dong": "304",
        "ho": "18010호",
        "headName": "세대주_180",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_181",
        "dong": "305",
        "ho": "1901호",
        "headName": "세대주_181",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_182",
        "dong": "306",
        "ho": "1902호",
        "headName": "세대주_182",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_183",
        "dong": "307",
        "ho": "1903호",
        "headName": "세대주_183",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_184",
        "dong": "308",
        "ho": "1904호",
        "headName": "세대주_184",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_185",
        "dong": "301",
        "ho": "1905호",
        "headName": "세대주_185",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_186",
        "dong": "302",
        "ho": "1906호",
        "headName": "세대주_186",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_187",
        "dong": "303",
        "ho": "1907호",
        "headName": "세대주_187",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_188",
        "dong": "304",
        "ho": "1908호",
        "headName": "세대주_188",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_189",
        "dong": "305",
        "ho": "1909호",
        "headName": "세대주_189",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_190",
        "dong": "306",
        "ho": "19010호",
        "headName": "세대주_190",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_191",
        "dong": "307",
        "ho": "2001호",
        "headName": "세대주_191",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_192",
        "dong": "308",
        "ho": "2002호",
        "headName": "세대주_192",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_193",
        "dong": "301",
        "ho": "2003호",
        "headName": "세대주_193",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_194",
        "dong": "302",
        "ho": "2004호",
        "headName": "세대주_194",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_195",
        "dong": "303",
        "ho": "2005호",
        "headName": "세대주_195",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_196",
        "dong": "304",
        "ho": "2006호",
        "headName": "세대주_196",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_197",
        "dong": "305",
        "ho": "2007호",
        "headName": "세대주_197",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_198",
        "dong": "306",
        "ho": "2008호",
        "headName": "세대주_198",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_199",
        "dong": "307",
        "ho": "2009호",
        "headName": "세대주_199",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_200",
        "dong": "308",
        "ho": "20010호",
        "headName": "세대주_200",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_201",
        "dong": "301",
        "ho": "2101호",
        "headName": "세대주_201",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_202",
        "dong": "302",
        "ho": "2102호",
        "headName": "세대주_202",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_203",
        "dong": "303",
        "ho": "2103호",
        "headName": "세대주_203",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_204",
        "dong": "304",
        "ho": "2104호",
        "headName": "세대주_204",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_205",
        "dong": "305",
        "ho": "2105호",
        "headName": "세대주_205",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_206",
        "dong": "306",
        "ho": "2106호",
        "headName": "세대주_206",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_207",
        "dong": "307",
        "ho": "2107호",
        "headName": "세대주_207",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_208",
        "dong": "308",
        "ho": "2108호",
        "headName": "세대주_208",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_209",
        "dong": "301",
        "ho": "2109호",
        "headName": "세대주_209",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_210",
        "dong": "302",
        "ho": "21010호",
        "headName": "세대주_210",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_211",
        "dong": "303",
        "ho": "2201호",
        "headName": "세대주_211",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_212",
        "dong": "304",
        "ho": "2202호",
        "headName": "세대주_212",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_213",
        "dong": "305",
        "ho": "2203호",
        "headName": "세대주_213",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_214",
        "dong": "306",
        "ho": "2204호",
        "headName": "세대주_214",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_215",
        "dong": "307",
        "ho": "2205호",
        "headName": "세대주_215",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_216",
        "dong": "308",
        "ho": "2206호",
        "headName": "세대주_216",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_217",
        "dong": "301",
        "ho": "2207호",
        "headName": "세대주_217",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_218",
        "dong": "302",
        "ho": "2208호",
        "headName": "세대주_218",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_219",
        "dong": "303",
        "ho": "2209호",
        "headName": "세대주_219",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_220",
        "dong": "304",
        "ho": "22010호",
        "headName": "세대주_220",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_221",
        "dong": "305",
        "ho": "2301호",
        "headName": "세대주_221",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_222",
        "dong": "306",
        "ho": "2302호",
        "headName": "세대주_222",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_223",
        "dong": "307",
        "ho": "2303호",
        "headName": "세대주_223",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_224",
        "dong": "308",
        "ho": "2304호",
        "headName": "세대주_224",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_225",
        "dong": "301",
        "ho": "2305호",
        "headName": "세대주_225",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_226",
        "dong": "302",
        "ho": "2306호",
        "headName": "세대주_226",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_227",
        "dong": "303",
        "ho": "2307호",
        "headName": "세대주_227",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_228",
        "dong": "304",
        "ho": "2308호",
        "headName": "세대주_228",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_229",
        "dong": "305",
        "ho": "2309호",
        "headName": "세대주_229",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_230",
        "dong": "306",
        "ho": "23010호",
        "headName": "세대주_230",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_231",
        "dong": "307",
        "ho": "2401호",
        "headName": "세대주_231",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_232",
        "dong": "308",
        "ho": "2402호",
        "headName": "세대주_232",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_233",
        "dong": "301",
        "ho": "2403호",
        "headName": "세대주_233",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_234",
        "dong": "302",
        "ho": "2404호",
        "headName": "세대주_234",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_235",
        "dong": "303",
        "ho": "2405호",
        "headName": "세대주_235",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_236",
        "dong": "304",
        "ho": "2406호",
        "headName": "세대주_236",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_237",
        "dong": "305",
        "ho": "2407호",
        "headName": "세대주_237",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_238",
        "dong": "306",
        "ho": "2408호",
        "headName": "세대주_238",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_239",
        "dong": "307",
        "ho": "2409호",
        "headName": "세대주_239",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_240",
        "dong": "308",
        "ho": "24010호",
        "headName": "세대주_240",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_241",
        "dong": "301",
        "ho": "2501호",
        "headName": "세대주_241",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_242",
        "dong": "302",
        "ho": "2502호",
        "headName": "세대주_242",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_243",
        "dong": "303",
        "ho": "2503호",
        "headName": "세대주_243",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_244",
        "dong": "304",
        "ho": "2504호",
        "headName": "세대주_244",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_245",
        "dong": "305",
        "ho": "2505호",
        "headName": "세대주_245",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_246",
        "dong": "306",
        "ho": "2506호",
        "headName": "세대주_246",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_247",
        "dong": "307",
        "ho": "2507호",
        "headName": "세대주_247",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_248",
        "dong": "308",
        "ho": "2508호",
        "headName": "세대주_248",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_249",
        "dong": "301",
        "ho": "2509호",
        "headName": "세대주_249",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_250",
        "dong": "302",
        "ho": "25010호",
        "headName": "세대주_250",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_251",
        "dong": "303",
        "ho": "2601호",
        "headName": "세대주_251",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_252",
        "dong": "304",
        "ho": "2602호",
        "headName": "세대주_252",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_253",
        "dong": "305",
        "ho": "2603호",
        "headName": "세대주_253",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_254",
        "dong": "306",
        "ho": "2604호",
        "headName": "세대주_254",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_255",
        "dong": "307",
        "ho": "2605호",
        "headName": "세대주_255",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_256",
        "dong": "308",
        "ho": "2606호",
        "headName": "세대주_256",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_257",
        "dong": "301",
        "ho": "2607호",
        "headName": "세대주_257",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_258",
        "dong": "302",
        "ho": "2608호",
        "headName": "세대주_258",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_259",
        "dong": "303",
        "ho": "2609호",
        "headName": "세대주_259",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_260",
        "dong": "304",
        "ho": "26010호",
        "headName": "세대주_260",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_261",
        "dong": "305",
        "ho": "2701호",
        "headName": "세대주_261",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_262",
        "dong": "306",
        "ho": "2702호",
        "headName": "세대주_262",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_263",
        "dong": "307",
        "ho": "2703호",
        "headName": "세대주_263",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_264",
        "dong": "308",
        "ho": "2704호",
        "headName": "세대주_264",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_265",
        "dong": "301",
        "ho": "2705호",
        "headName": "세대주_265",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_266",
        "dong": "302",
        "ho": "2706호",
        "headName": "세대주_266",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_267",
        "dong": "303",
        "ho": "2707호",
        "headName": "세대주_267",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_268",
        "dong": "304",
        "ho": "2708호",
        "headName": "세대주_268",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_269",
        "dong": "305",
        "ho": "2709호",
        "headName": "세대주_269",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_270",
        "dong": "306",
        "ho": "27010호",
        "headName": "세대주_270",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_271",
        "dong": "307",
        "ho": "2801호",
        "headName": "세대주_271",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_272",
        "dong": "308",
        "ho": "2802호",
        "headName": "세대주_272",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_273",
        "dong": "301",
        "ho": "2803호",
        "headName": "세대주_273",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_274",
        "dong": "302",
        "ho": "2804호",
        "headName": "세대주_274",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_275",
        "dong": "303",
        "ho": "2805호",
        "headName": "세대주_275",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_276",
        "dong": "304",
        "ho": "2806호",
        "headName": "세대주_276",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_277",
        "dong": "305",
        "ho": "2807호",
        "headName": "세대주_277",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_278",
        "dong": "306",
        "ho": "2808호",
        "headName": "세대주_278",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_279",
        "dong": "307",
        "ho": "2809호",
        "headName": "세대주_279",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_280",
        "dong": "308",
        "ho": "28010호",
        "headName": "세대주_280",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_281",
        "dong": "301",
        "ho": "2901호",
        "headName": "세대주_281",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_282",
        "dong": "302",
        "ho": "2902호",
        "headName": "세대주_282",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_283",
        "dong": "303",
        "ho": "2903호",
        "headName": "세대주_283",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_284",
        "dong": "304",
        "ho": "2904호",
        "headName": "세대주_284",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_285",
        "dong": "305",
        "ho": "2905호",
        "headName": "세대주_285",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_286",
        "dong": "306",
        "ho": "2906호",
        "headName": "세대주_286",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_287",
        "dong": "307",
        "ho": "2907호",
        "headName": "세대주_287",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_288",
        "dong": "308",
        "ho": "2908호",
        "headName": "세대주_288",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_289",
        "dong": "301",
        "ho": "2909호",
        "headName": "세대주_289",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_290",
        "dong": "302",
        "ho": "29010호",
        "headName": "세대주_290",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_291",
        "dong": "303",
        "ho": "3001호",
        "headName": "세대주_291",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_292",
        "dong": "304",
        "ho": "3002호",
        "headName": "세대주_292",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_293",
        "dong": "305",
        "ho": "3003호",
        "headName": "세대주_293",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_294",
        "dong": "306",
        "ho": "3004호",
        "headName": "세대주_294",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_295",
        "dong": "307",
        "ho": "3005호",
        "headName": "세대주_295",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_296",
        "dong": "308",
        "ho": "3006호",
        "headName": "세대주_296",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_297",
        "dong": "301",
        "ho": "3007호",
        "headName": "세대주_297",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_298",
        "dong": "302",
        "ho": "3008호",
        "headName": "세대주_298",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_299",
        "dong": "303",
        "ho": "3009호",
        "headName": "세대주_299",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_300",
        "dong": "304",
        "ho": "30010호",
        "headName": "세대주_300",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_301",
        "dong": "305",
        "ho": "3101호",
        "headName": "세대주_301",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_302",
        "dong": "306",
        "ho": "3102호",
        "headName": "세대주_302",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_303",
        "dong": "307",
        "ho": "3103호",
        "headName": "세대주_303",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_304",
        "dong": "308",
        "ho": "3104호",
        "headName": "세대주_304",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_305",
        "dong": "301",
        "ho": "3105호",
        "headName": "세대주_305",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_306",
        "dong": "302",
        "ho": "3106호",
        "headName": "세대주_306",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_307",
        "dong": "303",
        "ho": "3107호",
        "headName": "세대주_307",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_308",
        "dong": "304",
        "ho": "3108호",
        "headName": "세대주_308",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_309",
        "dong": "305",
        "ho": "3109호",
        "headName": "세대주_309",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_310",
        "dong": "306",
        "ho": "31010호",
        "headName": "세대주_310",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_311",
        "dong": "307",
        "ho": "3201호",
        "headName": "세대주_311",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_312",
        "dong": "308",
        "ho": "3202호",
        "headName": "세대주_312",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_313",
        "dong": "301",
        "ho": "3203호",
        "headName": "세대주_313",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_314",
        "dong": "302",
        "ho": "3204호",
        "headName": "세대주_314",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_315",
        "dong": "303",
        "ho": "3205호",
        "headName": "세대주_315",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_316",
        "dong": "304",
        "ho": "3206호",
        "headName": "세대주_316",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_317",
        "dong": "305",
        "ho": "3207호",
        "headName": "세대주_317",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_318",
        "dong": "306",
        "ho": "3208호",
        "headName": "세대주_318",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_319",
        "dong": "307",
        "ho": "3209호",
        "headName": "세대주_319",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_320",
        "dong": "308",
        "ho": "32010호",
        "headName": "세대주_320",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_321",
        "dong": "301",
        "ho": "3301호",
        "headName": "세대주_321",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_322",
        "dong": "302",
        "ho": "3302호",
        "headName": "세대주_322",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_323",
        "dong": "303",
        "ho": "3303호",
        "headName": "세대주_323",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_324",
        "dong": "304",
        "ho": "3304호",
        "headName": "세대주_324",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_325",
        "dong": "305",
        "ho": "3305호",
        "headName": "세대주_325",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_326",
        "dong": "306",
        "ho": "3306호",
        "headName": "세대주_326",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_327",
        "dong": "307",
        "ho": "3307호",
        "headName": "세대주_327",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_328",
        "dong": "308",
        "ho": "3308호",
        "headName": "세대주_328",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_329",
        "dong": "301",
        "ho": "3309호",
        "headName": "세대주_329",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_330",
        "dong": "302",
        "ho": "33010호",
        "headName": "세대주_330",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_331",
        "dong": "303",
        "ho": "3401호",
        "headName": "세대주_331",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_332",
        "dong": "304",
        "ho": "3402호",
        "headName": "세대주_332",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_333",
        "dong": "305",
        "ho": "3403호",
        "headName": "세대주_333",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_334",
        "dong": "306",
        "ho": "3404호",
        "headName": "세대주_334",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_335",
        "dong": "307",
        "ho": "3405호",
        "headName": "세대주_335",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_336",
        "dong": "308",
        "ho": "3406호",
        "headName": "세대주_336",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_337",
        "dong": "301",
        "ho": "3407호",
        "headName": "세대주_337",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_338",
        "dong": "302",
        "ho": "3408호",
        "headName": "세대주_338",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_339",
        "dong": "303",
        "ho": "3409호",
        "headName": "세대주_339",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_340",
        "dong": "304",
        "ho": "34010호",
        "headName": "세대주_340",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_341",
        "dong": "305",
        "ho": "3501호",
        "headName": "세대주_341",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_342",
        "dong": "306",
        "ho": "3502호",
        "headName": "세대주_342",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_343",
        "dong": "307",
        "ho": "3503호",
        "headName": "세대주_343",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_344",
        "dong": "308",
        "ho": "3504호",
        "headName": "세대주_344",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_345",
        "dong": "301",
        "ho": "3505호",
        "headName": "세대주_345",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_346",
        "dong": "302",
        "ho": "3506호",
        "headName": "세대주_346",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_347",
        "dong": "303",
        "ho": "3507호",
        "headName": "세대주_347",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_348",
        "dong": "304",
        "ho": "3508호",
        "headName": "세대주_348",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_349",
        "dong": "305",
        "ho": "3509호",
        "headName": "세대주_349",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_350",
        "dong": "306",
        "ho": "35010호",
        "headName": "세대주_350",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_351",
        "dong": "307",
        "ho": "3601호",
        "headName": "세대주_351",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_352",
        "dong": "308",
        "ho": "3602호",
        "headName": "세대주_352",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_353",
        "dong": "301",
        "ho": "3603호",
        "headName": "세대주_353",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_354",
        "dong": "302",
        "ho": "3604호",
        "headName": "세대주_354",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_355",
        "dong": "303",
        "ho": "3605호",
        "headName": "세대주_355",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_356",
        "dong": "304",
        "ho": "3606호",
        "headName": "세대주_356",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_357",
        "dong": "305",
        "ho": "3607호",
        "headName": "세대주_357",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_358",
        "dong": "306",
        "ho": "3608호",
        "headName": "세대주_358",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_359",
        "dong": "307",
        "ho": "3609호",
        "headName": "세대주_359",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_360",
        "dong": "308",
        "ho": "36010호",
        "headName": "세대주_360",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_361",
        "dong": "301",
        "ho": "3701호",
        "headName": "세대주_361",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_362",
        "dong": "302",
        "ho": "3702호",
        "headName": "세대주_362",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_363",
        "dong": "303",
        "ho": "3703호",
        "headName": "세대주_363",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_364",
        "dong": "304",
        "ho": "3704호",
        "headName": "세대주_364",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_365",
        "dong": "305",
        "ho": "3705호",
        "headName": "세대주_365",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_366",
        "dong": "306",
        "ho": "3706호",
        "headName": "세대주_366",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_367",
        "dong": "307",
        "ho": "3707호",
        "headName": "세대주_367",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_368",
        "dong": "308",
        "ho": "3708호",
        "headName": "세대주_368",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_369",
        "dong": "301",
        "ho": "3709호",
        "headName": "세대주_369",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_370",
        "dong": "302",
        "ho": "37010호",
        "headName": "세대주_370",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_371",
        "dong": "303",
        "ho": "3801호",
        "headName": "세대주_371",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_372",
        "dong": "304",
        "ho": "3802호",
        "headName": "세대주_372",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_373",
        "dong": "305",
        "ho": "3803호",
        "headName": "세대주_373",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_374",
        "dong": "306",
        "ho": "3804호",
        "headName": "세대주_374",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_375",
        "dong": "307",
        "ho": "3805호",
        "headName": "세대주_375",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_376",
        "dong": "308",
        "ho": "3806호",
        "headName": "세대주_376",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_377",
        "dong": "301",
        "ho": "3807호",
        "headName": "세대주_377",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_378",
        "dong": "302",
        "ho": "3808호",
        "headName": "세대주_378",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_379",
        "dong": "303",
        "ho": "3809호",
        "headName": "세대주_379",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_380",
        "dong": "304",
        "ho": "38010호",
        "headName": "세대주_380",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_381",
        "dong": "305",
        "ho": "3901호",
        "headName": "세대주_381",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_382",
        "dong": "306",
        "ho": "3902호",
        "headName": "세대주_382",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_383",
        "dong": "307",
        "ho": "3903호",
        "headName": "세대주_383",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_384",
        "dong": "308",
        "ho": "3904호",
        "headName": "세대주_384",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_385",
        "dong": "301",
        "ho": "3905호",
        "headName": "세대주_385",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_386",
        "dong": "302",
        "ho": "3906호",
        "headName": "세대주_386",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_387",
        "dong": "303",
        "ho": "3907호",
        "headName": "세대주_387",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_388",
        "dong": "304",
        "ho": "3908호",
        "headName": "세대주_388",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_389",
        "dong": "305",
        "ho": "3909호",
        "headName": "세대주_389",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_390",
        "dong": "306",
        "ho": "39010호",
        "headName": "세대주_390",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_391",
        "dong": "307",
        "ho": "4001호",
        "headName": "세대주_391",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_392",
        "dong": "308",
        "ho": "4002호",
        "headName": "세대주_392",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_393",
        "dong": "301",
        "ho": "4003호",
        "headName": "세대주_393",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_394",
        "dong": "302",
        "ho": "4004호",
        "headName": "세대주_394",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_395",
        "dong": "303",
        "ho": "4005호",
        "headName": "세대주_395",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_396",
        "dong": "304",
        "ho": "4006호",
        "headName": "세대주_396",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_397",
        "dong": "305",
        "ho": "4007호",
        "headName": "세대주_397",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_398",
        "dong": "306",
        "ho": "4008호",
        "headName": "세대주_398",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_399",
        "dong": "307",
        "ho": "4009호",
        "headName": "세대주_399",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_400",
        "dong": "308",
        "ho": "40010호",
        "headName": "세대주_400",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_401",
        "dong": "301",
        "ho": "4101호",
        "headName": "세대주_401",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_402",
        "dong": "302",
        "ho": "4102호",
        "headName": "세대주_402",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_403",
        "dong": "303",
        "ho": "4103호",
        "headName": "세대주_403",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_404",
        "dong": "304",
        "ho": "4104호",
        "headName": "세대주_404",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_405",
        "dong": "305",
        "ho": "4105호",
        "headName": "세대주_405",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_406",
        "dong": "306",
        "ho": "4106호",
        "headName": "세대주_406",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_407",
        "dong": "307",
        "ho": "4107호",
        "headName": "세대주_407",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_408",
        "dong": "308",
        "ho": "4108호",
        "headName": "세대주_408",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_409",
        "dong": "301",
        "ho": "4109호",
        "headName": "세대주_409",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_410",
        "dong": "302",
        "ho": "41010호",
        "headName": "세대주_410",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_411",
        "dong": "303",
        "ho": "4201호",
        "headName": "세대주_411",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_412",
        "dong": "304",
        "ho": "4202호",
        "headName": "세대주_412",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_413",
        "dong": "305",
        "ho": "4203호",
        "headName": "세대주_413",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_414",
        "dong": "306",
        "ho": "4204호",
        "headName": "세대주_414",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_415",
        "dong": "307",
        "ho": "4205호",
        "headName": "세대주_415",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_416",
        "dong": "308",
        "ho": "4206호",
        "headName": "세대주_416",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_417",
        "dong": "301",
        "ho": "4207호",
        "headName": "세대주_417",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_418",
        "dong": "302",
        "ho": "4208호",
        "headName": "세대주_418",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_419",
        "dong": "303",
        "ho": "4209호",
        "headName": "세대주_419",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_420",
        "dong": "304",
        "ho": "42010호",
        "headName": "세대주_420",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_421",
        "dong": "305",
        "ho": "4301호",
        "headName": "세대주_421",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_422",
        "dong": "306",
        "ho": "4302호",
        "headName": "세대주_422",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_423",
        "dong": "307",
        "ho": "4303호",
        "headName": "세대주_423",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_424",
        "dong": "308",
        "ho": "4304호",
        "headName": "세대주_424",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_425",
        "dong": "301",
        "ho": "4305호",
        "headName": "세대주_425",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_426",
        "dong": "302",
        "ho": "4306호",
        "headName": "세대주_426",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_427",
        "dong": "303",
        "ho": "4307호",
        "headName": "세대주_427",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_428",
        "dong": "304",
        "ho": "4308호",
        "headName": "세대주_428",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_429",
        "dong": "305",
        "ho": "4309호",
        "headName": "세대주_429",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_430",
        "dong": "306",
        "ho": "43010호",
        "headName": "세대주_430",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_431",
        "dong": "307",
        "ho": "4401호",
        "headName": "세대주_431",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_432",
        "dong": "308",
        "ho": "4402호",
        "headName": "세대주_432",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_433",
        "dong": "301",
        "ho": "4403호",
        "headName": "세대주_433",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_434",
        "dong": "302",
        "ho": "4404호",
        "headName": "세대주_434",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_435",
        "dong": "303",
        "ho": "4405호",
        "headName": "세대주_435",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_436",
        "dong": "304",
        "ho": "4406호",
        "headName": "세대주_436",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_437",
        "dong": "305",
        "ho": "4407호",
        "headName": "세대주_437",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_438",
        "dong": "306",
        "ho": "4408호",
        "headName": "세대주_438",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_439",
        "dong": "307",
        "ho": "4409호",
        "headName": "세대주_439",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_440",
        "dong": "308",
        "ho": "44010호",
        "headName": "세대주_440",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_441",
        "dong": "301",
        "ho": "4501호",
        "headName": "세대주_441",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_442",
        "dong": "302",
        "ho": "4502호",
        "headName": "세대주_442",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_443",
        "dong": "303",
        "ho": "4503호",
        "headName": "세대주_443",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_444",
        "dong": "304",
        "ho": "4504호",
        "headName": "세대주_444",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_445",
        "dong": "305",
        "ho": "4505호",
        "headName": "세대주_445",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_446",
        "dong": "306",
        "ho": "4506호",
        "headName": "세대주_446",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_447",
        "dong": "307",
        "ho": "4507호",
        "headName": "세대주_447",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_448",
        "dong": "308",
        "ho": "4508호",
        "headName": "세대주_448",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_449",
        "dong": "301",
        "ho": "4509호",
        "headName": "세대주_449",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_450",
        "dong": "302",
        "ho": "45010호",
        "headName": "세대주_450",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_451",
        "dong": "303",
        "ho": "4601호",
        "headName": "세대주_451",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_452",
        "dong": "304",
        "ho": "4602호",
        "headName": "세대주_452",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_453",
        "dong": "305",
        "ho": "4603호",
        "headName": "세대주_453",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_454",
        "dong": "306",
        "ho": "4604호",
        "headName": "세대주_454",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_455",
        "dong": "307",
        "ho": "4605호",
        "headName": "세대주_455",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_456",
        "dong": "308",
        "ho": "4606호",
        "headName": "세대주_456",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_457",
        "dong": "301",
        "ho": "4607호",
        "headName": "세대주_457",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_458",
        "dong": "302",
        "ho": "4608호",
        "headName": "세대주_458",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_459",
        "dong": "303",
        "ho": "4609호",
        "headName": "세대주_459",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_460",
        "dong": "304",
        "ho": "46010호",
        "headName": "세대주_460",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_461",
        "dong": "305",
        "ho": "4701호",
        "headName": "세대주_461",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_462",
        "dong": "306",
        "ho": "4702호",
        "headName": "세대주_462",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_463",
        "dong": "307",
        "ho": "4703호",
        "headName": "세대주_463",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_464",
        "dong": "308",
        "ho": "4704호",
        "headName": "세대주_464",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_465",
        "dong": "301",
        "ho": "4705호",
        "headName": "세대주_465",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_466",
        "dong": "302",
        "ho": "4706호",
        "headName": "세대주_466",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_467",
        "dong": "303",
        "ho": "4707호",
        "headName": "세대주_467",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_468",
        "dong": "304",
        "ho": "4708호",
        "headName": "세대주_468",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_469",
        "dong": "305",
        "ho": "4709호",
        "headName": "세대주_469",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_470",
        "dong": "306",
        "ho": "47010호",
        "headName": "세대주_470",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_471",
        "dong": "307",
        "ho": "4801호",
        "headName": "세대주_471",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_472",
        "dong": "308",
        "ho": "4802호",
        "headName": "세대주_472",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_473",
        "dong": "301",
        "ho": "4803호",
        "headName": "세대주_473",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_474",
        "dong": "302",
        "ho": "4804호",
        "headName": "세대주_474",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_475",
        "dong": "303",
        "ho": "4805호",
        "headName": "세대주_475",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_476",
        "dong": "304",
        "ho": "4806호",
        "headName": "세대주_476",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_477",
        "dong": "305",
        "ho": "4807호",
        "headName": "세대주_477",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_478",
        "dong": "306",
        "ho": "4808호",
        "headName": "세대주_478",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_479",
        "dong": "307",
        "ho": "4809호",
        "headName": "세대주_479",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_480",
        "dong": "308",
        "ho": "48010호",
        "headName": "세대주_480",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_481",
        "dong": "301",
        "ho": "4901호",
        "headName": "세대주_481",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_482",
        "dong": "302",
        "ho": "4902호",
        "headName": "세대주_482",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_483",
        "dong": "303",
        "ho": "4903호",
        "headName": "세대주_483",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_484",
        "dong": "304",
        "ho": "4904호",
        "headName": "세대주_484",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_485",
        "dong": "305",
        "ho": "4905호",
        "headName": "세대주_485",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_486",
        "dong": "306",
        "ho": "4906호",
        "headName": "세대주_486",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_487",
        "dong": "307",
        "ho": "4907호",
        "headName": "세대주_487",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_488",
        "dong": "308",
        "ho": "4908호",
        "headName": "세대주_488",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_489",
        "dong": "301",
        "ho": "4909호",
        "headName": "세대주_489",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_490",
        "dong": "302",
        "ho": "49010호",
        "headName": "세대주_490",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_491",
        "dong": "303",
        "ho": "5001호",
        "headName": "세대주_491",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_492",
        "dong": "304",
        "ho": "5002호",
        "headName": "세대주_492",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_493",
        "dong": "305",
        "ho": "5003호",
        "headName": "세대주_493",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_494",
        "dong": "306",
        "ho": "5004호",
        "headName": "세대주_494",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_495",
        "dong": "307",
        "ho": "5005호",
        "headName": "세대주_495",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_496",
        "dong": "308",
        "ho": "5006호",
        "headName": "세대주_496",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_497",
        "dong": "301",
        "ho": "5007호",
        "headName": "세대주_497",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_498",
        "dong": "302",
        "ho": "5008호",
        "headName": "세대주_498",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_499",
        "dong": "303",
        "ho": "5009호",
        "headName": "세대주_499",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_500",
        "dong": "304",
        "ho": "50010호",
        "headName": "세대주_500",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_501",
        "dong": "305",
        "ho": "5101호",
        "headName": "세대주_501",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_502",
        "dong": "306",
        "ho": "5102호",
        "headName": "세대주_502",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_503",
        "dong": "307",
        "ho": "5103호",
        "headName": "세대주_503",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_504",
        "dong": "308",
        "ho": "5104호",
        "headName": "세대주_504",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_505",
        "dong": "301",
        "ho": "5105호",
        "headName": "세대주_505",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_506",
        "dong": "302",
        "ho": "5106호",
        "headName": "세대주_506",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_507",
        "dong": "303",
        "ho": "5107호",
        "headName": "세대주_507",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_508",
        "dong": "304",
        "ho": "5108호",
        "headName": "세대주_508",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_509",
        "dong": "305",
        "ho": "5109호",
        "headName": "세대주_509",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_510",
        "dong": "306",
        "ho": "51010호",
        "headName": "세대주_510",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_511",
        "dong": "307",
        "ho": "5201호",
        "headName": "세대주_511",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_512",
        "dong": "308",
        "ho": "5202호",
        "headName": "세대주_512",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_513",
        "dong": "301",
        "ho": "5203호",
        "headName": "세대주_513",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_514",
        "dong": "302",
        "ho": "5204호",
        "headName": "세대주_514",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_515",
        "dong": "303",
        "ho": "5205호",
        "headName": "세대주_515",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_516",
        "dong": "304",
        "ho": "5206호",
        "headName": "세대주_516",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_517",
        "dong": "305",
        "ho": "5207호",
        "headName": "세대주_517",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_518",
        "dong": "306",
        "ho": "5208호",
        "headName": "세대주_518",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_519",
        "dong": "307",
        "ho": "5209호",
        "headName": "세대주_519",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_520",
        "dong": "308",
        "ho": "52010호",
        "headName": "세대주_520",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_521",
        "dong": "301",
        "ho": "5301호",
        "headName": "세대주_521",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_522",
        "dong": "302",
        "ho": "5302호",
        "headName": "세대주_522",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_523",
        "dong": "303",
        "ho": "5303호",
        "headName": "세대주_523",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_524",
        "dong": "304",
        "ho": "5304호",
        "headName": "세대주_524",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_525",
        "dong": "305",
        "ho": "5305호",
        "headName": "세대주_525",
        "targetType": "장애인",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_526",
        "dong": "306",
        "ho": "5306호",
        "headName": "세대주_526",
        "targetType": "일반",
        "installStatus": "미설치"
      },
      {
        "id": "hh_sw3_527",
        "dong": "307",
        "ho": "5307호",
        "headName": "세대주_527",
        "targetType": "일반",
        "installStatus": "미설치"
      }
    ]
  }
];

export const INITIAL_SITES_DATA: SiteInfo[] = RAW_INITIAL_SITES_DATA.map(site => ({
  ...site,
  households: site.households.map((h, idx) => {
    if (h.seq !== undefined && h.seq !== null && h.seq !== '') return h;
    const match = h.id.match(/_(\d+)$/);
    const seqNum = match ? parseInt(match[1], 10) : idx + 1;
    return { ...h, seq: seqNum };
  })
}));
