import React, {useState} from 'react';
import './orders.scss'
import Pending from './Pending'

const Orders = () => {
  const [ showTab, setShowTab] = useState("pending")
  function changeTab(a) {
    setShowTab(a)
  };

  return (
    <>
      <div className="group-btn">
        <button
          className={showTab === "pending" ? "group-btn-active" : '' }
          onClick={() => changeTab("pending")}
        >
          Pending
        </button>
        <button
          className={showTab === "delivery" ? "group-btn-active" : '' }
          onClick={() => changeTab("delivery")}
        >
          Delivery
        </button>
        <button
          className={showTab === "delivered" ? "group-btn-active" : '' }
          onClick={() => changeTab("delivered")}
        >
          Delivered
        </button>
        <button
          className={showTab === "cancelled" ? "group-btn-active" : '' }
          onClick={() => changeTab("cancelled")}
        >
          Cancelled
        </button>
      </div>
      <div className="content-tab">
        {
          showTab === "pending" && <Pending statusProps="pending"/>
        }
        {
          showTab === "delivery" && <Pending statusProps="delivery"/>
        }
        {
          showTab === "delivered" && <Pending statusProps="delivered"/>
        }
        {
          showTab === "cancelled" && <Pending statusProps="cancelled"/>
        }

      </div>
    </>
  )
}

export default Orders
