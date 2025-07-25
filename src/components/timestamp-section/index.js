import React from 'react';
import SectionHeader from '../section-header';
import IconButtonBar from '../icon-button-bar';
import './style.scss';

function TimeStampSection({ timestamps }) {
  if (!timestamps || timestamps.length < 2) return null;
  return (
    <div className="timestamp-section flex-center">
      <SectionHeader title="Timestamps" />
      <div className="body">
        {timestamps.map((timestamp, index) =>
          index === 0 ? null : (
            <div className="timestamp text-lg" key={index}>
              <div className="date">{timestamp.date}</div>
              <div className="activity flex">
                {timestamp.activity}&nbsp;
                {timestamp.links && <IconButtonBar links={timestamp.links} />}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default TimeStampSection;
