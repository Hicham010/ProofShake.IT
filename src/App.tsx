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
      <div style={{ display: "flex", justifyContent: "end", padding: "3%" }}>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              width={400}
              src="proofShakeLogo.png"
            />
          </div>
          <h1 style={{ textAlign: "center" }}>Do you want to</h1>
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
              <strong>Proof</strong>
            </Button>
            <h3 style={{ textAlign: "center" }}>Or</h3>
            <Button
              style={{ width: "35%", margin: "0 50px" }}
              type="primary"
              onClick={() => history.push("/challenge")}
            >
              <strong>Verify</strong>
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
        <Route path={"/prover/:sessionid/:ensName"}>
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
