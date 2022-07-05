import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { IMyriaClient, Modules, MyriaClient } from 'myria-core-sdk';
import { asset } from '@starkware-industries/starkware-crypto-utils';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Modal from '../Modal';
import TermsOfServiceModal from '../Modal/TermsOfServiceModal';
import FirstDepositModal from '../Modal/FirstDepositModal';
import { RootState } from '../../app/store';
import {
  markWalletConnected,
  setAccount,
  setStarkPublicKey,
} from '../../app/slices/accountSlice';
import { setWithdrawClaimModal } from '../../app/slices/uiSlice';
import CreateMyriaAccountModal from '../Modal/CreateMyriaAccountModal';
import { MessageQuestionIcon } from '../Icons';
import MetaMask from '../../assets/images/MetaMask_Fox.png';
import CreateMyriaWalletModal from '../Modal/CreateMyriaWalletModal';
import MessageDepositModal from '../Modal/MessageDepositModal';
import MessageWithdrawModal from '../Modal/MessageWithdrawModal';
// @ts-ignore

declare const window: any;
interface TProps {
  children: JSX.Element | JSX.Element[];
}
export default function MainLayout({ children }: TProps) {
  const walletModalRef = useRef<any>();
  const [showWalletModal, setShowWalletModal] = useState<Boolean>(false);
  const [showPrivacyModal, setPrivacyModal] = useState<Boolean>(false);
  const [openMyriaWalletModal, setOpenMyriaWallet] = useState<Boolean>(false);
  const [isShowMessage, setIsShowMessage] = useState<Boolean>(false);
  const [previousBalance, setPreviousBalance] = useState<any>(0);
  const [showFirstDepositModal, setShowFirstDepositModal] =
    useState<Boolean>(false);
  const selectedToken = useSelector(
    (state: RootState) => state.token.selectedToken,
  );
  const account = useSelector(
    (state: RootState) => state.account.connectedAccount,
  );
  const starkPublicKeyFromPrivateKey = useSelector(
    (state: RootState) => state.account.starkPublicKeyFromPrivateKey,
  );

  const showingConnectModal = () => {
    setShowWalletModal(true);
  };
  const showWithDrawClaimModal = useSelector(
    (state: RootState) => state.ui.showWithDrawClaimModal,
  );
  const pKey = useSelector(
    (state: RootState) => state.account.starkPublicKeyFromPrivateKey,
  );

  const getBalanceOfMyriaL1Wallet = async () => {
    let assetType: string = '';
    if (selectedToken.name === 'Ethereum') {
      assetType = asset.getAssetType({
        type: 'ETH',
        data: {
          quantum: '1',
          // tokenAddress: '0xD5f1cC0264d0E22BE4488109dbf5d097eb37a576',
        },
      });
    } else {
      assetType = asset.getAssetType({
        type: 'ERC20',
        data: {
          quantum: '1',
          tokenAddress: selectedToken.tokenAddress,
        },
      });
    }
    const initializeClient: IMyriaClient = {
      provider: window.web3.currentProvider,
      networkId: 5,
      web3: window.web3,
    };

    const moduleFactory = new Modules.ModuleFactory(initializeClient);
    const withdrawModule = moduleFactory.getWithdrawModule();

    const assetList = await withdrawModule.getWithdrawalBalance(
      '0x' + pKey,
      assetType,
    );
    if (assetList !== previousBalance && previousBalance !== 0) {
      dispatch(
        setWithdrawClaimModal({
          show: true,
          claimAmount: assetList,
          isUpdated: true,
        }),
      );
    } else {
      console.log('not updated');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pKey && selectedToken) {
        getBalanceOfMyriaL1Wallet();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [pKey, selectedToken]);

  const dispatch = useDispatch();
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    if (window.web3) {
      const accounts = await window.web3.eth.getAccounts();
      dispatch(markWalletConnected());
      dispatch(setAccount(accounts[0]));
      return accounts[0];
    }
    return null;
  };
  const metaMaskConnect = async () => {
    setShowWalletModal(false);
    await loadWeb3();
  };
  const showTermsServiceModal = async () => {
    try {
      const client: IMyriaClient = {
        provider: window.web3.currentProvider,
        networkId: parseInt(window.web3.currentProvider.networkVersion, 10),
        web3: window.web3,
      };
      const myriaClient = new MyriaClient(client);
      const web3Account = await loadWeb3();
      const moduleFactory = new Modules.ModuleFactory(myriaClient);
      const userModule = moduleFactory.getUserModule();
      const user = await userModule.getUserByWalletAddress(web3Account);
      if (user.status === 'success' && user.data) {
        onRequestSignature(web3Account);
      }
    } catch (e) {
      setPrivacyModal(true);
    }
  };
  const onAcceptTermOfService = async () => {
    setPrivacyModal(false);
    walletModalRef.current.onOpenModal();
  };
  const onRequestSignature = async (web3Account: string) => {
    if (!web3Account) {
      console.error('Please connect wallet first.');
      return;
    }
    const message = 'Message request signature: ';
    const fromWalletAddress = web3Account;
    if (window.web3) {
      const wSignature = await window.web3.eth.personal.sign(
        message,
        fromWalletAddress,
      );
      const client: IMyriaClient = {
        provider: window.web3.currentProvider,
        networkId: parseInt(window.web3.currentProvider.networkVersion, 10),
        web3: window.web3,
      };
      const myriaClient = new MyriaClient(client);
      const moduleFactory = new Modules.ModuleFactory(myriaClient);
      const commonModule = moduleFactory.getCommonModule();
      const starkKey = commonModule.getStarkPublicKey(wSignature);
      dispatch(setStarkPublicKey(starkKey));
      setShowWalletModal(false);
    }
  };
  return (
    <div className="flex bg-c-background">
      <Sidebar showTermsServiceModal={showTermsServiceModal} />
      <div className="p-6 w-full">
        <Header
          handleConnectWallet={() => {
            setShowWalletModal(true);
          }}
          account={account}
        />
        <div className="mt-[42px]">
          <div className="flex items-center">
            <div className="bg-[#CCCCCC] w-[40px] h-[40px] rounded-full mr-[14px]" />
            <div className="text-[#666666] font-bold">CryptoPunk74</div>
          </div>
          {children}
        </div>
      </div>
      {showWalletModal && (
        <Modal
          closeModal={() => setShowWalletModal(false)}
          title="Connect your Wallet"
          className="min-w-[576px] pt-[37px] pb-[32px] px-[40px]"
          width="576px"
        >
          <div>
            <div
              onClick={() => {
                showTermsServiceModal();
              }}
              className="w-[340px] mx-auto py-[17px] border border-[#D4D4D4] rounded-[12px] mt-[80px] cursor-pointer flex items-center px-[37px]"
            >
              <div className="flex justify-center w-[88px] h-[88px]">
                <img src={MetaMask} alt="MetaMask_Image" />
              </div>
              <div className="ml-4">
                <div className="text-[18px]">Metamask</div>
                <div className="text-[14px]">Connect to Metamask</div>
              </div>
            </div>
            <div className="flex text-center justify-center mt-[102px] items-center">
              <MessageQuestionIcon className="text-[#292D32] mr-[10px]" />
              <p>How does Myria’s L2 Wallet work?</p>
            </div>
          </div>
        </Modal>
      )}
      <TermsOfServiceModal
        onAccept={onAcceptTermOfService}
        modalShow={showPrivacyModal}
        closeModal={() => setPrivacyModal(false)}
      />
      <CreateMyriaWalletModal
        metaMaskConnect={metaMaskConnect}
        ref={walletModalRef}
      />
      <CreateMyriaAccountModal
        className="pt-[37px] pb-[32px] px-[40px]"
        modalShow={openMyriaWalletModal}
        closeModal={() => setOpenMyriaWallet(false)}
      />
      <FirstDepositModal
        modalShow={showFirstDepositModal}
        closeModal={() => setShowFirstDepositModal(false)}
        completeDepositModal={() => setIsShowMessage(true)}
      />
      <MessageDepositModal
        isShowMessage={isShowMessage}
        setIsShowMessage={setIsShowMessage}
      />
      <MessageWithdrawModal
        isShowMessage={showWithDrawClaimModal}
        setIsShowMessage={() =>
          dispatch(
            setWithdrawClaimModal({
              show: false,
              claimAmount: 0,
              isUpdated: false,
            }),
          )
        }
      />
    </div>
  );
}
