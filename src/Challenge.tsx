import { Button, Input, QRCode } from "antd";
import { useState } from "react";
import { useAccount } from "wagmi";
import { baseUrl } from "./constants";
import { useCreateSessionMutation } from "./app/api";

function Challenge() {
  const { isConnected } = useAccount();
  const [ensNameInput, setEnsNameInput] = useState("");
  const [isChallengeVis, setIsChallengeVis] = useState(false);

  const [createSession, { data, isLoading, isSuccess }] =
    useCreateSessionMutation();

  if (isSuccess) {
    console.log(data);
  }
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Input
          style={{ width: "50%" }}
          placeholder="Fill in your ENS name"
          onChange={(e) => setEnsNameInput(e.target.value)}
        />
        <Button
          disabled={ensNameInput === ""}
          onClick={() => setIsChallengeVis((val) => !val)}
          style={{ marginLeft: "15px" }}
        >
          Generate Challenge
        </Button>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "center" }}>{ensName}</div> */}
      {isConnected && isChallengeVis && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QRCode value={`${baseUrl}/prover/${ensNameInput}`} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {`${baseUrl}/prover/${ensNameInput}`}
          </div>
        </>
      )}
      <Button
        type="primary"
        onClick={() => createSession("")}
      >
        Create Session
      </Button>
    </>
  );
}

export default Challenge;
