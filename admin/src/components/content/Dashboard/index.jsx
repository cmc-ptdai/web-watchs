import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Select, Modal, DatePicker } from "antd";
import apiNewComment from "../../../api/apiNewComment";
import apiOrders from "../../../api/apiOrders";
import "./style.scss";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const history = useHistory();
  const store = useSelector((store) => store);
  const [listNewComment, setNewListComment] = useState(null);
  const [status, setStatus] = useState(false);
  const [listOrder, setListOrder] = useState(null);
  const [data, setData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Tổng doanh thu(triệu)",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
      {
        label: "tổng số đơn hang",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });
  const [statusWeek, setStatusWeek] = useState(false);
  const [statusMonth, setStatusMonth] = useState(false);
  const [status3Month, setStatus3Month] = useState(false);
  const [statusYear, setStatusYear] = useState(false);
  const [NumberMonth, setNumberMonth] = useState(null);
  const [number3Month, setNumber3Month] = useState(null);
  const [numberYear3Month, setNumberYear3Month] = useState(null);
  const [NumberYear, setNumberYear] = useState(null);

  const [dates, setDates] = useState(null);
  const [hackValue, setHackValue] = useState(null);
  const [value, setValue] = useState([null, null]);

  useEffect(() => {
    fetchNewComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchNewComment = async () => {
    const newData = { ...data };
    newData.datasets[0].data = [];
    newData.datasets[1].data = [];
    const listLabel = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date();
    const year1 = date.getFullYear();
    const newList = await apiNewComment.getNewComment();
    const newListOrders = await apiOrders.getAllOrders();
    setListOrder(newListOrders);
    const newListProduct = newListOrders.filter((item) => {
      if (item.status !== "cancelled") {
        const dateOrder = new Date(item.dateCreate);
        if (dateOrder.getFullYear().toString() === year1.toString()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    for (let i = 1; i <= 12; i++) {
      const date1 = year1.toString()  + "/" + i.toString();
      let totalMoney = 0;
      let totalOrder = 0;
      newListProduct.forEach((item) => {
        const date =
          new Date(item.dateCreate).getFullYear().toString() +
          "/" +
          (new Date(item.dateCreate).getMonth() + 1).toString();
        if (date1 === date) {
          totalMoney = totalMoney + item.money / 1000000;
          totalOrder = totalOrder + 1;
        }
      });
      newData.datasets[0].data.push(totalMoney);
      newData.datasets[1].data.push(totalOrder);
    }
    newData.labels = listLabel;
    setData(newData);

    setNewListComment(newList);
  };

  const money = () => {
    let a = 0;
    store.orderReducer.forEach((item) => {
      a = a + Number(item.money);
    });
    return a;
  };

  const options = {
    maintainAspectRatio: true,
  };

  const skipNewComment = (comment) => {
    apiNewComment.deleteNewComment(comment.id);
    setStatus(!status);
  };

  const replyNewComment = (comment) => {
    skipNewComment(comment);
    return history.push({
      pathname: `/body/comments/${comment.idProduct}/${comment.idComment}`,
    });
  };

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 7;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 7;
    return !!tooEarly || !!tooLate;
  };

  const disabledMonth = (current) => {
    return current && current > moment().endOf("day");
  };

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([null, null]);
      setDates([null, null]);
    } else {
      setHackValue(null);
    }
  };

  const showWeek = () => {
    const date1 =
      value[0]._d.getFullYear().toString() +
      "/" +
      (value[0]._d.getMonth() + 1).toString() +
      "/" +
      value[0]._d.getDate().toString();
    const date2 =
      value[1]._d.getFullYear().toString() +
      "/" +
      (value[1]._d.getMonth() + 1).toString() +
      "/" +
      value[1]._d.getDate().toString();
    const timeDate1 = new Date(date1).getTime();
    const timeDate2 = new Date(date2).getTime();
    const listDate = [];
    const newListProduct = listOrder.filter((item) => {
      if (item.status !== "cancelled") {
        const dateOrder = new Date(item.dateCreate);
        if (
          dateOrder.getTime() >= timeDate1 &&
          dateOrder.getTime() <= timeDate2
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

    const newDataChart = { ...data };
    newDataChart.datasets[0].data = [];
    newDataChart.datasets[1].data = [];
    newDataChart.labels = listDate;
    for (let i = value[0]._d.getDate(); i <= value[1]._d.getDate(); i++) {
      const date1 =
        value[0]._d.getFullYear().toString() +
        "/" +
        (value[0]._d.getMonth() + 1).toString() +
        "/" +
        i.toString();
      switch (new Date(date1).getDay()) {
        case 1:
          listDate.push("Monday");
          break;
        case 2:
          listDate.push("Tuesday");
          break;
        case 3:
          listDate.push("Wednesday");
          break;
        case 4:
          listDate.push("Thursday");
          break;
        case 5:
          listDate.push("Friday");
          break;
        case 6:
          listDate.push("Saturday");
          break;
        case 0:
          listDate.push("Sunday");
          break;
        default:
          break;
      }
      let totalMoney = 0;
      let totalOrder = 0;
      newListProduct.forEach((item) => {
        const date =
          new Date(item.dateCreate).getFullYear().toString() +
          "/" +
          (new Date(item.dateCreate).getMonth() + 1).toString() +
          "/" +
          new Date(item.dateCreate).getDate().toString();
        if (date1 === date) {
          totalMoney = totalMoney + item.money / 1000000;
          totalOrder = totalOrder + 1;
        }
      });
      newDataChart.datasets[0].data.push(totalMoney);
      newDataChart.datasets[1].data.push(totalOrder);
    }
    setData(newDataChart);
    handleCancelModal();
  };

  const showMonth = () => {
    const newMonth = NumberMonth._d.getMonth() + 1;
    let dateOfMonth = 0;
    const listDate = [];
    const newDataChart = { ...data };
    newDataChart.datasets[0].data = [];
    newDataChart.datasets[1].data = [];
    switch (newMonth) {
      case 1:
        dateOfMonth = 31;
        break;
      case 2:
        dateOfMonth = 28;
        break;
      case 3:
        dateOfMonth = 31;
        break;
      case 4:
        dateOfMonth = 30;
        break;
      case 5:
        dateOfMonth = 31;
        break;
      case 6:
        dateOfMonth = 30;
        break;
      case 7:
        dateOfMonth = 31;
        break;
      case 8:
        dateOfMonth = 31;
        break;
      case 9:
        dateOfMonth = 30;
        break;
      case 10:
        dateOfMonth = 31;
        break;
      case 11:
        dateOfMonth = 30;
        break;
      case 12:
        dateOfMonth = 31;
        break;
      default:
        break;
    }
    const date1 =
      NumberMonth._d.getFullYear().toString() +
      "/" +
      newMonth.toString() +
      "/01";
    const date2 =
      NumberMonth._d.getFullYear().toString() +
      "/" +
      newMonth.toString() +
      "/" +
      dateOfMonth.toString();
    const timeDate1 = new Date(date1).getTime();
    const timeDate2 = new Date(date2).getTime();
    const newListProduct = listOrder.filter((item) => {
      if (item.status !== "cancelled") {
        const dateOrder = new Date(item.dateCreate);
        if (
          dateOrder.getTime() >= timeDate1 &&
          dateOrder.getTime() <= timeDate2
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    for (let i = 1; i <= dateOfMonth; i++) {
      listDate.push(i);
      const date1 =
        NumberMonth._d.getFullYear().toString() +
        "/" +
        newMonth.toString() +
        "/" +
        i.toString();
      let totalMoney = 0;
      let totalOrder = 0;
      newListProduct.forEach((item) => {
        const date =
          new Date(item.dateCreate).getFullYear().toString() +
          "/" +
          (new Date(item.dateCreate).getMonth() + 1).toString() +
          "/" +
          new Date(item.dateCreate).getDate().toString();
        if (date1 === date) {
          totalMoney = totalMoney + item.money / 1000000;
          totalOrder = totalOrder + 1;
        }
      });
      newDataChart.labels = listDate;
      newDataChart.datasets[0].data.push(totalMoney);
      newDataChart.datasets[1].data.push(totalOrder);
    }
    setData(newDataChart);
    handleCancelModal();
  };

  const show3Month = () => {
    let listMonth = [];
    const newDataChart = { ...data };
    newDataChart.datasets[0].data = [];
    newDataChart.datasets[1].data = [];
    switch (Number(number3Month)) {
      case 1:
        listMonth = [1, 2, 3];
        break;
      case 2:
        listMonth = [4, 5, 6];
        break;
      case 3:
        listMonth = [7, 8, 9];
        break;
      case 4:
        listMonth = [10, 11, 12];
        break;
      default:
        break;
    }
    const date1 = numberYear3Month.toString() + "/" + listMonth[0].toString();
    const date2 = numberYear3Month.toString() + "/" + listMonth[2].toString();
    const timeDate1 = new Date(date1).getTime();
    const timeDate2 = new Date(date2).getTime();
    const newListProduct = listOrder.filter((item) => {
      if (item.status !== "cancelled") {
        const dateOrder = new Date(item.dateCreate);
        if (
          dateOrder.getTime() >= timeDate1 &&
          dateOrder.getTime() <= timeDate2
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    for (let i = 0; i < listMonth.length; i++) {
      const date1 = numberYear3Month.toString() + "/" + listMonth[i].toString();
      let totalMoney = 0;
      let totalOrder = 0;
      newListProduct.forEach((item) => {
        const date =
          new Date(item.dateCreate).getFullYear().toString() +
          "/" +
          (new Date(item.dateCreate).getMonth() + 1).toString();
        if (date1 === date) {
          totalMoney = totalMoney + item.money / 1000000;
          totalOrder = totalOrder + 1;
        }
      });
      newDataChart.datasets[0].data.push(totalMoney);
      newDataChart.datasets[1].data.push(totalOrder);
    }
    newDataChart.labels = listMonth;
    setData(newDataChart);
    handleCancelModal();
  };

  const showYear = async () => {
    const newDataChart = { ...data };
    newDataChart.datasets[0].data = [];
    newDataChart.datasets[1].data = [];
    const listLabel = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const newListProduct = listOrder.filter((item) => {
      if (item.status !== "cancelled") {
        const dateOrder = new Date(item.dateCreate);
        if (dateOrder.getFullYear().toString() === NumberYear.toString()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

    for (let i = 1; i <= 12; i++) {
      const date1 = NumberYear.toString() + "/" + i.toString();
      let totalMoney = 0;
      let totalOrder = 0;
      newListProduct.forEach((item) => {
        const date =
          new Date(item.dateCreate).getFullYear().toString() +
          "/" +
          (new Date(item.dateCreate).getMonth() + 1).toString();
        if (date1 === date) {
          totalMoney = totalMoney + item.money / 1000000;
          totalOrder = totalOrder + 1;
        }
      });
      newDataChart.datasets[0].data.push(totalMoney);
      newDataChart.datasets[1].data.push(totalOrder);
    }
    newDataChart.labels = listLabel;
    setData(newDataChart);
    handleCancelModal();
  };

  const changeOptionWeek = () => {
    // 86400000 ms trên 1 ngày
    // const date = new Date();
    // const c = "01/01/" + date.getFullYear();
    // const date2 = new Date(c);
    // const date3 = new Date('2022/07/21')
    // console.log(date3.getDay());
    // setNumberWeek(
    //   Math.floor((date.getTime() - date2.getTime()) / (86400000 * 7)) + 1
    // );
    //console.log(date.getDate(), date.getMonth() + 1, date.getFullYear());
    setStatusWeek(true);
  };

  const changeOptionMonth = () => {
    setStatusMonth(true);
  };

  const changeOption3Month = () => {
    setNumberYear3Month(new Date().getFullYear());
    setStatus3Month(true);
  };

  const changeOptionYear = () => {
    setStatusYear(true);
  };

  const onChange3Month = (value) => {
    setNumber3Month(value);
  };

  const onChangeYearBy3Mouth = (value) => {
    setNumberYear3Month(value);
  };

  const handleCancelModal = () => {
    setStatusWeek(false);
    setStatusMonth(false);
    setStatus3Month(false);
    setStatusYear(false);
    setDates(null);
    setHackValue(null);
    setValue([null, null]);
    setNumber3Month(null);
    setNumberYear3Month(null);
    setNumberMonth(null);
    setNumberYear(null)
  };
  return (
    <div className="dashboard">
      <div className="dashboard-status">
        <div className="dashboard-status-item">
          <div className="dashboard-status-item-icon">
            <i className="far fa-usd-circle"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>Total money</h3>
            <p>
              {money()
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              &nbsp; VND
            </p>
          </div>
        </div>

        <Link to="/body/orders" className="dashboard-status-item">
          <div className="dashboard-status-item-icon">
            <i className="fad fa-shopping-cart"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>Order</h3>
            <p>{store.orderReducer.length}</p>
          </div>
        </Link>

        <Link to="/body/users" className="dashboard-status-item">
          <div className="dashboard-status-item-icon">
            <i className="fad fa-users"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>user</h3>
            <p>{store.userReducer.length}</p>
          </div>
        </Link>

        <Link to="#" className="dashboard-status-item" style={{cursor: "default"}}>
          <div className="dashboard-status-item-icon">
            <i className="fad fa-boxes"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>Product</h3>
            <p>{store.productReducer.length}</p>
          </div>
        </Link>
      </div>
      <div className="dashboard-chart">
        <div className="dashboard-chart-line">
          <div className="dashboard-chart-line__groupSelect">
            <div
              className="dashboard-chart-line__groupSelect--item"
              onClick={() => changeOptionWeek()}
            >
              Tuần
            </div>
            <div
              className="dashboard-chart-line__groupSelect--item"
              onClick={() => changeOptionMonth()}
            >
              Tháng
            </div>
            <div
              className="dashboard-chart-line__groupSelect--item"
              onClick={() => changeOption3Month()}
            >
              Quý
            </div>
            <div
              className="dashboard-chart-line__groupSelect--item"
              onClick={() => changeOptionYear()}
            >
              Năm
            </div>
          </div>
          <Line data={data} options={options} />

          <Modal
            visible={statusWeek}
            title="chọn tuần cần xem"
            onCancel={handleCancelModal}
          >
            <RangePicker
              value={hackValue || value}
              disabledDate={disabledDate}
              onCalendarChange={(val) => setDates(val)}
              onChange={(val) => setValue(val)}
              onOpenChange={() => onOpenChange}
              style={{ marginLeft: "80px", marginBottom: "10px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "45%",
                margin: "auto",
              }}
            >
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancelModal}
              >
                Huỷ
              </Button>
              <Button
                className="btnSubmit"
                type="primary"
                onClick={() => showWeek()}
                disabled={value && value[0] === null ? true : false}
              >
                Xem
              </Button>
            </div>
          </Modal>

          <Modal
            visible={statusMonth}
            title="chọn tháng và năm cần xem"
            onCancel={handleCancelModal}
          >
            <DatePicker
              picker="month"
              onChange={(val) => setNumberMonth(val)}
              value={NumberMonth}
              style={{ marginLeft: "33%", marginBottom: "10px" }}
              disabledDate={disabledMonth}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "45%",
                margin: "auto",
              }}
            >
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancelModal}
              >
                Huỷ
              </Button>
              <Button
                className="btnSubmit"
                type="primary"
                onClick={() => showMonth()}
                disabled={NumberMonth === null ? true : false}
              >
                Xem
              </Button>
            </div>
          </Modal>

          <Modal
            visible={status3Month}
            title="chọn quý và năm cần xem"
            onCancel={handleCancelModal}
          >
            <div style={{ marginLeft: "16%", marginBottom: "10px" }}>
              <Select
                placeholder="Select Quý"
                style={{ width: 150, marginRight: "10px" }}
                onChange={onChange3Month}
                value={number3Month}
              >
                <Option value="1">Quý 1</Option>
                <Option value="2">Quý 2</Option>
                <Option value="3">Quý 3</Option>
                <Option value="4">Quý 4</Option>
              </Select>
              <Select
                placeholder="Select year"
                style={{ width: 150 }}
                defaultValue={new Date().getFullYear()}
                onChange={onChangeYearBy3Mouth}
              >
                <Option value="2021">2021</Option>
                <Option value="2022">2022</Option>
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "45%",
                margin: "auto",
              }}
            >
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancelModal}
              >
                Huỷ
              </Button>
              <Button
                className="btnSubmit"
                type="primary"
                onClick={() => show3Month()}
                disabled={number3Month === null ? true : false}
              >
                Xem
              </Button>
            </div>
          </Modal>

          <Modal
            visible={statusYear}
            title="chọn năm cần xem"
            onCancel={handleCancelModal}
          >
            <Select
              placeholder="Select year"
              style={{ width: 150, marginLeft: "33%", marginBottom: "10px" }}
              value={NumberYear}
              onChange={(value) => setNumberYear(value)}
            >
              <Option value="2021">2021</Option>
              <Option value="2022">2022</Option>
            </Select>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "45%",
                margin: "auto",
              }}
            >
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancelModal}
              >
                Huỷ
              </Button>
              <Button
                className="btnSubmit"
                type="primary"
                onClick={() => showYear()}
                disabled={NumberYear === null ? true : false}
              >
                Xem
              </Button>
            </div>
          </Modal>
        </div>
        <div className="dashboard-chart-comment">
          <Link to="#" className="dashboard-chart-comment-item" style={{cursor: "default"}}>
            <div className="dashboard-chart-comment-item-icon">
              <i className="fad fa-users"></i>
            </div>
            <div className="dashboard-chart-comment-item-info">
              <h3>New comment</h3>
              {listNewComment && <p>{listNewComment.length}</p>}
            </div>
          </Link>
          {listNewComment !== null && listNewComment.length > 0 && (
            <div className="dashboard-chart-comment-list">
              {listNewComment &&
                listNewComment.map((item, index) => {
                  return (
                    <div
                      className="dashboard-chart-comment-list-item"
                      key={index}
                    >
                      <p className="dashboard-chart-comment-list-item-name">
                        {item.name}
                      </p>
                      <p>{item.comment}</p>
                      <div className="dashboard-chart-comment-list-item-button">
                        <Button danger onClick={() => skipNewComment(item)}>
                          skip
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => replyNewComment(item)}
                        >
                          reply
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
