import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import Web3 from 'web3';
// @ts-ignore
import { asset } from '@starkware-industries/starkware-crypto-utils';
import { MyriaCoinIcon, Arrow2Icon } from '../../Icons';

type Props = {
  gotoDepositScreen: any;
  gotoWithdrawScreen: any;
  options: any;
  balanceList: any;
  balanceEth: any;
};

export default function MainScreen({
  gotoDepositScreen,
  gotoWithdrawScreen,
  options,
  balanceList,
  balanceEth,
}: Props) {
  const [coinPrices, setCoinPrices] = useState([]);
  useEffect(() => {
    const temp: any = [];
    options.map((option: any, index: number) => {
      let tempOption = option;
      let assetType: string;
      const QUANTUM_CONSTANT = 10000000000;
      if (option.name === 'Ethereum') {
        assetType = asset.getAssetType({
          type: 'ETH',
          data: {
            quantum: QUANTUM_CONSTANT.toString(),
          },
        });
      } else {
        assetType = asset.getAssetType({
          type: 'ERC20',
          data: {
            quantum: '1',
            tokenAddress: option.tokenAddress,
          },
        });
      }
      console.log('hey---assetType', assetType);
      console.log('hey---balanceList', balanceList);
      const matchedBalance = balanceList.filter(
        (item: any) => item.assetType === assetType,
      );
      if (matchedBalance && matchedBalance.length > 0) {
        const balance =
          option.name === 'Ethereum'
            ? Web3.utils.fromWei(
                (
                  matchedBalance[0].quantizedAmount * QUANTUM_CONSTANT
                ).toString(),
              )
            : matchedBalance[0].quantizedAmount;
        tempOption = { ...tempOption, balance };
      } else tempOption = { ...tempOption, balance: 0 };
      temp.push(tempOption);
      return tempOption;
    });
    setCoinPrices(temp);
  }, [balanceList]);
  return (
    <div>
      <div className="mt-[40px]">
        <div className="text-center text-[14px] text-[rgba(255,255,255,0.6)]">
          TOTAL MYRIA BALANCE
        </div>
        <div className="flex justify-center mt-2 items-center">
          <MyriaCoinIcon />
          <div className="text-[32px] ml-2 text-[rgba(255,255,255,0.6)]">
            {balanceEth}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={async () => {
            gotoDepositScreen();
          }}
          className="w-[114px] bg-[#777777] rounded-[8px] flex justify-center items-center text-white text-[14px] py-2 px-[18px] mr-4"
        >
          <Arrow2Icon
            direction="bottom"
            className="text-white mr-1"
            size={16}
          />{' '}
          <span>DEPOSIT</span>
        </button>
        <button
          onClick={() => {
            gotoWithdrawScreen();
          }}
          className="w-[114px] bg-[#777777] rounded-[8px] flex justify-center items-center text-white text-[14px] py-2 px-[18px]"
        >
          <Arrow2Icon direction="top" className="text-white mr-1" size={16} />{' '}
          <span>WITHDRAW</span>
        </button>
      </div>
      <div className="mt-[40px]">
        {coinPrices.map((item: any, index: number) => (
          <div
            className={cn(
              'flex justify-between py-4',
              index !== coinPrices.length - 1 && 'border-b border-[#E5E5E5]',
            )}
            key={index}
          >
            <div className="flex items-center">
              <img
                className="flex-none w-[24px]"
                src={item.ico}
                alt="token_icon"
              />
              <span className="text-[14px] text-[rgba(255,255,255,0.6)] ml-2">
                {item.name}
              </span>
            </div>
            <div>
              {/* <div className="text-[14px] text-[rgba(255,255,255,0.6)] text-right">
                {item.price}
              </div> */}
              <div className="text-[12px] text-[rgba(255,255,255,0.6)] text-right mt-1">
                {item.balance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
