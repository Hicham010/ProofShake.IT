import { Button } from "antd";
import { useHistory } from "react-router-dom";

function FrontPage() {
  const history = useHistory();
  return (
    <>
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
          <strong>Challenge</strong>
        </Button>
      </div>
    </>
  );
}

export default FrontPage;
