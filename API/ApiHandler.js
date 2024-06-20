//DEV CRM
const BASE_URL = "https://uat-physio-tattva.p7devs.com";

// const fireBaseBackend = "http://localhost:3000";
const fireBaseBackend = "https://physiobackend.onrender.com";

//LIVE CRM
// const BASE_URL = 'https://crm.cadabams.com';

//Development Endpoints
export const OTP_SEND_URL = BASE_URL + "/crm_lead/login";
export const OTP_VERIFY_URL = BASE_URL + "/crm_lead/send_otp";
export const LEAD_CREATION = BASE_URL + "/mobile/signup";
export const GET_USER_DETAILS = BASE_URL + `/restapi/1.0/object/crm.lead`;
export const GET_SPECIALTY_LIST =
  BASE_URL +
  `/restapi/1.0/object/speciality.master?domain=[]&fields=['id','name']`;
export const GET_ILLNESS_LIST =
  BASE_URL + `/restapi/1.0/object/primary.tag?domain=[]&fields=['id','name']`;
export const GET_RELATIONSHIP_MASTER =
  BASE_URL +
  `/restapi/1.0/object/relationship.master?domain=[]&fields=['id','name']`;
export const SEND_SIGN_UP_QUESTIONS = BASE_URL + `/mobile/signup/details`;
export const GET_PACKAGE_LIST =
  BASE_URL +
  `/restapi/1.0/object/service.child.master?domain=[]&fields=['id','name']`;
export const GET_ALL_PACKAGES =
  BASE_URL +
  `/restapi/1.0/object/package.package?domain=[]&fields=['package_name','amount_total','service_id','package_product_ids']`;
export const GET_PRODUCT_LIST =
  BASE_URL +
  `/restapi/1.0/object/package.product.lines?domain=[]&fields=['product_id']`;
export const GET_DOCTOR_LIST = BASE_URL + `/get/doctors`;
export const GET_LOCATION_CENTER =
  BASE_URL +
  `/restapi/1.0/object/campus.master?domain=[('book_appointment','=',True)]&fields=['id','name', 'city','latitude','longitude']`;
export const GET_TIME_SLOT = BASE_URL + `/restapi/1.0/object/slot.booking`;
export const BOOK_INDIVIDUAL_APPOINTMENT = BASE_URL + `/book_appointment`;
export const GET_APPOINTMENT_DETAILS = BASE_URL + `/appointment/`;
export const GET_CENTER_DETAILS =
  BASE_URL + `/restapi/1.0/object/campus.master`;
export const DELETE_ACCOUNT = BASE_URL + `/delete/account`;
export const MANAGE_BOOKED_PACKAGES = BASE_URL + `/manage/package`;
export const GET_FILTERED_PACKAGES =
  BASE_URL + `/restapi/1.0/object/package.package`;
export const BOOK_A_PACKAGE = BASE_URL + `/book_package`;
export const CONFIRM_THE_PACKAGE =
  BASE_URL + `/restapi/1.0/object/lead.booked.package`;
export const CANCEL_APPOINTMENT = BASE_URL + `/cancel_appointment`;
export const GET_NOTIFICATION_DETAILS = BASE_URL + `/get/notification`;
export const PUT_NOTIFICATION_DETAILS = BASE_URL + `/enable/notification`;
export const GET_VIDEO_CALL_ID = BASE_URL + `/get/roomid`;
export const GET_PAYMENT_VALS = BASE_URL + `/mobile/payment`;
export const GET_PAYMENT_ORDER_DETAILS = BASE_URL + `/get/payment/reference`;
export const GET_PAYMENT_STATUS = BASE_URL + `/mobile/status/api`;
export const GET_SLOT_PRICE = BASE_URL + `/get/slot_price`;
export const PAYMENT_CALLBACK = BASE_URL + `/mobile/payment/callback`;

export const saveChat = fireBaseBackend + `/add-data`;
export const fetchChat = fireBaseBackend + `/get-chats`;

//Aadhar Verify URLs
// export const AADHAAR_VERIFY =
//   "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp";
// export const SUBMIT_AADHAR_OTP =
//   "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp";

//DEV TOKENS

export const ConsumerKey = "Nsl8e9YZAgqodqL0OBifQjxcs5JRFTLR";
export const ConsumerSecret = "wzk29XKb1KYdfUW5TGRR1qmPXrSHyW5u";
export const AccessToken = "Ut6eO6VrE0YyJqlNN5rAzNLNKEjQROd9";
export const TokenSecret = "rvnjOmhWbOMAI8wKAW1IEGaFJ3j8OKXQ";
// export const WebFlowToken =
//   "Bearer b1ba4971975cb2270efb54ede41f639b757b980ced4fc568df870ec069fd6e72";
// export const SurePassToken =
//   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NDgzNzMyOSwianRpIjoiYTBlNjhjMTEtYmYyNy00NDkzLWJhYmQtMzZlODlkMTExYjI0IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNhZGFiYW1zQHN1cmVwYXNzLmlvIiwibmJmIjoxNjg0ODM3MzI5LCJleHAiOjIwMDAxOTczMjksInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.TEWJo3wGNvrHtRaY0PahRJbqoqnoi064LJlejFE_5pw";
// export const BookPackageToken =
//   "Bearer haMdbrivrvkBfviurhDVviuhgrnfrhHFhgjf99G99uihbyrgJybfhrbf";
// export const OAuthSignature =
//   "TNPaIh2CCKvtjnZuIO4TtsDJKG1nHq3m&RBNj8FVHhG9b0xMjWV15dNcoT1RtHXgc";

//LIVE TOKENS
// export const ConsumerKey = 'j5r7K9FLCRbuli9w4Z4Ddyq6pnYY1ooc'
// export const ConsumerSecret = '1TsoADkdRqCcdi6gfZTarAx0pXaey5Pr'
// export const AccessToken = 'IK4BaunTMgBRk9J9wVLsUZW4eHjPZyYY'
// export const TokenSecret = 'POwMpxRHniIwmb3ziothQf96LhiNfRvb'
// export const WebFlowToken = 'Bearer b1ba4971975cb2270efb54ede41f639b757b980ced4fc568df870ec069fd6e72'
// export const SurePassToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NDgzNzMyOSwianRpIjoiYTBlNjhjMTEtYmYyNy00NDkzLWJhYmQtMzZlODlkMTExYjI0IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNhZGFiYW1zQHN1cmVwYXNzLmlvIiwibmJmIjoxNjg0ODM3MzI5LCJleHAiOjIwMDAxOTczMjksInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.TEWJo3wGNvrHtRaY0PahRJbqoqnoi064LJlejFE_5pw';
// export const BookPackageToken = 'Bearer haMdbrivrvkBfviurhDVviuhgrnfrhHFhgjf99G99uihbyrgJybfhrbf'
// export const OAuthSignature = '1TsoADkdRqCcdi6gfZTarAx0pXaey5Pr&POwMpxRHniIwmb3ziothQf96LhiNfRvb'

export const OAuthSignature =
  "wzk29XKb1KYdfUW5TGRR1qmPXrSHyW5u%26rvnjOmhWbOMAI8wKAW1IEGaFJ3j8OKXQ";
