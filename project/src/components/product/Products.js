import React, { useEffect, useState } from 'react';
import SearchProduct from './search/SearchProduct';
import productApi from '../../api/productApi';
import Sort from './sort/Sort';
import './products.scss';
import { Link } from 'react-router-dom';
import MyPagination from './MyPagination';
import { Breadcrumb } from 'antd';

const Products = ({ gender }) => {
  const [products, setProducts] = useState([]);
  const [listSort, setListSort] = useState(null);
  const [listKeySort, setListKeySort] = useState({});

  const fetchProducts = async () => {
    try {
      let response = [];
      if (gender === '') {
        response = await productApi.getAll();
      } else {
        const params = {
          gender: gender,
        };
        response = await productApi.getAll(params);
      }
      setProducts(response);
      setListSort(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sortListKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKeySort]);

  const sortListKey = () => {
    const lengthKey = Object.keys(listKeySort);
    let newArr = [...products];
    if (lengthKey.length > 0) {
      for (const key in listKeySort) {
        if (key === 'price') {
          newArr = newArr.filter(
            (element) =>
              Number(element[key]) >= listKeySort.price.price1 &&
              Number(element[key]) < listKeySort.price.price2
          );
        } else if (key === 'water') {
          newArr = newArr.filter(
            (element) =>
              Number(element.waterResistance) >= listKeySort.water.water1 &&
              Number(element.waterResistance) < listKeySort.water.water2
          );
        } else if (key === 'strapColor') {
          newArr = newArr.filter((element) => {
            let status = false
            listKeySort[key].forEach((item) => {
              if (element[key].toLowerCase().indexOf(item.toLowerCase()) !== -1) {
                status = true
              }
            })
            return status;
          });
        } else {
          newArr = newArr.filter((element) => {
            let status = false
            listKeySort[key].forEach((item) => {
              if (element[key] === item) {
                status = true
              }
            })
            return status;
          });
        }
      }
      console.log(newArr);
      setListSort(newArr);
    } else {
      setListSort(products);
    }
  };

  const searchByPrice1 = (value) => {
    let newList = {};
    if (listKeySort?.price) {
      if (listKeySort.price.price1 === value.price1 && listKeySort.price.price2 === value.price2) {
        delete listKeySort.price;
        newList = { ...listKeySort };
      } else {
        newList = {
          ...listKeySort,
          price: value,
        };
      }
    } else {
      newList = {
        ...listKeySort,
        price: value,
      };
    }
    setListKeySort(newList);
  };

  const searchByWater = (value) => {
    let newList = {};
    if (listKeySort?.water) {
      if (listKeySort.water.water1 === value.water1 && listKeySort.water.water2 === value.water2) {
        delete listKeySort.water;
        newList = { ...listKeySort };
      } else {
        newList = {
          ...listKeySort,
          water: value,
        };
      }
    } else {
      newList = {
        ...listKeySort,
        water: value,
      };
    }
    setListKeySort(newList);
  }

  const searchByType = (id) => {
    let newList = {};
    if (listKeySort?.brand) {
      const data = listKeySort.brand.filter(item => item !== id)
      if (data.length === listKeySort.brand.length) {
        listKeySort.brand.push(id);
        newList = {...listKeySort}
      } else if(data.length === 0) {
        delete listKeySort.brand
        newList = { ...listKeySort};
      } else {
        newList = {
          ...listKeySort,
          brand: data
        }
      }
    } else {
      newList = {
        ...listKeySort,
        brand: [id],
      };
    }
    setListKeySort(newList);
  };

  const searchByCountry = (id) => {
    let newList = {};
    if (listKeySort?.country) {
      const data = listKeySort.country.filter(item => item !== id)
      if (data.length === listKeySort.country.length) {
        listKeySort.country.push(id);
        newList = {...listKeySort}
      } else if(data.length === 0) {
        delete listKeySort.country
        newList = { ...listKeySort};
      } else {
        newList = {
          ...listKeySort,
          country: data
        }
      }
    } else {
      newList = {
        ...listKeySort,
        country: [id],
      };
    }
    setListKeySort(newList);
  };

  const sortProduct1 = (key) => {
    if (key === '1') {
      const newArr = [...listSort];
      newArr.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else {
          return 0;
        }
      });
      setListSort(newArr);
    }
    if (key === '2') {
      const newArr = [...listSort];
      newArr.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        } else {
          return 0;
        }
      });
      setListSort(newArr);
    }
    if (key === '3') {
      const newArr = [...listSort];
      newArr.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          return 0;
        }
      });
      setListSort(newArr);
    }
    if (key === '4') {
      const newArr = [...listSort];
      newArr.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else {
          return 0;
        }
      });
      setListSort(newArr);
    }
  };

  const searchByModel = (id) =>{
    let newList = {};
    if (listKeySort?.model) {
      const data = listKeySort.model.filter(item => item !== id)
      if (data.length === listKeySort.model.length) {
        listKeySort.model.push(id);
        newList = {...listKeySort}
      } else if(data.length === 0) {
        delete listKeySort.model
        newList = { ...listKeySort};
      } else {
        newList = {
          ...listKeySort,
          model: data
        }
      }
    } else {
      newList = {
        ...listKeySort,
        model: [id],
      };
    }
    setListKeySort(newList);
  };

  const searchByStrapColor = (name) => {
    let newList = {};
    if (listKeySort?.strapColor) {
      const data = listKeySort.strapColor.filter(item => item !== name)
      if (data.length === listKeySort.strapColor.length) {
        listKeySort.strapColor.push(name);
        newList = {...listKeySort}
      } else if(data.length === 0) {
        delete listKeySort.strapColor
        newList = { ...listKeySort};
      } else {
        newList = {
          ...listKeySort,
          strapColor: data
        }
      }
    } else {
      newList = {
        ...listKeySort,
        strapColor: [name],
      };
    }
    setListKeySort(newList);
  }

  const searchByFaceShape = (name) => {
    let newList = {};
    if (listKeySort?.faceShape) {
      const data = listKeySort.faceShape.filter(item => item !== name)
      if (data.length === listKeySort.faceShape.length) {
        listKeySort.faceShape.push(name);
        newList = {...listKeySort}
      } else if(data.length === 0) {
        delete listKeySort.faceShape
        newList = { ...listKeySort};
      } else {
        newList = {
          ...listKeySort,
          faceShape: data
        }
      }
    } else {
      newList = {
        ...listKeySort,
        faceShape: [name],
      };
    }
    setListKeySort(newList);
  }
  return (
    <div className="products">
      <div className="col-12">
        <div className="row">
          <div className="col-9">
            <span>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/">trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/products">sản phẩm</Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </span>
          </div>
          <div className="col-3 sort">
            <Sort sortProduct={sortProduct1} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 list-sort">
          <SearchProduct
            searchByPrice={searchByPrice1}
            searchByType={searchByType}
            searchByCountry={searchByCountry}
            searchByWater={searchByWater}
            searchByModel={searchByModel}
            searchByStrapColor={searchByStrapColor}
            searchByFaceShape={searchByFaceShape}
          />
        </div>

        <div className="col-lg-9 products__content">
          <div className="row">
            <MyPagination listSort={listSort} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
