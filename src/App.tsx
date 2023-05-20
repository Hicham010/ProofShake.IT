import { useEffect } from "react";
import VerifyTokenOwnership from "./VerifyTokenOwnership";
import { Button, message } from "antd";
import { Route, Switch, useHistory } from "react-router-dom";
import Challenge from "./Challenge";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Prover from "./Prover";
import Verifier from "./Verifier";
import VerifyAddressOwnership from "./VerifyAddressOwnership";

function App() {
  useEffect(() => {
    message.error({
      content: "No Internet Connection",
      key: "test",
      duration: navigator.onLine ? Infinity : 0,
    });
  }, []);

  const history = useHistory();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end", margin: "3%" }}>
        <ConnectButton
          showBalance={true}
          accountStatus={"full"}
        />
      </div>

      <Switch>
        <Route
          exact
          path={"/"}
        >
          <h1 style={{ textAlign: "center" }}>Proof Shake</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px",
              alignItems: "baseline",
            }}
          >
            <Button
              style={{ width: "35%", margin: "0 50px" }}
              type="primary"
              onClick={() => history.push("/verifyAddressOwernship")}
            >
              Single Proof
            </Button>
            <h1>Or</h1>
            <Button
              style={{ width: "35%", margin: "0 50px" }}
              type="primary"
              onClick={() => history.push("/challenge")}
            >
              Challenge
            </Button>
          </div>
        </Route>
        <Route path={"/verifyOwernship"}>
          <VerifyTokenOwnership />
        </Route>
        <Route
          path={
            "/verifyAddressOwernship/:signatureFromParams?/:ensNameFromParams?"
          }
        >
          <VerifyAddressOwnership />
        </Route>
        <Route path={"/challenge"}>
          <Challenge />
        </Route>
        <Route path={"/prover/:ensName"}>
          <Prover />
        </Route>
        <Route path={"/verifier/:signature/:ensName"}>
          <Verifier />
        </Route>
      </Switch>
    </>
  );
}

export default App;
