// Import packages
import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';

// Import components
import Popover from '../Popover';
import {
  ConnectIcon,
  DropdownArrowIcon,
  GlobalIcon,
  NotificationIcon,
  TriangularIcon,
  GamesIcon,
  DAppIcon,
  MarketPlaceIcon,
} from '../Icons';
import L2WalletPopover from '../Popover/L2WalletPopover';

// Import Redux
import { RootState } from '../../app/store';
import ClaimWithdrawPopover from '../Popover/ClaimWithdrawPopover';

enum TAB {
  GAMES,
  DAPPS,
  STORE,
}

const tabs = [
  { id: 1, name: 'GAMES', icon: GamesIcon },
  { id: 2, name: 'DAPPS', icon: DAppIcon },
  { id: 3, name: 'STORE', icon: MarketPlaceIcon },
];

interface TProps {
  handleConnectWallet: any;
  account: any;
}

export default function Header({ handleConnectWallet, account }: TProps) {
  const [activeTab, setActiveTab] = useState<number>(TAB.GAMES);
  const showClaimPopover = useSelector(
    (state: RootState) => state.ui.showClaimPopover,
  );
  const popoverRef = useRef<any>();

  const selectTabHandle = (param: number) => {
    setActiveTab(param);
  };

  const abbreviationAddress = `${account.substring(0, 4)}...${account.substring(
    account.length - 4,
    account.length,
  )}`;

  const closePopover = () => {
    popoverRef?.current?.closePopover();
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex">
        {tabs.map((item: any, index: number) => (
          <div
            onClick={() => {
              selectTabHandle(index);
            }}
            className={cn(
              'relative flex rounded-[8px] pl-4 pr-[21px] py-2 items-center mr-6 cursor-pointer bg-[#081824]',
              activeTab === index ? 'text-white' : 'text-light-blue',
            )}
            key={index}
          >
            <div className="w-6 h-6 rounded-full">
              <item.icon className="" size={24} />
            </div>
            <p className="ml-2 font-bold text-[14px]">{item.name}</p>
            {activeTab === index && (
              <div className="absolute bottom-[-8px] right-[calc(50%-8px)]">
                <TriangularIcon className="text-[#081824]" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <GlobalIcon className="text-white cursor-pointer mx-3" />
        <NotificationIcon
          className="text-white cursor-pointer mx-3"
          size={24}
        />
        <div className="bg-[#081824] text-[#5C5C5C] flex rounded-[8px] cursor-pointer ml-3">
          <div className="m-[1px] bg-[#040B10] px-[12px] py-[10px] rounded-[7px]">
            {account ? (
              <Popover
                ref={popoverRef}
                width="min-w-[442px]"
                offsetX={-170}
                defaultShow={showClaimPopover}
                renderElement={
                  showClaimPopover ? (
                    <ClaimWithdrawPopover
                      abbreviationAddress={abbreviationAddress}
                      onClosePopover={closePopover}
                    />
                  ) : (
                    <L2WalletPopover
                      onClosePopover={closePopover}
                      abbreviationAddress={abbreviationAddress}
                    />
                  )
                }
              >
                <span className="uppercase">{abbreviationAddress}</span>
              </Popover>
            ) : (
              <span
                className="text-white font-bold"
                onClick={() => {
                  handleConnectWallet();
                }}
              >
                Connect Wallet
              </span>
            )}
          </div>
          <div className="flex items-center px-3">
            <ConnectIcon className="text-[#5C5C5C] mr-3" />
            <DropdownArrowIcon className="text-[#97AAB5]" size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
