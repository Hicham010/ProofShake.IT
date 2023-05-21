import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { WagmiConfig, configureChains, createClient, mainnet } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { HashRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider } = configureChains([mainnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "ERC20 ZK-Permit",
  projectId: "004c893129510636115d7dbdeb119a45",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            showRecentTransactions={true}
            chains={chains}
            coolMode={true}
            modalSize={"compact"}
          >
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
