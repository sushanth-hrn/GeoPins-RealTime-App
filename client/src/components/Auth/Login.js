import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from 'graphql-request';

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Context from "../../context";
import { ME_QUERY } from '../../graphql/queries';
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      console.log({ idToken });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type:'IS_LOGGED_IN', payload:googleUser.isSignedIn() })
    } catch (error) {
      onFailure(error);
    }
  }

  const onFailure = err => {
    console.error('Error logging in the user ', err);
    dispatch({ type:'IS_LOGGED_IN', payload: false});
  }

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66,133,244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="355270680604-85hertmsivpt0ra9cigs42a9gq4u9700.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
