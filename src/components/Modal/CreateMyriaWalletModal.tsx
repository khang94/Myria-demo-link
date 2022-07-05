import { forwardRef, useImperativeHandle, useState } from 'react';
import { IMyriaClient, Modules, MyriaClient } from 'myria-core-sdk';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '.';
import Toggle from '../Toggle';
import { WarningIcon } from '../Icons';
import { RootState } from '../../app/store';
import { setStarkPublicKey } from '../../app/slices/accountSlice';
import LoadingIcon from '../Icons/LoadingIcon';
import CheckIconFull from '../Icons/CheckIconFull';
import WelcomeMyriaModal from './WelcomeMyriaModal';
import FirstDepositModal from './FirstDepositModal';
import MessageDepositModal from './MessageDepositModal';

type RefType = {
  onOpenModal: () => void;
  onCloseModal: () => void;
};

type Props = {
  metaMaskConnect: any;
};

const steps = [
  {
    id: 1,
    title: 'Verify Wallet Ownership',
    description:
      'Vegan PBR&B listicle sriracha. Migas lomo helvetica, listicle paleo salvia sartorial.',
  },
  {
    id: 2,
    title: 'Create your Myria Key',
    description:
      'Intelligentsia whatever mlkshk salvia, authentic jianbing wolf coloring book echo park fam.',
  },
];
declare let window: any;
const CreateMyriaWalletModal = forwardRef<RefType, Props>((props, ref) => {
  const { metaMaskConnect } = props;
  const dispatch = useDispatch();
  const [display, setDisplay] = useState<boolean>(false);
  const [welcomeModal, setWelcomeModal] = useState<boolean>(false);
  const [showFirstDepositModal, setShowFirstDepositModal] =
    useState<Boolean>(false);
  const [isShowMessage, setIsShowMessage] = useState<Boolean>(false);
  const [step, setStep] = useState({
    sign: false,
    fastTransaction: false,
    loadingSign: false,
    loadingFastTransaction: false,
  });
  const account = useSelector(
    (state: RootState) => state.account.connectedAccount,
  );
  const starkPublicKeyFromPrivateKey = useSelector(
    (state: RootState) => state.account.starkPublicKeyFromPrivateKey,
  );
  const onOpenModal = () => {
    setDisplay(true);
  };
  const onCloseModal = () => {
    setDisplay(false);
  };

  const onRequestSignature = async () => {
    if (!account) {
      console.error('Please connect wallet first.');
      return;
    }
    const message = 'Message request signature: ';
    const fromWalletAddress = account;
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
      const userModule = moduleFactory.getUserModule();
      const starkKey = commonModule.getStarkPublicKey(wSignature);
      setStep({
        ...step,
        loadingSign: false,
        sign: true,
        loadingFastTransaction: true,
      });
      dispatch(setStarkPublicKey(starkKey));
      setTimeout(() => {
        setStep({
          loadingSign: false,
          sign: true,
          loadingFastTransaction: false,
          fastTransaction: true,
        });
        userModule
          .registerUser('0x' + starkKey, account)
          .then(data => {
            alert('User Register Success!');
            setWelcomeModal(true);
          })
          .catch(err => {
            alert('User Register Error!');
            setWelcomeModal(true);
          })
          .finally(() => {
            onCloseModal();
          });
      }, 2000);
    }
  };
  const onSendRequest = () => {
    setStep({ ...step, loadingSign: true });
    metaMaskConnect().then(() => {
      onRequestSignature();
      // onCloseModal();
    });
  };
  useImperativeHandle(ref, () => ({
    onOpenModal,
    onCloseModal,
  }));
  const renderSignStep = (step: boolean, loadingStep: boolean, title: any) => {
    if (loadingStep) {
      return <LoadingIcon size={41} className="" />;
    }
    if (step) {
      return <CheckIconFull className="" size={41} />;
    }
    return title;
  };

  const onGetStarted = () => {
    setWelcomeModal(false);
    setShowFirstDepositModal(true);
  };
  return (
    <div className="text-white">
      {display && (
        <Modal
          closeModal={onCloseModal}
          title="Create your Myria Wallet"
          width="576px"
        >
          <div>
            <div className="mt-[59px]">
              <div className="font-bold text-[28px] text-center" />
              <div className="mt-[44px]">
                <div className="flex mt-[16px]">
                  <div className="w-[40px] flex-none h-[40px] bg-base8 flex justify-center items-center rounded-full font-bold text-[14px]  mr-4">
                    {renderSignStep(step.sign, step.loadingSign, steps[0].id)}
                  </div>

                  <div>
                    <div className="font-bold  text-[14px]">
                      {steps[0].title}
                    </div>
                    <div className="text-[14px]  mt-2">
                      {steps[0].description}
                    </div>
                  </div>
                </div>
                <div className="flex mt-[16px]">
                  <div className="w-[40px] flex-none h-[40px] bg-base7 flex justify-center items-center rounded-full font-bold text-[14px]  mr-4">
                    {renderSignStep(
                      step.fastTransaction,
                      step.loadingFastTransaction,
                      steps[1].id,
                    )}
                  </div>
                  <div>
                    <div className="font-bold  text-[14px]">
                      {steps[1].title}
                    </div>
                    <div className="text-[14px]  mt-2">
                      {steps[1].description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-[50px]">
              <div className="flex">
                <div className="text-[14px] ">Remember me for next time</div>
                <WarningIcon className="text-[#292D32] ml-4 cursor-pointer" />
              </div>
              <div>
                <Toggle />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onSendRequest}
                className="w-[194px] h-[48px] flex justify-center items-center text-black text-[16px] font-bold bg-primary6 rounded-[8px]"
              >
                SEND REQUESTS
              </button>
            </div>
          </div>
        </Modal>
      )}
      <WelcomeMyriaModal modalShow={welcomeModal} closeModal={onGetStarted} />
      <FirstDepositModal
        modalShow={showFirstDepositModal}
        closeModal={() => setShowFirstDepositModal(false)}
        completeDepositModal={() => setIsShowMessage(true)}
      />
      <MessageDepositModal
        isShowMessage={isShowMessage}
        setIsShowMessage={setIsShowMessage}
      />
    </div>
  );
});
export default CreateMyriaWalletModal;
