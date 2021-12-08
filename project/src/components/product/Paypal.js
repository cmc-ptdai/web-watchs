import React, { useEffect, useRef } from 'react'

export default function Paypal(props) {

  const  paypal = useRef()

  const product = {
    price: 100.77,
    name: 'comfy chair',
    description: 'fancy chair, like new'
  };


  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: product.description,
                amount: {
                  currency_code: 'USD',
                  value: props.moneyPayOl,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          //const order = await actions.order.capture();
          //console.log(order);
          sendStatus()
        },
        onError: err => {
          //setError(err);
          console.error(err);
        },
      })
      .render(paypal.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.description, product.price]);

  const sendStatus = () => {
    props.paySuccess(true);
  }

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  )
}
