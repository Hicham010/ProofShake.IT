import {
  CheckCircleOutlined,
  CloseOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Button, Input, QRCode, Tooltip, message } from "antd";
import { constants } from "ethers";
import { isAddress, isValidName, verifyMessage } from "ethers/lib/utils.js";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useEnsAddress, useSignMessage } from "wagmi";
import { baseUrl, messageToSign, truncateAddress } from "./constants";

function VerifyAddressOwnership() {
  const { signatureFromParams = "", ensNameFromParams = "" } = useParams<{
    signatureFromParams: string;
    ensNameFromParams: string;
  }>();
  console.log({ signatureFromParams, ensNameFromParams });

  const { isConnected } = useAccount();
  const [ensNameInput, setEnsNameInput] = useState(ensNameFromParams);
  const {
    data: signature = "0x0",
    isSuccess: isSigned,
    isLoading: isSigning,
    signMessage,
  } = useSignMessage({
    message: messageToSign,
    onError: () => {
      message.error("Something went wrong when signing");
    },
  });

  const { data: ensNameOwner, isSuccess: isOwnerAddressRetrieved } =
    useEnsAddress({
      name: ensNameInput,
      enabled: isValidName(ensNameInput),
    });

  const isParamsPresent =
    signatureFromParams !== "" && ensNameFromParams !== "";

  const userAddress =
    isSigned || isParamsPresent
      ? verifyMessage(
          messageToSign,
          signatureFromParams === "" ? signature : signatureFromParams
        )
      : constants.AddressZero;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Input
          disabled={isParamsPresent}
          style={{ width: "50%" }}
          placeholder="Enter your ENS name or address to verify or public Address"
          onChange={(e) => setEnsNameInput(e.target.value)}
          defaultValue={ensNameFromParams}
        />
        <Button
          type="primary"
          disabled={
            !isConnected || isParamsPresent || !isValidName(ensNameInput)
          }
          loading={isSigning}
          style={{
            margin: "0 20px",
            // background:
            //   !isConnected || ensNameInput === "" || !isValidName(ensNameInput)
            //     ? "grey"
            //     : "",
          }}
          onClick={() => signMessage()}
        >
          <strong>Generate Proof</strong>
        </Button>
      </div>

      <div>
        {(isOwnerAddressRetrieved || isAddress(ensNameInput)) &&
          (isSigned || isParamsPresent) && (
            <>
              {/* <p style={{ textAlign: "center" }}>
                Signature:{" "}
                {signatureFromParams === "" ? signature : signatureFromParams}
              </p> */}

              {ensNameOwner === userAddress ? (
                <h1 style={{ textAlign: "center" }}>
                  Proof is valid{" "}
                  <CheckCircleOutlined style={{ color: "green" }} />
                </h1>
              ) : (
                <h1 style={{ textAlign: "center" }}>
                  Proof is invalid <CloseOutlined style={{ color: "red" }} />
                </h1>
              )}

              <h3 style={{ textAlign: "center" }}>
                Verified address: {truncateAddress(userAddress)}
              </h3>

              {!isAddress(ensNameInput) && (
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
              )}

              {/* {isAddress(ensNameInput) ? (
              <h1 style={{ textAlign: "center" }}>
                Address gotten from Signature: {userAddress}
              </h1>
            ) : null} */}

              {signatureFromParams === "" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title={"Share to verify"}>
                      <div
                        style={{
                          width: "auto",
                          height: "auto",
                          background: "white",
                          marginBottom: "auto",
                        }}
                      >
                        <QRCode
                          value={`${baseUrl}/verifyAddressOwernship/${signature}/${ensNameInput}`}
                        />
                      </div>
                    </Tooltip>

                    <CopyOutlined
                      style={{ margin: "2%" }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${baseUrl}/verifyAddressOwernship/${signature}/${ensNameInput}`
                        );
                        message.success("Added proof link to clipboard");
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
      </div>
    </>
  );
}

export default VerifyAddressOwnership;
