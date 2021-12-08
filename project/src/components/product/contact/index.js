import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import './style.scss'
import GoogleMapProduct from './GoogleMap'

const Concat = () => {
  return (
    <div className="concat">
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/products">
              Liên hệ
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="row concat__info">
        <div className="col-4">
          <h2>Thông tin liên hệ</h2>
          <ul>
            <li>
              <div className="concat__info--icon">
                <i className="fas fa-map-marked-alt" />
              </div>
              <div className="concat__info--text">
                18T1 The Golden An Khánh, An Khánh, Hoài Đức, Hà Nội.
              </div>
            </li>
            <li>
              <div className="concat__info--icon">
                <i className="fas fa-phone-rotary" />
              </div>
              <div className="concat__info--text">
                0963310336
              </div>
            </li>
            <li>
              <div className="concat__info--icon">
                <i className="fas fa-clock" />
              </div>
              <div className="concat__info--text">
                Thứ 2 - Chủ nhật: 9:00 - 18:00
              </div>
            </li>
            <li>
              <div className="concat__info--icon">
                <i className="fas fa-envelope" />
              </div>
              <div className="concat__info--text">
                daiphung.hd@gmail.com
              </div>
            </li>
          </ul>
        </div>
        <div className="col-8">
          <GoogleMapProduct
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAdSxPN8fFT56BvY99uFdHN5BGhpzIjdkw&callback=initMap`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `90vh`, margin: `auto`, border: '2px solid black' }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </div>
  )
}

export default Concat
