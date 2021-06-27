import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl } from 'react-map-gl';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPostion] = useState(null);

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
      }); 
    }
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken="pk.eyJ1Ijoic3VzaGFudGgtaHJuIiwiYSI6ImNrcTdpcms0aTA2a2Yyd29hYnQybTl3a2MifQ.hsf43FH9798nr1RG_Jgg8g"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={(newViewport) => setViewport(newViewport)}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>
      </ReactMapGL>

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
