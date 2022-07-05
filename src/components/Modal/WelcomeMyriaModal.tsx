// Import Components
import Modal from '.';
import { GamesIcon } from '../Icons';
import GasIcon from '../Icons/GasIcon';
import PlayGameIcon from '../Icons/PlayGameIcon';
import StakeIcon from '../Icons/StakeIcon';

type Props = {
  modalShow: Boolean;
  closeModal: any;
};

const steps = [
  {
    icon: <GasIcon className="" size={41} />,
    title: 'GAS FREE TRANSACTIONS',
    content:
      'Vegan PBR&B listicle sriracha. Migas lomo helvetica, listicle paleo salvia sartorial.',
  },
  {
    icon: <StakeIcon className="" size={41} />,
    title: 'STAKE YOUR MYRIA TOKENS TO EARN',
    content:
      'Crucifix dreamcatcher try-hard ugh lyft. Intelligentsia whatever mlkshk salvia.',
  },
  {
    icon: <PlayGameIcon className="" size={41} />,
    title: 'PLAY AWESOME GAMES',
    content:
      'Uuthentic jianbing wolf coloring book echo park fam. Iceland cray occupy ennui, franzen tilde poke.',
  },
];

export default function WelcomeMyriaModal({ modalShow, closeModal }: Props) {
  return (
    <div>
      {modalShow && (
        <Modal
          closeModal={() => closeModal()}
          width="576px"
          title="Welcome to Myria"
        >
          <div>
            <div className="mt-[59px]">
              <div className="mt-[44px]">
                {steps.map((item: any, index: number) => (
                  <div className="flex mt-[16px]" key={index}>
                    <div className="mr-[25px]">{item.icon}</div>
                    <div className="text-[16px]">
                      <div>{item.title}</div>
                      <span className="text-[#9DA3A7] text-sm">
                        {item.content}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-[61px]">
              <button
                onClick={() => {
                  closeModal();
                }}
                className="w-[194px] h-[48px] flex justify-center items-center text-black text-[16px] font-bold bg-[#737373] rounded-[8px] bg-primary6"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
