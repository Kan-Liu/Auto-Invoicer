const numberToWords = num => {
  // eslint-disable-next-line
  if (num == 0) {
    return "Zero dollar";
  }

  const numStr = num + "";

  var numArr = numStr.split(".");
  num = parseInt(numArr[0]);
  var decimal;
  if (numArr.length > 1) {
    decimal = numArr[1];
    if (decimal.length > 2) {
      decimal = decimal.slice(0, 2);
    }
  }

  const map = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
    14: "Fourteen",
    15: "Fifteen",
    16: "Sixteen",
    17: "Seventeen",
    18: "Eighteen",
    19: "Nineteen",
    20: "Twenty",
    30: "Thirty",
    40: "Forty",
    50: "Fifty",
    60: "Sixty",
    70: "Seventy",
    80: "Eighty",
    90: "Ninety"
  };
  const t = [
    "Hundred",
    "Thousand",
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion"
  ];

  if (decimal != null && parseInt(decimal) === 0) {
    decimal = null;
  }
  if (decimal != null) {
    if (decimal.length === 1) {
      decimal = map[parseInt(decimal + "0")];
    } else {
      decimal = parseInt(decimal);
      if (decimal < 21) {
        decimal = map[decimal];
      } else {
        const tens = Math.floor(decimal / 10);
        const ones = decimal % 10;
        decimal = map[tens * 10] + " " + map[ones];
      }
    }

    decimal += " cents";
    decimal = decimal.toLowerCase();
  }

  if (num === 0) {
    decimal = decimal.charAt(0).toUpperCase() + decimal.slice(1);
    return decimal;
  }

  num = num + "";
  const tNums = [];
  let count = num.length;
  //String slice by 3 unit
  while (count > 0) {
    tNums.push(num.slice(count - 3 < 0 ? 0 : count - 3, count));
    count -= 3;
  }
  let nums = [];
  const result = [];
  let len;
  let str;
  let n;
  for (let i = 0; i < tNums.length; i++) {
    str = tNums[i];
    nums = [];
    len = str.length;
    if (len === 3) {
      n = +str[0];
      if (n) {
        nums.push(`${map[n]} ${t[0]}`);
      }
      str = str.slice(1, 3);
      len--;
    }
    if (len <= 2) {
      n = +str;
      if (n) {
        if (n < 21) {
          nums.push(`${map[n]}`);
        } else {
          nums.push(`${map[+(str[0] + "0")]}`);
          n = +str[1];
          if (n) {
            nums.push(`${map[n]}`);
          }
        }
      }
    }
    if (nums.length) {
      if (i > 0) {
        nums.push(t[i]);
      }
      result.unshift(nums.join(" "));
    }
  }
  var res;
  if (result.join(" ") === "One") {
    res = (result.join(" ") + " dollar").toLowerCase();
  } else {
    res = (result.join(" ") + " dollars").toLowerCase();
  }
  if (decimal != null) {
    res += " and " + decimal;
  }
  res = res.charAt(0).toUpperCase() + res.slice(1);
  return res;
};

module.exports = numberToWords; // SET EXPORTS for the module.
