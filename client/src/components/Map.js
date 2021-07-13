import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';

import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 17
};

const Map = ({ classes }) => {
  const client = useClient();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPostion] = useState(null);
  const [popup, setPopup] = useState(null);

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getUserPosition();
  },[]);

  useEffect(() => {
    getPins();
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

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type : "GET_PINS", payload : getPins});
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

  const handlePinClick = (pin) => {
    setPopup(pin);
    dispatch({ type : "CURRENT_PIN", payload : pin });  
  }

  const isAuthUser = () => state.currentUser._id === popup.author._id

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
        {
          state.pins.map((pin) => {
            return <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon size={40} color="darkblue" onClick={() => handlePinClick(pin)} />
          </Marker>
          })
        }

        {
          popup && (
            <Popup
              anchor="top"
              latitude={popup.latitude}
              longitude={popup.longitude}
              closeOnClick={false}
              onClose={() => setPopup(null)}
            >
              <img className={classes.popupImage} src={popup.image} alt={popup.title} />
              <div className={classes.popupTab}>
                <Typography>
                  {popup.latitude.toFixed(6)} , {popup.longitude.toFixed(6)}
                </Typography>
                {
                  isAuthUser() && (
                    <Button>
                      <DeleteIcon className={classes.deleteIcon} />
                    </Button>
                  )
                }
              </div>
            </Popup>
          )
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
