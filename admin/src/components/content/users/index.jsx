import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input } from "antd";
import "./style.scss";
import MyTable from "./table";
import FormAdd from "./FromAddUser";
import ExportToExcel from "../ExportToExcel";
import TableNoAction from "./tableNoAction";

const Content = () => {
  const user = useSelector((store) => store.userReducer);
  const store = useSelector((store) => store);
  const [dataTable, setDataTable] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [statusFromAdd, setEditStatusFromAdd] = useState(false);
  const [userPotential, setUserPotential] = useState(null);
  const [userBirthday, setUserBirthday] = useState(null);
  const [userDefault, setUserDefault] = useState(true);

  useEffect(() => {
    setDataTable(user);
  }, [user]);

  const searchUser = () => {
    const arrSearch = user.filter(
      (item) =>
        item.name.toLowerCase().indexOf(inputSearch) !== -1 ||
        item.email.toLowerCase().indexOf(inputSearch) !== -1
        // item.userName.toLowerCase().indexOf(inputSearch) !== -1
        // item.address.toLowerCase().indexOf(inputSearch) !== -1 ||
    );
    setDataTable(arrSearch);
  };

  const changeInputSearch = (e) => {
    setInputSearch(e.target.value);
    const valueInput = e.target.value;
    const arrSearch = user.filter(
      (item) =>
        item.name.toLowerCase().indexOf(valueInput) !== -1 ||
        item.email.toLowerCase().indexOf(valueInput) !== -1
        // item.address.toLowerCase().indexOf(valueInput) !== -1 ||
        // item.userName.toLowerCase().indexOf(valueInput) !== -1
    );
    setDataTable(arrSearch);
  };
  const addUser = () => {
    setEditStatusFromAdd(true);
  };

  const editStatusFromAdd = (setToForm) => {
    setEditStatusFromAdd(setToForm);
  };

  const headers = [
    { label: "Họ và tên", key: "name" },
    { label: "Địa chỉ email", key: "email" },
    { label: "Giới tính", key: "gender" },
    { label: "Địa chỉ", key: "address" },
    { label: "Số điện thoại", key: "phone" },
    { label: "tên đăng nhập", key: "userName" },
    { label: "NGày tạo", key: "dateCreate" },
    { label: "Ngày Sửa", key: "dateUpdate" },
  ];

  const fileName1 = "ListUser.csv";

  const changeUserPotential = () => {
    const newData = []
    user.forEach(elem => {
      let total = 0
      let totalMoney = 0
      store.orderReducer.forEach(item => {
        if(item.idUser === elem.id && item.status !== "cancelled") {
          total = total + 1
          totalMoney = totalMoney + item.money
        }
      })
      const newUser = {
        ...elem,
        total: total,
        totalMoney: totalMoney
      }
      newData.push(newUser)
    })
    const newArr = newData.sort((a,b) => {
      if (a.totalMoney > b.totalMoney) {
        return -1
      } else {
        return 0
      }
    })
    setUserDefault(false)
    setUserBirthday(null)
    setUserPotential(newArr)
  }

  const changeUserBirthday = () => {
    const newData = []
    const date = new Date()
    const c = date.getDate().toString() + '/' + (date.getMonth() + 1).toString()
    user.forEach(elem => {
      const date2 = new Date(elem.birthday)
      const e = date2.getDate().toString() + '/' + (date2.getMonth() + 1).toString()
      if (c === e) {
        newData.push(elem)
      }
    })
    setUserDefault(false)
    setUserPotential(null)
    setUserBirthday(newData)
  }

  const changeUserDefault = () => {
    setUserPotential(null)
    setUserBirthday(null)
    setUserDefault(true)
  }
  return (
    <>
      {statusFromAdd && <FormAdd editStatusFromAdd={editStatusFromAdd} />}
      <div className="tableUser">
        <div className="tableUser__action">
          <div className="tableUser__action--search">
            <Input
              type="text"
              name="search"
              placeholder="Tim kiếm...."
              onChange={changeInputSearch}
              value={inputSearch}
            />
            <i className="fas fa-search" onClick={searchUser}></i>
          </div>
          <div className="tableUser__action--addUser">
            <Button type="primary" onClick={addUser}>
              Add User
            </Button>

            <ExportToExcel
              csvData={dataTable}
              headers={headers}
              fileName1={fileName1}
            />
          </div>
        </div>
        <div
          className="tableUser__action"
          style={{ width: "55%", justifyContent: "space-between" }}
        >
          <Button type="primary" onClick={changeUserPotential}>
            Khách hàng tiềm năng
          </Button>
          <Button type="primary" onClick={changeUserBirthday}>
            sinh nhật khách hàng
          </Button>
          <Button type="primary" onClick={changeUserDefault}>
            Mặc định
          </Button>
        </div>
        <div>
          {userDefault && <MyTable dataTable={dataTable} />}
          {userPotential && <TableNoAction dataTable={userPotential} />}
          {userBirthday && <TableNoAction dataTable={userBirthday} />}
        </div>
      </div>
    </>
  );
};

export default Content;
