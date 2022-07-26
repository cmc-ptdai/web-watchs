import React from 'react';
import FacebookLogin from 'react-facebook-login';
import './style.scss'

const Facebook = ({loginFacebook}) => {

  const responseFacebook = (response) => {
    if (response.picture) {
      loginFacebook(response)
    }
  };
  return (
    <div>
        <FacebookLogin
        appId="527333432520083"
        autoLoad={false}
        fields="name,email,picture"
        scope="public_profile,user_friends"
        callback={responseFacebook}
        cssClass="login__btn--facebook"
        ></FacebookLogin>
    </div>
  );
};

export default Facebook;
