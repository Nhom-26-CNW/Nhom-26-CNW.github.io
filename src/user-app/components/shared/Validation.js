import {isBefore, isEmail, isEmpty, isMobilePhone} from "validator";
import React from "react";

const required = (value) => {
  if (isEmpty(value)) {
    return <small className="form-text text-danger">Bạn chưa điền ô này</small>;
  }
}

const phone = (value) => {
  if (!isMobilePhone(value)) {
    return <small className="form-text text-danger">Không phải số điện
      thoại</small>;
  }
}

const email = (value) => {
  if (!isEmail(value)) {
    return <small className="form-text text-danger">Định dạng email không
      đúng</small>;
  }
}

const minLength = (value) => {

  if (value > 0 && value.length < 6) {
    return <small className="form-text text-danger">Mật khẩu phải có tối thiểu 6
      ký tự</small>;
  }
}

const isAfterToday = (value) => {
  let today = new Date().toISOString().slice(0, 10)
  if (isBefore(value, today)) {
    return <small className="form-text text-danger">Ngày không hợp lệ</small>;
  }
}

export {required, phone, email, minLength, isAfterToday};
