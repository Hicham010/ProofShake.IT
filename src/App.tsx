import { useEffect } from "react";
import VerifyTokenOwnership from "./VerifyTokenOwnership";
import { Button, message } from "antd";
import { Link, Route, Switch } from "react-router-dom";
import Challenge from "./Challenge";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Prover from "./Prover";
import Verifier from "./Verifier";

function App() {
  useEffect(() => {
    message.error({
      content: "No Internet Connection",
      key: "test",
      duration: navigator.onLine ? Infinity : 0,
    });
  }, []);

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
          <h1 style={{ textAlign: "center" }}>Proof Stake</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px",
            }}
          >
            <Link to="/verifyOwernship">Create proof of ownership</Link>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px",
            }}
          >
            <Link to="/challenge">Challenge</Link>
          </div>
        </Route>
        <Route path={"/verifyOwernship"}>
          <VerifyTokenOwnership />
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
