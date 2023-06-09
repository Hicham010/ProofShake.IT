import { Button, Divider, Input, QRCode, Spin, message } from "antd";
import { useState } from "react";
import { useEnsAddress } from "wagmi";
import { baseUrl, messageToSign, truncateAddress } from "./constants";
import { useCreateSessionMutation, useGetStatusSessionQuery } from "./app/api";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { isAddress, isValidName, verifyMessage } from "ethers/lib/utils.js";
import { constants } from "ethers";

function Challenge() {
  const [ensNameInput, setEnsNameInput] = useState("");
  const [provingSessionId, setProvingSessionId] = useState("");
  const [isChallengeVis, setIsChallengeVis] = useState(false);

  const [createSession, { data, isSuccess }] = useCreateSessionMutation();

  const { data: sessionResult, isSuccess: resultsRetrieved } =
    useGetStatusSessionQuery(
      {
        sessionid: data?.id,
      },
      { pollingInterval: 1000, skip: !isSuccess || !data?.id }
    );

  // if (isSuccess) {
  //   console.log({ data });
  // }

  // if (resultsRetrieved) {
  //   console.log({ sessionResult });
  // }

  const userAddress =
    resultsRetrieved && sessionResult.sessionstatus !== 0
      ? verifyMessage(messageToSign, sessionResult.sessionstatus)
      : constants.AddressZero;

  const { data: ensNameOwner, isLoading: isLoadinEns } = useEnsAddress({
    name: ensNameInput,
    enabled: isValidName(ensNameInput),
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Input
          style={{ width: "50%" }}
          placeholder="Fill in your ENS name or address"
          onChange={(e) => setEnsNameInput(e.target.value)}
        />
        <Button
          type="primary"
          disabled={ensNameInput === "" || !isValidName(ensNameInput)}
          onClick={async () => {
            setIsChallengeVis(true);
            try {
              const { id } = await createSession("").unwrap();
              setProvingSessionId(id);
              message.success("Challenge successfully created");
            } catch (err) {
              message.error("Failed to create Challenge");
              console.error(err);
            }
          }}
          style={{ marginLeft: "15px" }}
        >
          Generate Challenge
        </Button>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "center" }}>{ensName}</div> */}
      {isChallengeVis && (
        <>
          <h3 style={{ textAlign: "center" }}>
            Share this code with the prover
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "25px",
            }}
          >
            <div
              style={{
                width: "auto",
                height: "auto",
                background: "white",
              }}
            >
              <QRCode
                value={`${baseUrl}/prover/${provingSessionId}/${ensNameInput}`}
                icon="proofShakeLogo.png"
              />
            </div>
            <CopyOutlined
              style={{ margin: "2%" }}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${baseUrl}/prover/${provingSessionId}/${ensNameInput}`
                );
                message.success("Added prover link to clipboard");
              }}
            />
          </div>

          <Divider />

          {!sessionResult?.sessionstatus ||
          sessionResult?.sessionstatus === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "50px",
              }}
            >
              <Spin
                spinning={
                  !sessionResult?.sessionstatus ||
                  sessionResult?.sessionstatus === 0
                }
                tip="Waiting on proof"
                size="large"
              />
            </div>
          ) : (
            <>
              {ensNameOwner === userAddress ? (
                <h1 style={{ textAlign: "center" }}>
                  Proof is valid{" "}
                  <CheckCircleOutlined style={{ color: "green" }} />
                </h1>
              ) : (
                <h1 style={{ textAlign: "center" }}>
                  Proof is invalid{" "}
                  <CloseCircleOutlined style={{ color: "red" }} />
                </h1>
              )}

              {/* <h3 style={{ textAlign: "center" }}>
                Verified address: {truncateAddress(userAddress)}
              </h3> */}

              {!isLoadinEns ? (
                !isAddress(ensNameInput) && (
                  <>
                    {ensNameOwner ? (
                      <h1 style={{ textAlign: "center" }}>
                        Owner of '{ensNameInput}' is{" "}
                        {truncateAddress(ensNameOwner)}
                      </h1>
                    ) : (
                      <h1 style={{ textAlign: "center" }}>
                        '{ensNameInput}' doesn't have an owner
                      </h1>
                    )}
                  </>
                )
              ) : (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Spin size="large" />
                </div>
              )}
            </>
          )}
        </>
      )}
      {/* <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          onClick={() => createSession("")}
        >
          Create Session
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          onClick={() =>
            submitSession({
              sessionid: "75106efb7f6aecec4829595cc80bbc61f1110062",
              proofstring: "Testing",
            })
          }
        >
          Submit Signature to Session
        </Button>
      </div> */}
    </>
  );
}

export default Challenge;
