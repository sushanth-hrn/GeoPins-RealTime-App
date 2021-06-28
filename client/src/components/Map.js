import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 17
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPostion] = useState(null);

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getUserPosition();
  },[]);

  const getUserPosition = () => {
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({
          ...viewport,
          latitude,
          longitude
        });
        setUserPostion({
          latitude,
          longitude
        })
      },(error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    ); 
    }
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if(!leftButton){
      return;
    }
    if(!state.draft){
      dispatch({ type:'CREATE_DRAFT' });
    }
    const [ longitude, latitude ] = lngLat;
    dispatch({
      type:'UPDATE_DRAFT_LOCATION', 
      payload:{
        latitude,
        longitude
      }
    })

  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken="pk.eyJ1Ijoic3VzaGFudGgtaHJuIiwiYSI6ImNrcTdpcms0aTA2a2Yyd29hYnQybTl3a2MifQ.hsf43FH9798nr1RG_Jgg8g"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={(newViewport) => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>
        {userPosition && 
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        }
        {state.draft && 
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        }
      </ReactMapGL>
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
