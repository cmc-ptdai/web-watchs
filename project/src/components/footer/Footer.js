import React from 'react'
import './style.scss'

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__content">
        <div className="footer__content__left">
          <div className="footer__content__left--logo">
            <img src="/logo2.png" alt=""/>
          </div>
          <div className="footer__content__left--contact">
            <table>
              <tbody>
                <tr>
                  <td><i className="fas fa-map-marked-alt" /></td>
                  <td>18T1 The Golden An Khánh, An Khánh, Hoài Đức, Hà Nội.</td>
                </tr>
                <tr>
                  <td><i className="fas fa-phone-rotary" /></td>
                  <td>0963310336</td>
                </tr>
                <tr>
                  <td><i className="fas fa-clock" /></td>
                  <td>Thứ 2 - Chủ nhật: 9:00 - 18:00</td>
                </tr>
                <tr>
                  <td><i className="fas fa-envelope" /></td>
                  <td>daiphung.hd@gmail.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="footer__content__center">
          <div className="footer__content__center--title">
            <span>DANH MỤC</span>
          </div>
          <ul>
            <li>Trang chủ</li>
            <li>Sản phẩm</li>
            <li>Liên hệ</li>
            <li>Chỉ đường</li>
          </ul>
        </div>
        <div className="footer__content__right">
          <div className="footer__content__right--title">
            <span>MẠNG XÃ HỘI</span>
          </div>
          <table>
            <tbody>
              <tr className="facebook">
                <td><i className="fab fa-facebook-square" /></td>
                <td>Facebook</td>
              </tr>
              <tr>
                <td className="youtube"><i className="fab fa-youtube" /></td>
                <td>Youtube</td>
              </tr>
              <tr>
                <td className="instagram"><i className="fab fa-instagram" /> </td>
                <td>Instagram</td>
              </tr>
              <tr>
                <td className="twitter"><i className="fab fa-twitter-square" /></td>
                <td>Twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Footer

