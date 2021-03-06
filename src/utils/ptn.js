const ptn = {
  idNo:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/,
  telephoneNo:/(?:(?:(?:13[0-9])|(?:16[0-9])|(?:14[57])|(?:15[0-35-9])|(?:17[36-8])|(?:18[0-9]))\d{8})|(?:170[057-9]\d{7})/,
  intNum: /^[0-9]{1,20}$/,
}
const ptnMsg = {
  idNo: '请输入正确的身份证号',
  required: '必填',
  telephoneNo: '请输入正确的手机号码',
  intNum: '整数',
  num: '数字',
}
export {
  ptn,
  ptnMsg,
}
