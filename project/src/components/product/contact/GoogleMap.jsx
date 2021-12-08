import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';


const Map = () => {
  return (
    <div>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 21.004699496540294, lng: 105.7277042777993 }}
      >
        <Marker
          icon={{
            url: 'https://insulationpads.co.uk/wp-content/uploads/2017/10/Home.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          position={{ lat: 21.004699496540294, lng: 105.7277042777993 }}
        />
      </GoogleMap>
    </div>
  );
}

export default withScriptjs(withGoogleMap(Map));
//105.7277042777993
// function Map() {
//   return (
//     <>
//     <GoogleMap
//       defaultZoom={10}
//       defaultCenter={{ lat: 21.004699496540294, lng: 105.7277042777993 }}
//     >
//       <Marker
//         icon={{
//           url: 'https://insulationpads.co.uk/wp-content/uploads/2017/10/Home.png',
//           scaledSize: new window.google.maps.Size(40, 40),
//         }}
//         position={{ lat: 21.004699496540294, lng: 105.7277042777993 }}
//       />
//     </GoogleMap>
//     </>
//   )
// }


// const wrapperMap = withScriptjs(withGoogleMap(Map))

// export default function GoogleMapProduct () {
//   return (
//     <div>
//       <wrapperMap
//         googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAdSxPN8fFT56BvY99uFdHN5BGhpzIjdkw&callback=initMap`}
//         loadingElement={<div style={{ height: `100%` }} />}
//         containerElement={<div style={{ height: `90vh`, margin: `auto`, border: '2px solid black' }} />}
//         mapElement={<div style={{ height: `100%` }} />}
//       />
//     </div>
//   )
// }
