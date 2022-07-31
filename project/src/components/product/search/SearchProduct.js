import React, { useState, useEffect } from 'react';
import ApiCountry from '../../../api/country';
import ApiTrademark from '../../../api/tradermark';
import ApiModels from '../../../api/apiModel';
import './style.scss';

const SearchProduct = (props) => {
  const [country, setCountry] = useState(null);
  const [typeProduct, setTypeProduct] = useState(null);
  const [prices, setPrices] = useState([
    {
      price1: 0,
      status: false,
      price2: 2000000,
    },
    {
      price1: 2000000,
      status: false,
      price2: 4000000,
    },
    {
      price1: 4000000,
      status: false,
      price2: 6000000,
    },
    {
      price1: 6000000,
      status: false,
      price2: 8000000,
    },
    {
      price1: 8000000,
      status: false,
      price2: 10000000,
    },
    {
      price1: 10000000,
      status: false,
      price2: 9999999999999,
    },
  ]);
  const [waterResistance, setWaterResistance] = useState([
    {
      water1: 0,
      status: false,
      water2: 30,
    },
    {
      water1: 30,
      status: false,
      water2: 50,
    },
    {
      water1: 50,
      status: false,
      water2: 100,
    },
    {
      water1: 100,
      status: false,
      water2: 200,
    },
    {
      water1: 200,
      status: false,
      water2: 9999999999999,
    },
  ]);
  const [models, setModels] = useState(null);
  const [strapColor, setStrapColor] = useState([
    {
      id: 1,
      name: 'Bạc',
      status: false,
    },
    {
      id: 2,
      name: 'Cam',
      status: false,
    },
    {
      id: 3,
      name: 'Đen',
      status: false,
    },
    {
      id: 4,
      name: 'Đỏ',
      status: false,
    },
    {
      id: 5,
      name: 'Hồng',
      status: false,
    },
    {
      id: 6,
      name: 'Kem',
      status: false,
    },
    {
      id: 7,
      name: 'Nâu',
      status: false,
    },
    {
      id: 8,
      name: 'Phối màu',
      status: false,
    },
    {
      id: 9,
      name: 'Tím',
      status: false,
    },
    {
      id: 10,
      name: 'Trắng',
      status: false,
    },
    {
      id: 11,
      name: 'vàng',
      status: false,
    },
    {
      id: 12,
      name: 'Vàng hồng',
      status: false,
    },
    {
      id: 13,
      name: 'Xanh bộ đội',
      status: false,
    },
    {
      id: 14,
      name: 'Xanh dương',
      status: false,
    },
    {
      id: 15,
      name: 'Xanh lá',
      status: false,
    },
    // {
    //   id: 16,
    //   name: 'Màu khác',
    //   status: false
    // }
  ]);
  const [faceShape, setFaceShape] = useState([
    {
      id: 1,
      name: 'Hình tròn',
      type: 'circle',
      status: false,
    },
    {
      id: 2,
      name: 'Hình vuông',
      type: 'square',
      status: false,
    },
    {
      id: 3,
      name: 'Hình chữ nhật',
      type: 'rectangle',
      status: false,
    },
    {
      id: 4,
      name: 'Hình khác',
      type: 'other',
      status: false,
    },
  ]);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const newList = await ApiCountry.getCountry();
      const newListTrademark = await ApiTrademark.gettTademark();
      const newListModels = await ApiModels.getModels();
      setTypeProduct(newListTrademark);
      setCountry(newList);
      setModels(newListModels);
    } catch (error) {
      console.log(error);
    }
  };

  const searchByPrice = (item) => {
    const newData = [...prices];
    newData.forEach((elem, index) => {
      if (elem.price1 === item.price1 && elem.price2 === item.price2 && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.price1 === item.price1 && elem.price2 === item.price2) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      } else {
        newData[index] = {
          ...newData[index],
          status: false,
        };
      }
    });
    setPrices(newData);
    props.searchByPrice(item);
  };

  const searchByCountry = (item) => {
    const newData = [...country];
    newData.forEach((elem, index) => {
      if (elem.type === item.type && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.type === item.type) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      }
    });
    setCountry(newData);
    props.searchByCountry(item.type);
  };

  const searchByType = (item) => {
    const newData = [...typeProduct];
    newData.forEach((elem, index) => {
      if (elem.type === item.type && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.type === item.type) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      }
    });
    setTypeProduct(newData);
    props.searchByType(item.id);
  };

  const searchByWater = (item) => {
    const newData = [...waterResistance];
    newData.forEach((elem, index) => {
      if (elem.water1 === item.water1 && elem.water2 === item.water2 && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.water1 === item.water1 && elem.water2 === item.water2) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      } else {
        newData[index] = {
          ...newData[index],
          status: false,
        };
      }
    });
    setWaterResistance(newData);
    props.searchByWater(item);
  };

  const searchByModel = (item) => {
    const newData = [...models];
    newData.forEach((elem, index) => {
      if (elem.model === item.model && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.model === item.model) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      }
    });
    setModels(newData);
    props.searchByModel(item.id);
  };

  const searchByStrapColor = (item) => {
    const newData = [...strapColor];
    newData.forEach((elem, index) => {
      if (elem.name === item.name && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.name === item.name) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      }
    });
    setStrapColor(newData);
    props.searchByStrapColor(item.name);
  };

  const searchByFaceShape = (item) => {
    const newData = [...faceShape];
    newData.forEach((elem, index) => {
      if (elem.name === item.name && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false,
        };
        return;
      }
      if (elem.name === item.name) {
        newData[index] = {
          ...newData[index],
          status: true,
        };
      }
    });
    setFaceShape(newData);
    props.searchByFaceShape(item.type);
  }
  return (
    <div className="search">
      <div className="box">
        <div className="search__title">
          <p>Hình dáng mặt</p>
        </div>
        <div className="search__content">
          <ul>
            {faceShape &&
              faceShape.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByFaceShape(item)}
                  >
                    {item.name}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="search__title">
          <p>Màu giây đeo</p>
        </div>
        <div className="search__content" style={{ height: '300px', overflowY: 'scroll' }}>
          <ul>
            {strapColor &&
              strapColor.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByStrapColor(item)}
                  >
                    {item.name}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="search__title">
          <p>Kiểu máy</p>
        </div>
        <div className="search__content">
          <ul>
            {models &&
              models.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByModel(item)}
                  >
                    {item.name}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="search__title">
          <p>Thương hiệu</p>
        </div>
        <div className="search__content">
          <ul>
            {typeProduct &&
              typeProduct.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByType(item)}
                  >
                    {item.name}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="search__title">
          <p>Độ chịu nước</p>
        </div>
        <div className="search__content">
          <ul>
            {waterResistance.map((item, index) => {
              return (
                <li
                  className={item.status === true ? 'active' : ''}
                  key={index}
                  onClick={() => searchByWater(item)}
                  style={{ paddingLeft: '0px' }}
                >
                  <p style={{ margin: 'auto' }}>
                    {item.water1 === 0 ? 'Dưới ' : item.water1 === 200 ? 'Trên' : item.water1 + ' m -> '}
                    {item.water2 === 9999999999999 ? ' 200' : item.water2} m
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="search__title">
          <p>Khoảng giá</p>
        </div>
        <div className="search__content">
          <ul>
            {prices.map((item, index) => {
              return (
                <li
                  className={item.status === true ? 'active' : ''}
                  key={index}
                  onClick={() => searchByPrice(item)}
                  style={{ paddingLeft: '0px' }}
                >
                  <p style={{ margin: 'auto' }}>
                    {item.price1 === 0
                      ? 'Dưới '
                      : item.price1 === 10000000
                      ? 'Trên'
                      : item.price1 + ' -> '}
                    {item.price2 === 9999999999999 ? ' 10000000' : item.price2}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="box">
        <div className="search__title">
          <p>Xuất xứ</p>
        </div>
        <div className="search__content">
          <ul>
            {country &&
              country.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByCountry(item)}
                  >
                    {item.name}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
