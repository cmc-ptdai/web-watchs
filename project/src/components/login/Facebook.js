import { useState } from 'react';
import FacebookLogin from 'react-facebook-login';

const Facebook = () => {
  const [data, setData] = useState(null);

  const componentClicked = () => {
    console.log('click');
  }

  const responseFacebook = (response) => {
    console.log(response);
  }
  return (
    <div>
      <FacebookLogin
        appId="3137377463145830"
        autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
        icon="fa-facebook"
      />
    </div>
  );
};

export default Facebook;
