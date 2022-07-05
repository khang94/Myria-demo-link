import React from 'react';

type Props = {
  className?: string;
  size?: number;
};

export default function ChevronIcon({
  size = 24,
  className = 'text-white',
}: Props) {
  return (
    <div className={className}>
      <svg
        width={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.2902 9.29006C16.9002 8.90006 16.2702 8.90006 15.8802 9.29006L12.0002 13.1701L8.12022 9.29006C7.73022 8.90006 7.10022 8.90006 6.71022 9.29006C6.32022 9.68006 6.32022 10.3101 6.71022 10.7001L11.3002 15.2901C11.6902 15.6801 12.3202 15.6801 12.7102 15.2901L17.3002 10.7001C17.6802 10.3201 17.6802 9.68006 17.2902 9.29006Z"
          fill="#777777"
        />
      </svg>
    </div>
  );
}

ChevronIcon.defaultProps = {
  size: 24,
  className: 'text-white'
}

