import React, { FC, Fragment } from "react";
// import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapComponent = withScriptjs(
  withGoogleMap(
    ({
      isMarkerShown,
      markerPosition,
      defaultCenter,
      center,
      handleClickOnMap,
      error,
      touched,
    }) => {
      const handleClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        handleClickOnMap({ lat, lng });
      };

      return (
        <Fragment>
          <GoogleMap
            defaultZoom={14}
            defaultCenter={defaultCenter}
            center={center}
            onClick={(e) => handleClick(e)}
          >
            {isMarkerShown && <Marker position={markerPosition} />}
          </GoogleMap>
          {error && touched && <span className="error-text">{error}</span>}
        </Fragment>
      );
    }
  )
);

export default MapComponent;
